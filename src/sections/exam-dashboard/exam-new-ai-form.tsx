import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewExamSchemaType = zod.infer<typeof NewExamSchema>;

export const NewExamSchema = zod.object({
  code: zod.string().min(1, { message: 'Required!' }),
  subject: zod.string().min(1, { message: 'Required!' }),
  class: zod.number().min(1, { message: 'Min 1!' }).max(12, 'Max 12'!),
  quantity: zod.number().min(1, { message: 'Required!' }),
  matrix: zod.string().min(1, { message: 'Required!' }),
  document: zod.string().min(1, { message: 'Required!' }).optional(),
});

// ----------------------------------------------------------------------

export function ExamNewAIForm() {
  const router = useRouter();

  const defaultValues: NewExamSchemaType = {
    code: '',
    subject: '',
    class: 6,
    quantity: 20,
    matrix: '',
    document: '',
  };

  const methods = useForm<NewExamSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewExamSchema),
    defaultValues,
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
      toast.success('Tạo mới thành công');
      router.push(paths.dashboard.exam.list);
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
          <Field.Text name="subject" label="Môn học" />
          <Field.Text type="number" name="class" label="Lớp" />
          <Field.Text type="number" name="quantity" label="Số lượng câu" />
          <Field.Text name="code" label="Mã đề" />
          <Field.Text name="matrix" multiline rows={5} label="Ma trận đề" />
          <Field.Text
            name="document"
            label="Tài liệu tham khảo"
            helperText={
              <Box component="span" sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                <Iconify icon="solar:info-circle-bold" width={16} />
                Link tài liệu. Không bắt buộc.
              </Box>
            }
          />
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
            Tạo đề thi
          </LoadingButton>
        </Stack>
      </Card>
    </Form>
  );
}
