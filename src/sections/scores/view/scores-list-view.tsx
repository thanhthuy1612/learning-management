'use client';

import type { GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import type { IScores, ISubmission, IExamSessionIdRequestBody } from 'src/types/exam-session';

import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Tooltip, IconButton } from '@mui/material';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { useAppDispatch, useAppSelector } from 'src/lib/hooks';
import { examSessionService } from 'src/services/exam-session.services';
import { updateSubmission, updateFiltersScores } from 'src/lib/features';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CopyTitle } from 'src/components/copy/copy-title';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PaginationCustom } from 'src/components/table/pagination-custom';
import { CustomDataGridToolbar } from 'src/components/custom-data-grid/custom-data-grid-toolbar';

import { ExamForm } from '../exam-form';
import { ScoresTableToolbar } from '../scores-table-toolbar';
import { ScoresTableFiltersResult } from '../scores-table-filters-result';

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
  const [pageIndex, setPageIndex] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const apiRef = useGridApiRef();

  const viewForm = useBoolean();

  const dispatch = useAppDispatch();
  const { searchText, filters } = useAppSelector((state) => state.scores);

  const columns: GridColDef[] = [
    {
      field: 'username',
      headerName: 'Tên',
      minWidth: 200,
      flex: 1,
      hideable: false,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'score',
      headerName: 'Điểm',
      minWidth: 200,
      flex: 1,
      hideable: false,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'examSessionId',
      headerName: 'Mã kỳ thi',
      minWidth: 200,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <CopyTitle value={params.row.examSessionId} />,
    },
    {
      field: 'examSessionName',
      headerName: 'Tên kỳ thi',
      minWidth: 200,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'enrollDate',
      headerName: 'Bắt đầu thi',
      flex: 1,
      minWidth: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => `${fDateTime(params.row.enrollDate, 'DD/MM/YYYY h:mm a')}`,
    },
    {
      field: 'lastSubmittedDate',
      headerName: 'Nộp bài',
      flex: 1,
      minWidth: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => `${fDateTime(params.row.lastSubmittedDate, 'DD/MM/YYYY h:mm a')}`,
    },
    {
      field: 'finishedDate',
      headerName: 'Ngày kết thúc',
      flex: 1,
      minWidth: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => `${fDateTime(params.row.finishedDate, 'DD/MM/YYYY')}`,
    },
    {
      field: 'endTime',
      headerName: 'Giờ kết thúc',
      flex: 1,
      minWidth: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => `${fDateTime(params.row.endTime, 'h:mm a')}`,
    },
    {
      type: 'actions',
      field: 'actions',
      align: 'right',
      headerAlign: 'right',
      width: 160,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Xem" placement="top" arrow>
            <IconButton
              color="info"
              onClick={() => {
                viewForm.onTrue();
                dispatch(updateSubmission(params.row.question as ISubmission[]));
              }}
            >
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const fetchData = async (body?: IExamSessionIdRequestBody) => {
    try {
      setLoading(true);
      setPageIndex(1);
      setPageSize(10);
      const newBody: IExamSessionIdRequestBody = body ?? {
        examSessionId: searchText,
      };
      const res = await examSessionService.mark(newBody);
      if (res.total) {
        dispatch(updateFiltersScores(newBody.examSessionId));
        setTotal(res.total);
        setTableData(res.data);
        apiRef.current.setRows(res.data);
      } else {
        setTotal(0);
        setTableData([]);
        apiRef.current.setRows([]);
      }
    } catch (error: any) {
      setTotal(0);
      setTableData([]);
      toast.error(error.toString());
    } finally {
      setLoading(false);
      setLoadingFirst(false);
    }
  };

  React.useEffect(() => {
    if (searchText) {
      fetchData();
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

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Danh sách"
        links={[
          { name: 'Tổng quan', href: paths.dashboard.root },
          { name: 'Điểm thi', href: paths.dashboard.scores.root },
          { name: 'Danh sách' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <ScoresTableToolbar sx={{ p: 2.5 }} onResetPage={fetchData} />

        {!loadingFirst && filters && (
          <ScoresTableFiltersResult
            totalResults={tableData.length}
            onResetPage={fetchData}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        {!!filters && (
          <Box sx={{ position: 'relative' }}>
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
