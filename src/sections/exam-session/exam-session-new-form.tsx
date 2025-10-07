import React from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { examSessionService } from 'src/services/exam-session.services';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewExamSessionSchemaType = zod.infer<typeof NewExamSessionSchema>;

export const NewExamSessionSchema = zod.object({
  examTemplateId: zod.string().min(1, { message: 'Bắt buộc nhập!' }),
  name: zod.string().min(1, { message: 'Bắt buộc nhập!' }),
  duration: zod.number().min(1, { message: 'Bắt buộc nhập!' }),
});

// ----------------------------------------------------------------------

export function ExamSessionNewForm() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const router = useRouter();

  const defaultValues: NewExamSessionSchemaType = {
    examTemplateId: '',
    name: '',
    duration: 45,
  };

  const methods = useForm<NewExamSessionSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewExamSessionSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage('');
      const promise = new Promise((resolve, reject) => {
        examSessionService
          .create(data)
          .then(() => {
            resolve('Tạo thành công');
            router.push(paths.dashboard.examSession.list);
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
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        {!!errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}
        <Box
          sx={{
            rowGap: 3,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
          }}
        >
          <Field.Text name="examTemplateId" label="Mã đề" />
          <Field.Text name="name" label="Tên kì thi" />
          <Field.Text type="number" name="duration" label="Thời gian làm bài" />
          {/* <Field.Autocomplete
            multiple
            freeSolo
            disableCloseOnSelect
            name="code"
            label="Mã đề"
            placeholder="+ Mã đề"
            options={_tags.map((option) => option)}
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
                  color="info"
                  variant="soft"
                />
              ))
            }
          /> */}
        </Box>

        <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
          <LoadingButton
            fullWidth
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingIndicator="Đang tải..."
            size="large"
          >
            Tạo thành công
          </LoadingButton>
        </Stack>
      </Card>
    </Form>
  );
}
