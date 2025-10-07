'use client';

import type { IQuestionItem } from 'src/types/question';
import type { GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import type {
  IExamSession,
  ITypeExamRequestBody,
  IExamSessionRequestBody,
  IExamSessionIdRequestBody,
} from 'src/types/exam-session';

import React from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';
import { defaultPageSize, defaultPageIndex } from 'src/utils/default';

import { DashboardContent } from 'src/layouts/dashboard';
import { useAppDispatch, useAppSelector } from 'src/lib/hooks';
import { examSessionService } from 'src/services/exam-session.services';
import { updateExamChoice, resetStateExamSession } from 'src/lib/features';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CopyTitle } from 'src/components/copy/copy-title';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { SplashScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PaginationCustom } from 'src/components/table/pagination-custom';

import { ExamForm } from 'src/sections/exam-dashboard/exam-form';

import { useAuthContext } from 'src/auth/hooks';

import { ExamSessionTableToolbar } from '../exam-session-table-toolbar';
import { ExamSessionTableFiltersResult } from '../exam-session-table-filters-result';

const HIDE_COLUMNS = {};

// ----------------------------------------------------------------------

export function ExamSessionListView() {
  const [tableData, setTableData] = React.useState<IExamSession[]>([]);
  const [row, setRow] = React.useState<IExamSession>();
  const [total, setTotal] = React.useState<number>(0);
  const [loadingFirst, setLoadingFirst] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [pageIndex, setPageIndex] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const confirmDialog = useBoolean();
  const viewForm = useBoolean();
  const mark = useBoolean();

  const dispatch = useAppDispatch();

  const { user } = useAuthContext();

  const isAdmin = user?.roles[0] === 'admin';

  const { searchText, filters } = useAppSelector((state) => state.examSession);

  const apiRef = useGridApiRef();

  const router = useRouter();

  React.useEffect(() => {
    dispatch(resetStateExamSession());
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'code',
      headerName: 'Code',
      minWidth: 150,
      hideable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <CopyTitle value={params.row.code} />,
    },
    {
      field: 'name',
      headerName: 'Tên',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'duration',
      headerName: 'Thời gian',
      minWidth: 80,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <CopyTitle value={params.row.duration} />,
    },
    {
      field: 'createdDate',
      headerName: 'Ngày tạo',
      flex: 1,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => `${fDateTime(params.row.createdDate, 'DD/MM/YYYY HH:mm')}`,
    },
    {
      field: 'isOpen',
      headerName: 'Trạng thái',
      minWidth: 80,
      flex: 1,
      hideable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
        >
          <Tooltip title={params.row.isOpen ? 'Dừng' : 'Bắt đầu'} placement="top" arrow>
            <IconButton
              color={params.row.isOpen ? 'error' : 'success'}
              onClick={() => {
                confirmDialog.onTrue();
                setRow(params.row);
              }}
              disabled={isAdmin}
            >
              <Iconify
                icon={params.row.isOpen ? 'solar:stop-circle-bold' : 'solar:play-circle-bold'}
              />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    {
      type: 'actions',
      field: 'actions',
      align: 'right',
      headerAlign: 'right',
      width: isAdmin ? 80 : 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!!(!isAdmin && !params.row.isOpen) && (
            <Tooltip title="Chấm điểm" placement="top" arrow>
              <IconButton
                color="inherit"
                onClick={() => {
                  mark.onTrue();
                  setRow(params.row);
                }}
              >
                <Iconify icon="solar:file-text-bold" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Xem" placement="top" arrow>
            <IconButton
              color="inherit"
              onClick={() => {
                viewForm.onTrue();
                setRow(params.row);
                dispatch(updateExamChoice(params.row.question as IQuestionItem[]));
              }}
            >
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xem điểm" placement="top" arrow>
            <IconButton
              color="inherit"
              onClick={() => {
                router.push(paths.dashboard.scores.list(params.row.id));
              }}
            >
              <Iconify icon="solar:cup-star-bold" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const fetchData = async (body?: IExamSessionRequestBody) => {
    try {
      setLoading(true);
      const newBody: IExamSessionRequestBody = body ?? {
        name: searchText,
        pageIndex,
        pageSize,
      };
      const res = await examSessionService.list(newBody);
      if (res.total) {
        setTotal(res.total);
        setTableData(res.data);
      } else {
        setTotal(0);
        setTableData([]);
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
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  const resetPage = async (newPageIndex = pageIndex) => {
    if (pageIndex === 1) {
      await fetchData({
        name: searchText,
        pageIndex: newPageIndex,
        pageSize,
      });
    } else {
      setPageIndex(1);
    }
  };

  const resetPageSize = async (newPageSize = pageSize) => {
    if (pageIndex === 1) {
      await fetchData({
        name: searchText,
        pageIndex,
        pageSize: newPageSize,
      });
    } else {
      setPageIndex(1);
    }
  };

  const resetPageResult = async (body?: IExamSessionRequestBody) => {
    if (pageIndex === 1) {
      await fetchData(body);
    } else {
      setPageIndex(1);
    }
  };

  const onStartRow = () => {
    try {
      const promise = new Promise((resolve, reject) => {
        examSessionService
          .openOrClose({
            examSessionId: row?.id,
            isOpen: !row?.isOpen,
          } as ITypeExamRequestBody)
          .then(() => {
            resolve('Cập nhật thành công');
            fetchData();
          })
          .catch((e) => {
            toast.error(e);
            reject(e);
          });
        confirmDialog.onFalse();
      });

      toast.promise(promise, {
        loading: 'Đang tải',
        success: 'Cập nhật thành công',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onMarkRow = () => {
    try {
      const promise = new Promise((resolve, reject) => {
        examSessionService
          .mark({
            examSessionId: row?.id,
          } as IExamSessionIdRequestBody)
          .then(() => {
            resolve('Cập nhật thành công');
            fetchData();
          })
          .catch((e) => {
            toast.error(e);
            reject(e);
          });
      });

      toast.promise(promise, {
        loading: 'Đang tải',
        success: 'Cập nhật thành công',
      });
      mark.onFalse();
    } catch (error) {
      console.error(error);
    }
  };

  const renderViewForm = () =>
    row && (
      <ExamForm
        open={viewForm.value}
        onClose={() => {
          viewForm.onFalse();
        }}
        row={row}
      />
    );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Xác nhận"
      content={`Bạn chắc chắn muốn ${row?.isOpen ? 'dừng' : 'bắt đầu'} kỳ thi`}
      action={
        <Button variant="contained" color="inherit" onClick={onStartRow}>
          Xác nhận
        </Button>
      }
    />
  );

  const renderMarkDialog = () => (
    <ConfirmDialog
      open={mark.value}
      onClose={mark.onFalse}
      title="Xác nhận"
      content="Bạn chắc chắn muốn chấm điểm?"
      action={
        <Button variant="contained" color="inherit" onClick={onMarkRow}>
          Xác nhận
        </Button>
      }
    />
  );

  if (loadingFirst) return <SplashScreen />;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Danh sách"
        links={[
          { name: 'Tổng quan', href: paths.dashboard.root },
          { name: 'Kỳ thi', href: paths.dashboard.examSession.root },
          { name: 'Danh sách' },
        ]}
        // action={
        //   !isAdmin && (
        //     <Button
        //       component={RouterLink}
        //       href={paths.dashboard.examSession.new}
        //       variant="contained"
        //       startIcon={<Iconify icon="mingcute:add-line" />}
        //     >
        //       Thêm mới
        //     </Button>
        //   )
        // }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <ExamSessionTableToolbar
          sx={{ p: 2.5 }}
          onResetPage={() =>
            resetPageResult({
              name: searchText,
              pageIndex: defaultPageIndex,
              pageSize: defaultPageSize,
            })
          }
        />

        {!loadingFirst && filters?.name && (
          <ExamSessionTableFiltersResult
            totalResults={tableData.length}
            onResetPage={resetPageResult}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}
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
            apiRef={apiRef}
            loading={loading}
            columns={columns}
            rows={tableData}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnSorting
            slots={{
              // toolbar: (props) => (
              //   <CustomDataGridToolbar {...props} showSearch={false} sx={{ pt: 0 }} />
              // ),
              pagination: () => (
                <PaginationCustom
                  page={pageIndex}
                  count={Math.ceil(total / pageSize)}
                  rowsPerPage={pageSize}
                  onChange={(_event, page) => {
                    setPageIndex(page);
                  }}
                  onRowsPerPageChange={(pagesize: number) => {
                    setPageSize(pagesize);
                    resetPageSize(pagesize);
                  }}
                  total={total}
                  optionAll
                />
              ),
              noRowsOverlay: () => <EmptyContent title="Không có kết quả" />,
              noResultsOverlay: () => <EmptyContent title="Không tìm thấy kết quả" />,
            }}
          />
        </Box>
      </Card>
      {renderViewForm()}
      {renderConfirmDialog()}
      {renderMarkDialog()}
    </DashboardContent>
  );
}
