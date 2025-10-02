'use client';

import type { IQuestionItem } from 'src/types/question';
import type { GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import type { IExamItem, IExamRequestBody, IExamEditRequestBody } from 'src/types/exam';

import React from 'react';

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
import { defaultPageSize, defaultPageIndex } from 'src/utils/default';

import { useAppDispatch } from 'src/lib/hooks';
import { DashboardContent } from 'src/layouts/dashboard';
import { examService } from 'src/services/exam.services';
import { updateExamId, updateExamName, updateExamChoice } from 'src/lib/features';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CopyTitle } from 'src/components/copy/copy-title';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PaginationCustom } from 'src/components/table/pagination-custom';
import { CustomDataGridToolbar } from 'src/components/custom-data-grid/custom-data-grid-toolbar';

import { ExamSessionQuickEditForm } from 'src/sections/exam-session/exam-session-quick-edit-form';

import { useAuthContext } from 'src/auth/hooks';

import { ExamForm } from '../exam-form';
import { ExamEditForm } from '../exam-edit-form';

const HIDE_COLUMNS = { createdDate: false, modifiedDate: false };

// ----------------------------------------------------------------------

export function ExamListView() {
  const [tableData, setTableData] = React.useState<IExamItem[]>([]);
  const [row, setRow] = React.useState<IExamItem>();
  const [total, setTotal] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [pageIndex, setPageIndex] = React.useState<number>(defaultPageIndex);
  const [pageSize, setPageSize] = React.useState<number>(defaultPageSize);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const { user } = useAuthContext();

  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();
  const viewForm = useBoolean();
  const createSession = useBoolean();

  const dispatch = useAppDispatch();

  const apiRef = useGridApiRef();

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
      field: 'name',
      headerName: 'Tên',
      minWidth: 200,
      flex: 1,
      hideable: false,
      align: 'center',
      headerAlign: 'center',
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
      field: 'modifiedDate',
      headerName: 'Ngày cập nhật',
      flex: 1,
      minWidth: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => `${fDateTime(params.row.createdDate, 'DD/MM/YYYY h:mm a')}`,
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
          <Tooltip title="Tạo kỳ thi" placement="top" arrow>
            <IconButton
              color="primary"
              onClick={() => {
                createSession.onTrue();
                setRow(params.row);
              }}
            >
              <Iconify icon="solar:export-bold" />
            </IconButton>
          </Tooltip>

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

          <Tooltip title="Sửa" placement="top" arrow>
            <IconButton
              color="inherit"
              onClick={() => {
                quickEditForm.onTrue();
                dispatch(updateExamChoice(params.row.question as IQuestionItem[]));
                dispatch(updateExamName(params.row.name));
                dispatch(updateExamId(params.row.id));
              }}
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Xoá" placement="top" arrow>
            <IconButton
              color="error"
              onClick={() => {
                confirmDialog.onTrue();
                setRow(params.row);
              }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const fetchData = async (body?: IExamRequestBody) => {
    try {
      setLoading(true);
      const newBody: IExamRequestBody = body ?? {
        ownerId: user?.id,
        pageIndex,
        pageSize,
      };
      const res = await examService.list(newBody);
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

  const onDeleteRow = () => {
    try {
      const promise = new Promise((resolve, reject) => {
        examService
          .edit({
            ...row,
            isDeleted: true,
          } as IExamEditRequestBody)
          .then(() => {
            resolve('Xoá thành công');
            fetchData();
          })
          .catch((e) => {
            toast.error(e);
            reject(e);
          });
      });

      toast.promise(promise, {
        loading: 'Đang tải',
        success: 'Xoá thành công',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderQuickEditForm = () => (
    <ExamEditForm
      open={quickEditForm.value}
      onClose={() => {
        quickEditForm.onFalse();
        fetchData();
      }}
    />
  );

  const renderViewForm = () => (
    <ExamForm
      open={viewForm.value}
      onClose={() => {
        viewForm.onFalse();
      }}
    />
  );

  const renderSessionForm = () => (
    <ExamSessionQuickEditForm
      open={createSession.value}
      onClose={() => {
        createSession.onFalse();
        fetchData();
      }}
      examTemplateId={row?.id}
    />
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Xoá"
      content="Bạn có chắc chắc muốn xoá?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Xoá
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
          { name: 'Đề thi', href: paths.dashboard.exam.root },
          { name: 'Danh sách' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.exam.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Thêm mới
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
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
      </Card>
      {renderQuickEditForm()}
      {renderConfirmDialog()}
      {renderViewForm()}
      {renderSessionForm()}
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
