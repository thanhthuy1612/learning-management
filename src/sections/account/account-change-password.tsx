import React from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';

import { userService } from 'src/services/user.services';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type ChangePassWordSchemaType = zod.infer<typeof ChangePassWordSchema>;

export const ChangePassWordSchema = zod
  .object({
    oldPassword: zod
      .string()
      .min(1, { message: 'Bắt buộc nhập!' })
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự!' }),
    newPassword: zod.string().min(1, { message: 'Bắt buộc nhập!' }),
    confirmNewPassword: zod.string().min(1, { message: 'Bắt buộc nhập!' }),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'Mật khẩu mới phải khác mật khẩu cũ',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Mật khẩu không khớp!',
    path: ['confirmNewPassword'],
  });

// ----------------------------------------------------------------------

export function AccountChangePassword() {
  const [errorMsg, setErrorMsg] = React.useState('');
  const router = useRouter();
  const showPassword = useBoolean();

  const defaultValues: ChangePassWordSchemaType = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm<ChangePassWordSchemaType>({
    mode: 'all',
    resolver: zodResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const promise = new Promise((resolve, reject) => {
        userService
          .changePasswordMe({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmNewPassword,
          })

          .then(() => {
            resolve('Cập nhật thành công');
            router.push(paths.dashboard.user.list);
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
      <Card
        sx={{
          p: 3,
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {!!errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg}
          </Alert>
        )}
        <Field.Text
          name="oldPassword"
          type={showPassword.value ? 'text' : 'password'}
          label="Mật khẩu cũ"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Field.Text
          name="newPassword"
          label="Mật khẩu mới"
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          helperText={
            <Box component="span" sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
              <Iconify icon="solar:info-circle-bold" width={16} /> Mật khẩu phải có ít nhất 6 ký tự!
            </Box>
          }
        />

        <Field.Text
          name="confirmNewPassword"
          type={showPassword.value ? 'text' : 'password'}
          label="Xác nhật mật khẩu mới"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Cập nhật
        </Button>
      </Card>
    </Form>
  );
}
