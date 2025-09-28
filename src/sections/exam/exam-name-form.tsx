'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { updateName } from 'src/lib/features';
import { useAppDispatch } from 'src/lib/hooks';
import { MainSection } from 'src/layouts/core';
import { AuthCenteredContent } from 'src/layouts/auth-centered';

import { Form, Field } from 'src/components/hook-form';
import { AnimateLogoRotate } from 'src/components/animate';

// ----------------------------------------------------------------------

export type ExamNameSchemaType = zod.infer<typeof ExamNameSchema>;

export const ExamNameSchema = zod.object({
  name: zod.string().min(1, { message: 'Bắt buộc nhập tên!' }),
});

// ----------------------------------------------------------------------

export function ExamNameForm() {
  const dispatch = useAppDispatch();

  const methods = useForm<ExamNameSchemaType>({
    resolver: zodResolver(ExamNameSchema),
    defaultValues: {},
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    dispatch(updateName(data.name));
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="name"
        helperText="Nhập tên theo yêu cầu giáo viên"
        label="Tên"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Gửi..."
      >
        Gửi
      </Button>
    </Box>
  );

  return (
    <MainSection
      sx={[
        (theme) => ({
          alignItems: 'center',
          p: theme.spacing(3, 2, 10, 2),
          [theme.breakpoints.up('md')]: {
            justifyContent: 'center',
            p: theme.spacing(10, 0, 10, 0),
          },
        }),
      ]}
    >
      <AuthCenteredContent sx={{ '--layout-auth-content-width': '420px' }}>
        <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />

        <Form methods={methods} onSubmit={onSubmit}>
          {renderForm()}
        </Form>
      </AuthCenteredContent>
    </MainSection>
  );
}
