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
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import { useAppDispatch } from 'src/lib/hooks';
import { DashboardContent } from 'src/layouts/dashboard';
import { examSessionService } from 'src/services/exam-session.services';
import { updateExamChoice, updateFiltersScores, updateSearchTextScores } from 'src/lib/features';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CopyTitle } from 'src/components/copy/copy-title';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PaginationCustom } from 'src/components/table/pagination-custom';
import { CustomDataGridToolbar } from 'src/components/custom-data-grid/custom-data-grid-toolbar';

import { ExamForm } from 'src/sections/exam-dashboard/exam-form';

import { useAuthContext } from 'src/auth/hooks';

const HIDE_COLUMNS = { createdDate: false, modifiedDate: false };

// ----------------------------------------------------------------------

export function ExamSessionListView() {
  const [tableData, setTableData] = React.useState<IExamSession[]>([]);
  const [row, setRow] = React.useState<IExamSession>();
  const [total, setTotal] = React.useState<number>(0);
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

  const apiRef = useGridApiRef();

  const router = useRouter();

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Mã',
      minWidth: 200,
      flex: 1,
      hideable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <CopyTitle value={params.row.id} />,
    },
    {
      field: 'code',
      headerName: 'Code',
      minWidth: 200,
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
      minWidth: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => `${fDateTime(params.row.createdDate, 'DD/MM/YYYY h:mm a')}`,
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
      width: 120,
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
                dispatch(updateExamChoice(params.row.question as IQuestionItem[]));
              }}
            >
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chấm điểm" placement="top" arrow>
            <IconButton
              color="default"
              onClick={() => {
                mark.onTrue();
                setRow(params.row);
              }}
            >
              <Iconify icon="solar:heart-bold" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xem điểm" placement="top" arrow>
            <IconButton
              color="primary"
              onClick={() => {
                dispatch(updateFiltersScores(params.row.id));
                dispatch(updateSearchTextScores(params.row.id));
                router.push(paths.dashboard.scores.list);
              }}
            >
              <Iconify icon="solar:file-check-bold-duotone" />
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
        ownerId: user?.id,
        pageIndex,
        pageSize,
      };
      const res = await examSessionService.list(newBody);
      if (res.total) {
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
    }
  };

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  const resetPage = async (newPageSize = pageSize) => {
    if (pageIndex === 1) {
      await fetchData({
        ownerId: user?.id,
        pageIndex,
        pageSize: newPageSize,
      });
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
    } catch (error) {
      console.error(error);
    }
  };

  const renderViewForm = () => (
    <ExamForm
      open={viewForm.value}
      onClose={() => {
        viewForm.onFalse();
      }}
    />
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Xác nhận"
      content={`Bạn chắc chắn muốn ${row?.isOpen ? 'dừng' : 'bắt đầu'} kỳ thi`}
      action={
        <Button variant="contained" color="error" onClick={onStartRow}>
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
        <Button variant="contained" color="error" onClick={onMarkRow}>
          Xác nhận
        </Button>
      }
    />
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Danh sách"
        links={[
          { name: 'Tổng quan', href: paths.dashboard.root },
          { name: 'Kỳ thi', href: paths.dashboard.examSession.root },
          { name: 'Danh sách' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.examSession.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Thêm mới
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Box sx={{ position: 'relative' }}>
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
              toolbar: (props) => (
                <CustomDataGridToolbar {...props} showSearch={false} sx={{ pt: 0 }} />
              ),
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
                    resetPage(pagesize);
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
