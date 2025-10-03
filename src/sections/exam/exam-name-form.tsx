'use client';

import type { IPinRequestBody } from 'src/types/question';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { useAppDispatch } from 'src/lib/hooks';
import { quizService } from 'src/services/quiz.services';
import {
  updateName,
  updateData,
  updateQuestions,
  updateTargetDate,
  updateErrorStepOne,
} from 'src/lib/features';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type ExamNameSchemaType = zod.infer<typeof ExamNameSchema>;

export const ExamNameSchema = zod.object({
  code: zod.string().min(1, { message: 'Yêu cầu bắt buộc nhập mã phòng thi!' }),
  name: zod.string().min(1, { message: 'Bắt buộc nhập tên!' }),
});

// ----------------------------------------------------------------------

export function ExamNameForm() {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const methods = useForm<ExamNameSchemaType>({
    resolver: zodResolver(ExamNameSchema),
    defaultValues: { name: '', code: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    dispatch(updateName(data.name));
    try {
      const promise = new Promise((resolve, reject) => {
        quizService
          .pin({ code: data.code, username: data.name } as IPinRequestBody)
          .then((res) => {
            dispatch(updateData(res));
            dispatch(updateQuestions(res.question));
            dispatch(
              updateTargetDate(new Date(new Date().getTime() + res.duration * 60 * 1000).getTime())
            );
            resolve('Bắt đầu thi');
            router.push(paths.exam);
          })
          .catch((e) => {
            toast.error(e);
            dispatch(updateErrorStepOne(e));
            reject(e);
          });
      });

      toast.promise(promise, {
        loading: 'Đang tải',
        success: 'Bắt đầu thi',
      });
    } catch (error: any) {
      dispatch(updateErrorStepOne(error));
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text name="code" label="Mã phòng thi" />
      <Field.Text
        name="name"
        helperText={
          <Box component="span" sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
            <Iconify icon="solar:info-circle-bold" width={16} />
            Nhập tên theo yêu cầu giáo viên
          </Box>
        }
        label="Tên"
      />

      <LoadingButton
        color="primary"
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Gửi..."
      >
        Gửi
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      {renderForm()}
    </Form>
  );
}
