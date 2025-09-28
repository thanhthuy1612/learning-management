import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { _roles } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewExamSessionSchemaType = zod.infer<typeof NewExamSessionSchema>;

export const NewExamSessionSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  role: zod.string().min(1, { message: 'Role is required!' }),
  status: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

export function ExamSessionNewEditForm({ currentUser }: Props) {
  const router = useRouter();

  const defaultValues: NewExamSessionSchemaType = {
    status: '',
    name: '',
    email: '',
    phoneNumber: '',
    role: '',
  };

  const methods = useForm<NewExamSessionSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewExamSessionSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
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
          <Field.Text name="name" label="Full name" />
          <Field.Text name="email" label="Email address" />
          <Field.Phone name="phoneNumber" label="Phone number" country="VN" />
          <Field.Select name="role" label="Role">
            {_roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
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
            loadingIndicator="Loading"
            size="large"
          >
            {!currentUser ? 'Create user' : 'Save changes'}
          </LoadingButton>
        </Stack>
      </Card>
    </Form>
  );
}
