'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { updatePin } from 'src/lib/features';
import { useAppDispatch } from 'src/lib/hooks';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type ExamPinSchemaType = zod.infer<typeof ExamPinSchema>;

export const ExamPinSchema = zod.object({
  code: zod.string().min(1, { message: 'Yêu cầu bắt buộc nhập mã phòng thi!' }),
});

// ----------------------------------------------------------------------

export function ExamPinForm() {
  const dispatch = useAppDispatch();

  const methods = useForm<ExamPinSchemaType>({
    resolver: zodResolver(ExamPinSchema),
    defaultValues: { code: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    dispatch(updatePin(data.code));
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text name="code" placeholder="Mã phòng thi" />

      <Button
        color="primary"
        fullWidth
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
    <Form methods={methods} onSubmit={onSubmit}>
      {renderForm()}
    </Form>
  );
}
