'use client';

import type { IUserItem } from 'src/types/user';

import React from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import { Tab, Tabs, Alert } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import { USER_STATUS_OPTIONS } from 'src/_mock';
import { userService } from 'src/services/user.services';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

type Props = {
  open: boolean;
  onClose: () => void;
  currentUser?: IUserItem;
};

const NAV_ITEMS = [
  {
    id: 1,
    label: 'Cập nhật trạng thái',
    icon: <Iconify width={24} icon="eva:star-fill" />,
  },
  {
    id: 2,
    label: 'Đổi mật khẩu',
    icon: <Iconify width={24} icon="solar:lock-password-outline" />,
  },
];

export function UserQuickEditForm({ currentUser, open, onClose }: Props) {
  const [tabSelected, setTagSelected] = React.useState<number>(NAV_ITEMS[0].id);

  const handleChangeTab = React.useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setTagSelected(newValue);
  }, []);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>Chỉnh sửa</DialogTitle>
      <Box
        sx={{
          mx: 3,
        }}
      >
        <Tabs value={tabSelected} onChange={handleChangeTab} sx={{ mb: 5 }}>
          {NAV_ITEMS.map((tab) => (
            <Tab key={tab.id} label={tab.label} icon={tab.icon} value={tab.id} />
          ))}
        </Tabs>
      </Box>
      {tabSelected === NAV_ITEMS[0].id ? (
        <UserEditStatus onClose={onClose} currentUser={currentUser} />
      ) : (
        <UserEditPassword onClose={onClose} currentUser={currentUser} />
      )}
    </Dialog>
  );
}

// ----------------------------------------------------------------------

export type UserEditStatusSchemaType = zod.infer<typeof UserEditStatusSchema>;

export const UserEditStatusSchema = zod.object({
  status: zod.string(),
});

// ----------------------------------------------------------------------

type UserEditStatusProps = {
  onClose: () => void;
  currentUser?: IUserItem;
};
function UserEditStatus({ onClose, currentUser }: UserEditStatusProps) {
  const [errorMsg, setErrorMsg] = React.useState('');

  const defaultValues: UserEditStatusSchemaType = {
    status: currentUser?.status?.toString() ?? '',
  };

  const methods = useForm<UserEditStatusSchemaType>({
    mode: 'all',
    resolver: zodResolver(UserEditStatusSchema),
    defaultValues,
    values: { status: currentUser?.status?.toString() ?? '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const promise = new Promise((resolve, reject) => {
        userService
          .changeStatus({
            status: USER_STATUS_OPTIONS.find((item) => item.type === data.status)?.value ?? 0,
            userId: currentUser?.id ?? '',
          })
          .then(() => {
            resolve('Cập nhật thành công');
            onClose?.();
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
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box
        sx={{
          rowGap: 3,
          columnGap: 2,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
          mx: 3,
        }}
      >
        {!!errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg}
          </Alert>
        )}

        <Field.Select name="status" label="Trạng thái">
          {USER_STATUS_OPTIONS.map((role) => (
            <MenuItem key={role.type} value={role.type}>
              {role.label}
            </MenuItem>
          ))}
        </Field.Select>
      </Box>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Huỷ
        </Button>

        <Button type="submit" variant="contained" loading={isSubmitting}>
          Cập nhật
        </Button>
      </DialogActions>
    </Form>
  );
}
export type UserEditPasswordSchemaType = zod.infer<typeof UserEditPasswordSchema>;

export const UserEditPasswordSchema = zod.object({
  password: zod.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự!'),
});
// ----------------------------------------------------------------------

type UserEditPasswordProps = {
  onClose: () => void;
  currentUser?: IUserItem;
};
function UserEditPassword({ onClose, currentUser }: UserEditPasswordProps) {
  const [errorMsg, setErrorMsg] = React.useState('');

  const defaultValues: UserEditPasswordSchemaType = {
    password: '',
  };

  const methods = useForm<UserEditPasswordSchemaType>({
    mode: 'all',
    resolver: zodResolver(UserEditPasswordSchema),
    defaultValues,
    values: { password: currentUser?.password ?? '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const promise = new Promise((resolve, reject) => {
        userService
          .changePassword({
            password: data.password,
            userId: currentUser?.id ?? '',
          })
          .then(() => {
            resolve('Cập nhật thành công');
            onClose?.();
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
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error);
    }
  });
  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box
        sx={{
          rowGap: 3,
          columnGap: 2,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
          mx: 3,
        }}
      >
        {!!errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg}
          </Alert>
        )}
        <Field.Text name="password" label="Mật khẩu" />
      </Box>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Huỷ
        </Button>

        <Button type="submit" variant="contained" loading={isSubmitting}>
          Cập nhật
        </Button>
      </DialogActions>
    </Form>
  );
}
