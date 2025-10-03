import type { IUserItem } from 'src/types/user';

import React from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Alert, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { USER_STATUS_OPTIONS } from 'src/_mock';
import { userService } from 'src/services/user.services';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { USER_LOCAL_STORAGE } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  username: zod.string(),
  email: zod
    .string()
    .min(1, { message: 'Bắt buộc nhập!' })
    .email({ message: 'Địa chỉ email phải là địa chỉ email hợp lệ!' }),
  phone: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  roles: zod.string().array(),
  status: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

export function UserNewEditForm({ currentUser }: Props) {
  const [errorMsg, setErrorMsg] = React.useState('');

  const { checkUserSession } = useAuthContext();

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues: {
      username: currentUser?.username ?? '',
      email: currentUser?.email ?? '',
      phone: currentUser?.phone ?? '',
      roles: [],
      status: (currentUser?.status ?? '').toString() ?? '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const body = {
        email: data.email,
        phone: data.phone,
      };
      const promise = new Promise((resolve, reject) => {
        userService
          .changeInfomation(body)
          .then((res) => {
            if (res) {
              localStorage.setItem(USER_LOCAL_STORAGE, JSON.stringify({ ...currentUser, ...body }));
              resolve('Cập nhật thành công');
              checkUserSession?.();
            } else {
              toast.error(res.message);
              reject(res.message);
            }
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
          <Field.Text disabled name="username" label="Tài khoản" />
          <Field.Text name="email" label="Địa chỉ email" />
          <Field.Phone
            name="phone"
            label="Số điện thoại"
            placeholder="Số điện thoại"
            country="VN"
          />
          {/* <Field.Autocomplete
            multiple
            freeSolo
            disableCloseOnSelect
            name="roles"
            label="Vai trò"
            loading={loading}
            disabled
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
          <Field.Select disabled name="status" label="Trạng thái">
            {USER_STATUS_OPTIONS.map((role) => (
              <MenuItem key={role.type} value={role.type.toString()}>
                {role.label}
              </MenuItem>
            ))}
          </Field.Select>
        </Box>

        <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
          <LoadingButton
            fullWidth
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingIndicator="Đang tải"
            size="large"
          >
            Cập nhật
          </LoadingButton>
        </Stack>
      </Card>
    </Form>
  );
}
