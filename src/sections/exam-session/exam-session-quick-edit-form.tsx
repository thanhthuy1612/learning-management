import React from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { examSessionService } from 'src/services/exam-session.services';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view/components';

// ----------------------------------------------------------------------

export type NewExamSessionSchemaType = zod.infer<typeof NewExamSessionSchema>;

export const NewExamSessionSchema = zod.object({
  examTemplateId: zod.string().min(1, { message: 'Bắt buộc nhập!' }),
  name: zod.string().min(1, { message: 'Bắt buộc nhập!' }),
  duration: zod.number().int().min(1, { message: 'Bắt buộc nhập!' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  examTemplateId?: string;
};

export function ExamSessionQuickEditForm({ examTemplateId, open, onClose }: Props) {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const defaultValues: NewExamSessionSchemaType = {
    examTemplateId: examTemplateId ?? '',
    name: '',
    duration: 45,
  };

  const methods = useForm<NewExamSessionSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewExamSessionSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  React.useEffect(() => {
    reset();
    setValue('examTemplateId', examTemplateId ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examTemplateId]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage('');
      const promise = new Promise((resolve, reject) => {
        examSessionService
          .create(data)
          .then(() => {
            resolve('Tạo thành công');
            onClose?.();
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
      setErrorMessage(error);
    }
  });

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
      <DialogTitle>Tạo kỳ thi</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        {!!errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}
        <DialogContent>
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              mt: 2,
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
            }}
          >
            <Field.Text disabled={Boolean(examTemplateId)} name="examTemplateId" label="Mã đề" />
            <Field.Text disabled={isSubmitting} name="name" label="Tên kỳ thi" />
            <FieldContainer label="Thời gian làm bài" sx={{ alignItems: 'flex-start' }}>
              <Field.NumberInput name="duration" disabled={isSubmitting} />
            </FieldContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Huỷ
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            Tạo mới
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
