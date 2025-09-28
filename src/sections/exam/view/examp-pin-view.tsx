'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Form, Field } from 'src/components/hook-form';
import { AnimateLogoRotate } from 'src/components/animate';

// ----------------------------------------------------------------------

export type ExamPinSchemaType = zod.infer<typeof ExamPinSchema>;

export const ExamPinSchema = zod.object({
  code: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .length(6, { message: 'Code must be exactly 8 characters!' }),
});

// ----------------------------------------------------------------------

export function ExamPinView() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const methods = useForm<ExamPinSchemaType>({
    resolver: zodResolver(ExamPinSchema),
    defaultValues: {},
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    router.push(paths.exam('1'));
    // try {
    //   await ExamPinWithPassword({ email: data.email, password: data.password });
    //   await checkUserSession?.();
    //   router.refresh();
    // } catch (error) {
    //   console.error(error);
    //   const feedbackMessage = getErrorMessage(error);
    //   setErrorMessage(feedbackMessage);
    // }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Code name="code" />

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
    <>
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}
