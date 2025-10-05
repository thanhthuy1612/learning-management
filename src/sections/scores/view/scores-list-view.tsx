'use client';

import type { GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import type { IScores, ISubmission, IExamSessionIdRequestBody } from 'src/types/exam-session';

import React from 'react';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Tooltip, IconButton } from '@mui/material';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';
import { defaultPageIndex } from 'src/utils/default';

import { DashboardContent } from 'src/layouts/dashboard';
import { useAppDispatch, useAppSelector } from 'src/lib/hooks';
import { examSessionService } from 'src/services/exam-session.services';
import { updateSubmission, updateFiltersScores, updateSearchTextScores } from 'src/lib/features';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { SplashScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PaginationCustom } from 'src/components/table/pagination-custom';
import {
  localeText,
  CustomDataGridToolbar,
} from 'src/components/custom-data-grid/custom-data-grid-toolbar';

import { ExamForm } from '../exam-form';

const HIDE_COLUMNS = {
  enrollDate: false,
  lastSubmittedDate: false,
  finishedDate: false,
  endTime: false,
};

// ----------------------------------------------------------------------

export function ScoresListView() {
  const [tableData, setTableData] = React.useState<IScores[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [loadingFirst, setLoadingFirst] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [pageIndex, setPageIndex] = React.useState<number>(defaultPageIndex);
  const [pageSize, setPageSize] = React.useState<number>(100);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>({});

  const apiRef = useGridApiRef();

  const viewForm = useBoolean();
  const param = useParams();

  const dispatch = useAppDispatch();
  const { searchText, filters } = useAppSelector((state) => state.scores);

  const columns: GridColDef[] = [
    {
      field: 'username',
      headerName: 'Tên',
      minWidth: 150,
      flex: 1,
      hideable: false,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'score',
      headerName: 'Điểm',
      minWidth: 80,
      flex: 1,
      hideable: false,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'examSessionName',
      headerName: 'Tên kỳ thi',
      minWidth: 150,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'enrollDate',
      headerName: 'Bắt đầu thi',
      flex: 1,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (value) => `${fDateTime(value)}`,
      renderCell: (params) => `${fDateTime(params.row.enrollDate, 'DD/MM/YYYY HH:MM')}`,
    },
    {
      field: 'lastSubmittedDate',
      headerName: 'Nộp bài',
      flex: 1,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (value) => `${fDateTime(value)}`,
      renderCell: (params) => `${fDateTime(params.row.lastSubmittedDate, 'DD/MM/YYYY HH:MM')}`,
    },
    {
      type: 'actions',
      field: 'actions',
      align: 'right',
      headerAlign: 'right',
      width: 40,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {typeof params.row.score === 'number' && (
            <Tooltip title="Xem" placement="top" arrow>
              <IconButton
                color="info"
                onClick={() => {
                  viewForm.onTrue();
                  dispatch(updateSubmission(params.row.submission as ISubmission[]));
                }}
              >
                <Iconify icon="solar:eye-bold" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  const fetchData = async (body?: IExamSessionIdRequestBody) => {
    try {
      setLoading(true);
      setPageIndex(defaultPageIndex);
      setPageSize(100);
      const newBody: IExamSessionIdRequestBody = body ?? {
        examSessionId: searchText,
      };
      const res = await examSessionService.scores(newBody);
      dispatch(updateFiltersScores(newBody.examSessionId));
      setTotal(res.length);
      setTableData(res);
    } catch (error: any) {
      toast.error(error);
      setTotal(0);
      setTableData([]);
    } finally {
      setLoading(false);
      setLoadingFirst(false);
    }
  };

  React.useEffect(() => {
    const id = (param?.id ?? '').toString();
    if (id) {
      dispatch(updateSearchTextScores(id));
      fetchData({ examSessionId: id });
    } else {
      setLoadingFirst(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderViewForm = () => (
    <ExamForm
      open={viewForm.value}
      onClose={() => {
        viewForm.onFalse();
      }}
    />
  );

  if (loadingFirst) return <SplashScreen />;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Danh sách"
        links={[
          { name: 'Tổng quan', href: paths.dashboard.root },
          { name: 'Điểm thi', href: paths.dashboard.scores.list((param?.id ?? '').toString()) },
          { name: 'Danh sách' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        {!!filters && (
          <Box
            sx={
              !tableData.length
                ? {
                    minHeight: 400,
                    flexGrow: { md: 1 },
                    display: { md: 'flex' },
                    height: { xs: 800, md: '1px' },
                    flexDirection: { md: 'column' },
                  }
                : {}
            }
          >
            <DataGrid
              paginationModel={{
                page: pageIndex - 1,
                pageSize,
              }}
              apiRef={apiRef}
              loading={loading}
              columns={columns}
              rows={tableData}
              columnVisibilityModel={columnVisibilityModel}
              onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
              disableRowSelectionOnClick
              localeText={{
                ...localeText,
              }}
              slots={{
                toolbar: (props) => <CustomDataGridToolbar {...props} showSearch sx={{ pt: 0 }} />,
                pagination: () => (
                  <PaginationCustom
                    total={total}
                    page={pageIndex}
                    count={Math.ceil(total / pageSize)}
                    rowsPerPage={pageSize}
                    onChange={(_event, page) => {
                      setPageIndex(page);
                    }}
                    onRowsPerPageChange={(pagesize: number) => {
                      setPageSize(pagesize);
                      setPageIndex(1);
                    }}
                  />
                ),
                noRowsOverlay: () => <EmptyContent title="Không có kết quả" />,
                noResultsOverlay: () => <EmptyContent title="Không tìm thấy kết quả" />,
              }}
            />
          </Box>
        )}
      </Card>
      {renderViewForm()}
    </DashboardContent>
  );
}
