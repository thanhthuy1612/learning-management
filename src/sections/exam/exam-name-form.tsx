'use client';

import type { IPinRequestBody } from 'src/types/question';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { quitService } from 'src/services/quit.services';
import { useAppDispatch, useAppSelector } from 'src/lib/hooks';
import { updateName, updateData, updateQuestions, updateErrorStepOne } from 'src/lib/features';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type ExamNameSchemaType = zod.infer<typeof ExamNameSchema>;

export const ExamNameSchema = zod.object({
  name: zod.string().min(1, { message: 'Bắt buộc nhập tên!' }),
});

// ----------------------------------------------------------------------

export function ExamNameForm() {
  const { pin } = useAppSelector((state) => state.exam);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const methods = useForm<ExamNameSchemaType>({
    resolver: zodResolver(ExamNameSchema),
    defaultValues: { name: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    dispatch(updateName(data.name));
    try {
      const promise = new Promise((resolve, reject) => {
        quitService
          .pin({ code: pin, username: data.name } as IPinRequestBody)
          .then((res) => {
            dispatch(updateData(res));
            dispatch(updateQuestions(res.question));
            resolve('Tạo thành công');
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
        success: 'Tạo thành công',
      });
    } catch (error: any) {
      dispatch(updateErrorStepOne(error));
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="name"
        helperText={
          <Box component="span" sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
            <Iconify icon="solar:info-circle-bold" width={16} />
            Nhập tên theo yêu cầu giáo viên
          </Box>
        }
        label="Tên"
        slotProps={{ inputLabel: { shrink: true } }}
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
