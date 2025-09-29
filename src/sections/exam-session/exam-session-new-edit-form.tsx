import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Chip } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { _tags } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const OPTIONS = [
  { value: 'option 1', label: 'Option 1' },
  { value: 'option 2', label: 'Option 2' },
  { value: 'option 3', label: 'Option 3' },
  { value: 'option 4', label: 'Option 4' },
  { value: 'option 5', label: 'Option 5' },
  { value: 'option 6', label: 'Option 6' },
  { value: 'option 7', label: 'Option 7' },
  { value: 'option 8', label: 'Option 8' },
];

// ----------------------------------------------------------------------

export type NewExamSessionSchemaType = zod.infer<typeof NewExamSessionSchema>;

export const NewExamSessionSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  startDate: schemaHelper.date({ message: { required: 'Start date is required!' } }),
  duration: zod.number().min(1, { message: 'Required!' }),
  code: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
});

// ----------------------------------------------------------------------

type Props = {
  currentValue?: NewExamSessionSchemaType;
};

export function ExamSessionNewEditForm({ currentValue }: Props) {
  const router = useRouter();

  const defaultValues: NewExamSessionSchemaType = {
    name: '',
    startDate: null,
    duration: 45,
    code: [],
  };

  const methods = useForm<NewExamSessionSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewExamSessionSchema),
    defaultValues,
    values: currentValue,
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
      toast.success(currentValue ? 'Cập nhập thành công!' : 'Tạo mới thành công!');
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
          <Field.Text name="name" label="Tên kì thi" />
          {/* <Field.DatePicker format="dd/mm/yyyy" name="startDate" label="Thời gian bắt đầu thi" /> */}
          <Field.Text name="duration" label="Thời gian làm bài" />
          <Field.Autocomplete
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
          />
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
            {!currentValue ? 'Tạo thành công' : 'Lưu thay đổi'}
          </LoadingButton>
        </Stack>
      </Card>
    </Form>
  );
}
