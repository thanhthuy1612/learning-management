'use client';

import type { Theme, SxProps } from '@mui/material';
import type { IQuestionItem } from 'src/types/question';

import React from 'react';
import { z as zod } from 'zod';
import { varAlpha } from 'minimal-shared/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Grid,
  Radio,
  Alert,
  Drawer,
  RadioGroup,
  FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAppSelector } from 'src/lib/hooks';
import { examService } from 'src/services/exam.services';

import { toast } from 'src/components/snackbar';
import { ComponentBox } from 'src/components/layout';
import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { Choices } from 'src/types/question';

// ----------------------------------------------------------------------

export type ExamFormSchemaType = zod.infer<typeof ExamFormSchema>;

export const ExamFormSchema = zod.object({
  name: zod.string().min(1, { message: 'Bắt buộc nhập!' }),
  answers: zod.array(
    zod.object({
      id: zod.string(),
      question: zod.string().min(1, 'Bắt buộc nhập!'),
      choices: zod.record(zod.enum(Choices), zod.string().min(1, 'Bắt buộc nhập!')),
      answer: zod.enum(Choices, { message: 'Câu trả lời phải là A, B, C hoặc D!' }),
    })
  ),
});

// ----------------------------------------------------------------------
type Props = {
  open: boolean;
  onClose: () => void;
  sx?: SxProps<Theme>;
  isView?: boolean;
};

// ----------------------------------------------------------------------

export function ExamEditForm({ sx, isView = false, onClose, open }: Props) {
  const [dataSubmit, setDataSubmit] = React.useState<ExamFormSchemaType>();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const confirmDialog = useBoolean();

  const { questions, name, id } = useAppSelector((state) => state.examDashboard);

  const methods = useForm<ExamFormSchemaType>({
    resolver: zodResolver(ExamFormSchema),
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const { fields } = useFieldArray({
    control,
    name: 'answers',
  });

  React.useEffect(() => {
    setValue(
      'answers',
      questions.map((item: any) => ({
        id: item?.id ?? '',
        question: item?.question ?? '',
        answer: item?.answer ?? '',
        choices: item?.choices,
      }))
    );
  }, [questions, setValue]);

  React.useEffect(() => {
    setValue('name', name);
  }, [name, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setDataSubmit(data);
    confirmDialog.onTrue();
  });

  const onHandleSubmit = () => {
    try {
      setErrorMessage('');
      const promise = new Promise((resolve, reject) => {
        examService
          .edit({
            id,
            name: dataSubmit?.name ?? '',
            questions: (dataSubmit?.answers ?? []).map(
              (item) =>
                ({
                  id: item.id,
                  question: item.question,
                  choices: item.choices,
                  answer: item.answer,
                }) as IQuestionItem
            ),
            isDeleted: false,
          })
          .then(() => {
            resolve('Chỉnh sửa thành công');
            onClose?.();
          })
          .catch((e) => {
            toast.error(e);
            reject(e);
          });
      });

      toast.promise(promise, {
        loading: 'Đang tải',
        success: 'Chỉnh sửa thành công',
      });
    } catch (error: any) {
      setErrorMessage(error);
    }
  };

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Chỉnh sửa"
      content="Bạn có chắc chắc muốn chỉnh sửa?"
      action={
        <Button
          color="primary"
          variant="contained"
          loading={isSubmitting}
          onClick={onHandleSubmit}
          loadingIndicator="Chỉnh sửa..."
          sx={{ zIndex: 2 }}
        >
          Chỉnh sửa
        </Button>
      }
    />
  );

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { invisible: true },
        paper: {
          sx: [
            (theme) => ({
              ...theme.mixins.paperStyles(theme, {
                color: varAlpha(theme.vars.palette.background.defaultChannel, 0.9),
              }),
              width: '100%',
            }),
            ...(Array.isArray(sx) ? sx : [sx]),
          ],
        },
      }}
    >
      <DialogTitle>Chỉnh sửa</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        {!!errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}
        <Scrollbar sx={{ maxHeight: '70vh' }}>
          <DialogContent sx={{ pt: 2 }}>
            <Box display="flex" flexDirection="column" gap={3} sx={{ mt: 2 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Field.Text {...field} sx={{ width: '100%' }} label="Tên" />}
              />
              <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
                {fields.map((field, index) => (
                  <ComponentBox
                    id={`question_${index}`}
                    title={`Câu ${index + 1}:`}
                    key={`question_${index}`}
                    sx={{ ...sx }}
                  >
                    <Controller
                      name={`answers.${index}.question`}
                      control={control}
                      render={({ field: questionField }) => (
                        <Field.Text {...questionField} label="Câu hỏi" />
                      )}
                    />
                    <Controller
                      name={`answers.${index}.answer`}
                      control={control}
                      render={({ field: typeField }) => (
                        <FormControl component="fieldset" sx={{ width: 1 }}>
                          <RadioGroup
                            {...typeField}
                            aria-labelledby={`answers.${index}.answer-radios`}
                          >
                            <Grid container spacing={2}>
                              {Choices.map((option) => (
                                <Grid
                                  key={option}
                                  size={{ xs: 12, md: 6 }}
                                  sx={{ display: 'flex' }}
                                >
                                  <Button
                                    variant="outlined"
                                    fullWidth
                                    color={typeField.value === option ? 'success' : 'inherit'}
                                    sx={{ flexGrow: 1 }}
                                  >
                                    <FormControlLabel
                                      key={option}
                                      value={option}
                                      control={
                                        <Radio color="success" key={option} value={option} />
                                      }
                                      label={
                                        <Controller
                                          name={`answers.${index}.choices.${option}`}
                                          control={control}
                                          render={({ field: choicesField }) => (
                                            <Field.Text {...choicesField} sx={{ width: '100%' }} />
                                          )}
                                        />
                                      }
                                      sx={{
                                        width: '100%',
                                        height: '100%',
                                        '& .MuiFormControlLabel-label': {
                                          width: '100%',
                                        },
                                        '& .MuiFormControlLabel-root': {
                                          mr: 0,
                                        },
                                      }}
                                    />
                                  </Button>
                                </Grid>
                              ))}
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      )}
                    />
                  </ComponentBox>
                ))}
              </Box>
            </Box>
            {renderConfirmDialog()}
          </DialogContent>
        </Scrollbar>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Huỷ
          </Button>

          {!isView && (
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Cập nhật
            </LoadingButton>
          )}
        </DialogActions>
      </Form>
    </Drawer>
  );
}
