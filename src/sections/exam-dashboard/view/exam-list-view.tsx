'use client';

import type { IUserItem } from 'src/types/user';
import type { IExamTableFilters } from 'src/types/exam';
import type { IQuestionItem } from 'src/types/question';
import type { GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';

import React from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAppDispatch } from 'src/lib/hooks';
import { _question } from 'src/_mock/_question';
import { updateExamChoice } from 'src/lib/features';
import { DashboardContent } from 'src/layouts/dashboard';
import { _roles, _userList, USER_STATUS_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PaginationCustom } from 'src/components/table/pagination-custom';
import { useTable, getComparator, TableSelectedAction } from 'src/components/table';
import { CustomDataGridToolbar } from 'src/components/custom-data-grid/custom-data-grid-toolbar';

import { ExamForm } from '../exam-form';
import { ExamTableToolbar } from '../exam-table-toolbar';
import { ExamTableFiltersResult } from '../exam-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

// ----------------------------------------------------------------------

export function ExamListView() {
  const [tableData, setTableData] = React.useState<IUserItem[]>(_userList);
  const [row, setRow] = React.useState<IUserItem>();
  const [total, setTotal] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [pageIndex, setPageIndex] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>({});

  const table = useTable();

  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();
  const viewForm = useBoolean();

  const dispatch = useAppDispatch();

  const apiRef = useGridApiRef();

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
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
      hideable: false,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 200,
      flex: 1,
      hideable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Label
          variant="soft"
          color={
            (params.row.status === 'active' && 'success') ||
            (params.row.status === 'pending' && 'warning') ||
            (params.row.status === 'banned' && 'error') ||
            'default'
          }
        >
          {params.row.status}
        </Label>
      ),
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: 'Actions',
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
                dispatch(updateExamChoice(_question.De_1 as IQuestionItem[]));
                setRow(params.row);
              }}
            >
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Sửa" placement="top" arrow>
            <IconButton
              color="primary"
              onClick={() => {
                quickEditForm.onTrue();
                dispatch(updateExamChoice(_question.De_1 as IQuestionItem[]));
                setRow(params.row);
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

  const filters = useSetState<IExamTableFilters>({ name: '', status: 'all' });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const canReset = !!currentFilters.name || currentFilters.status !== 'all';

  const handleFilterStatus = React.useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  const onDeleteRow = () => {};

  const renderQuickEditForm = () => (
    <ExamForm open={quickEditForm.value} onClose={quickEditForm.onFalse} />
  );

  const renderViewForm = () => <ExamForm isView open={viewForm.value} onClose={viewForm.onFalse} />;

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
        <Tabs
          value={currentFilters.status}
          onChange={handleFilterStatus}
          sx={[
            (theme) => ({
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }),
          ]}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
                    'soft'
                  }
                  color={
                    (tab.value === 'active' && 'success') ||
                    (tab.value === 'pending' && 'warning') ||
                    (tab.value === 'banned' && 'error') ||
                    'default'
                  }
                >
                  {['active', 'pending', 'banned', 'rejected'].includes(tab.value)
                    ? tableData.filter((user) => user.status === tab.value).length
                    : tableData.length}
                </Label>
              }
            />
          ))}
        </Tabs>

        <ExamTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
          options={{ roles: _roles }}
        />

        {canReset && (
          <ExamTableFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((r) => r.id)
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={confirmDialog.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            }
          />

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
                    // resetPage(pagesize);
                  }}
                  total={total}
                  optionAll
                />
              ),
              noRowsOverlay: () => <EmptyContent title="No results" />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
          />
        </Box>
      </Card>
      {renderQuickEditForm()}
      {renderConfirmDialog()}
      {renderViewForm()}
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IUserItem[];
  filters: IExamTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((user) => user.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  return inputData;
}
