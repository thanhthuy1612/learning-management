'use client';

import type { IRole } from 'src/types/user';

import React from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, MenuItem, IconButton, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { userService } from 'src/services/user.services';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  username: zod.string().min(1, { message: 'Bắt buộc nhập!' }),
  email: zod
    .string()
    .min(1, { message: 'Bắt buộc nhập!' })
    .email({ message: 'Địa chỉ email phải là địa chỉ email hợp lệ!' }),
  phone: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  // roles: zod.string().array().min(1, { message: 'Bắt buộc chọn!' }),
  roleId: zod.string(),
  password: zod
    .string()
    .min(1, { message: 'Bắt buộc nhập!' })
    .min(8, { message: 'Mật khẩu phải có ít nhất 6 ký tự!' }),
});

// ----------------------------------------------------------------------

export function UserNewForm() {
  const [errorMsg, setErrorMsg] = React.useState('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [roles, setRoles] = React.useState<IRole[]>([]);

  const router = useRouter();

  const showPassword = useBoolean();

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
      phone: '',
      // roles: [],
      roleId: '',
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await userService.roles();
      setRoles(
        res.map((item: IRole) => ({
          id: item.id,
          name: item.name,
          description: item.description,
        }))
      );
    } catch (error: any) {
      toast.error(error.toString());
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const promise = new Promise((resolve, reject) => {
        userService
          .createUser(data)
          .then(() => {
            resolve('Tạo thành công');
            router.push(paths.dashboard.user.list);
          })
          .catch((e) => {
            toast.error(e);
            reject(e);
          });
      });

      toast.promise(promise, {
        loading: 'Đang tải',
        success: 'Tạo thành công',
      });
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <Box
          sx={{
            rowGap: 3,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
          }}
        >
          {!!errorMsg && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMsg}
            </Alert>
          )}
          <Field.Text name="username" label="Tài khoản" />
          <Field.Text name="email" label="Địa chỉ email" />
          <Field.Text
            name="password"
            label="Mật khẩu"
            placeholder="6+ ký tự"
            type={showPassword.value ? 'text' : 'password'}
            slotProps={{
              inputLabel: { shrink: true },
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
          <Field.Phone name="phone" label="Số điện thoại" country="VN" />
          {/* <Field.Autocomplete
            multiple
            freeSolo
            disableCloseOnSelect
            name="roles"
            label="Vai trò"
            loading={loading}
            disabled={loading}
            options={roles.map((option) => option.description)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="primary"
                  variant="soft"
                />
              ))
            }
          /> */}
          <Field.Select name="roleId" label="Vai trò" disabled={loading}>
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.description}
              </MenuItem>
            ))}
          </Field.Select>
        </Box>

        <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
          <LoadingButton
            fullWidth
            type="submit"
            variant="contained"
            loading={isSubmitting || loading}
            loadingIndicator="Loading"
            size="large"
          >
            Tạo
          </LoadingButton>
        </Stack>
      </Card>
    </Form>
  );
}
