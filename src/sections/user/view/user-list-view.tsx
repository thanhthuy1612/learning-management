'use client';

import type { IRole, IUserItem, IUserRequestBody } from 'src/types/user';
import type { GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';

import React from 'react';
import { toast } from 'sonner';

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

import { USER_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { userService } from 'src/services/user.services';
import { useAppDispatch, useAppSelector } from 'src/lib/hooks';
import { resetStateUser, updateFiltersUser } from 'src/lib/features';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { SplashScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PaginationCustom } from 'src/components/table/pagination-custom';

import { UserTableToolbar } from '../user-table-toolbar';
import { UserQuickEditForm } from '../user-quick-edit-form';

const HIDE_COLUMNS = { createdDate: false, modifiedDate: false };
// ----------------------------------------------------------------------
export function UserListView() {
  const [tableData, setTableData] = React.useState<IUserItem[]>([]);
  const [row, setRow] = React.useState<IUserItem>();
  const [total, setTotal] = React.useState<number>(0);
  const [loadingFirst, setLoadingFirst] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [pageIndex, setPageIndex] = React.useState<number>(defaultPageIndex);
  const [pageSize, setPageSize] = React.useState<number>(defaultPageSize);
  const [roles, setRoles] = React.useState<IRole[]>([]);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const quickEditForm = useBoolean();

  const dispatch = useAppDispatch();
  const { searchText } = useAppSelector((state) => state.user);

  const apiRef = useGridApiRef();

  React.useEffect(() => {
    dispatch(resetStateUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'username',
      headerName: 'Tài khoản',
      minWidth: 200,
      flex: 1,
      hideable: false,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 200,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'phone',
      headerName: 'Số điện thoại',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'role',
      headerName: 'Vai trò',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => `${roles.find((item) => item.name === params.row.role)?.description}`,
    },
    {
      field: 'createdDate',
      headerName: 'Ngày tạo',
      flex: 1,
      minWidth: 180,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => `${fDateTime(params.row.createdDate, 'DD/MM/YYYY HH:mm')}`,
    },
    {
      field: 'modifiedDate',
      headerName: 'Ngày cập nhật',
      flex: 1,
      minWidth: 180,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => `${fDateTime(params.row.createdDate, 'DD/MM/YYYY HH:mm')}`,
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Label
          variant="soft"
          color={
            (params.row.status === 'ACTIVE' && 'success') ||
            (params.row.status === 'INACTIVE' && 'default') ||
            (params.row.status === 'BANNED' && 'error') ||
            'warning'
          }
        >
          {USER_STATUS_OPTIONS.find((item) => item.type === params.row.status)?.label}
        </Label>
      ),
    },
    {
      type: 'actions',
      field: 'actions',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton
              color={quickEditForm.value ? 'inherit' : 'default'}
              onClick={() => {
                quickEditForm.onTrue();
                setRow(params.row);
              }}
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];
  const fetchData = async (body?: IUserRequestBody) => {
    try {
      setLoading(true);
      const newBody: IUserRequestBody = body ?? {
        searchText,
        pageIndex,
        pageSize,
      };
      const res = await userService.list(newBody);
      if (loadingFirst || !roles.length) {
        const resRole = await userService.roles();
        setRoles(
          resRole.map((item: IRole) => ({
            id: item.id,
            name: item.name,
            description: item.description,
          }))
        );
      }
      if (res.total) {
        dispatch(updateFiltersUser(newBody));
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
        searchText,
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
        searchText,
        pageIndex,
        pageSize: newPageSize,
      });
    } else {
      setPageIndex(1);
    }
  };

  const resetPageResult = async (body?: IUserRequestBody) => {
    if (pageIndex === 1) {
      await fetchData(body);
    } else {
      setPageIndex(1);
    }
  };

  const renderQuickEditForm = () => (
    <UserQuickEditForm
      currentUser={row}
      open={quickEditForm.value}
      onClose={() => {
        quickEditForm.onFalse();
        resetPage(1);
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
          { name: 'Người dùng', href: paths.dashboard.user.root },
          { name: 'Danh sách' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.user.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Thêm mới
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <UserTableToolbar
          sx={{ p: 2.5 }}
          onResetPage={() =>
            resetPageResult({
              searchText,
              pageIndex: defaultPageIndex,
              pageSize: defaultPageSize,
            })
          }
        />

        {/* {!loadingFirst && filters?.searchText && (
          <UserTableFiltersResult
            totalResults={tableData.length}
            onResetPage={resetPageResult}
            sx={{ p: 2.5, pt: 0 }}
          />
        )} */}

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
            loading={loadingFirst || loading}
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
      {renderQuickEditForm()}
    </DashboardContent>
  );
}
