'use client';

import type { Theme, SxProps } from '@mui/material';

import React from 'react';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Grid,
  Radio,
  Dialog,
  FormLabel,
  RadioGroup,
  FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAppSelector } from 'src/lib/hooks';

import { Form } from 'src/components/hook-form';
import { ComponentBox } from 'src/components/layout';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { Choices } from 'src/types/question';

// ----------------------------------------------------------------------

export type ExamFormSchemaType = zod.infer<typeof ExamFormSchema>;

export const ExamFormSchema = zod.object({
  answers: zod.array(
    zod.object({
      question: zod.string(),
      answer: zod.union([
        zod.enum(Choices, { message: 'Answer must be one of A, B, C, or D!' }),
        zod.enum(['']),
      ]),
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

export function ExamForm({ sx, isView = false, open, onClose }: Props) {
  const [dataSubmit, setDataSubmit] = React.useState<ExamFormSchemaType>();

  const confirmDialog = useBoolean();

  const { questions } = useAppSelector((state) => state.examDashboard);

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
      questions.map((item) => ({ question: item.question, answer: item?.answer ?? '' }))
    );
  }, [questions, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setDataSubmit(data);
    console.log(data);
    confirmDialog.onTrue();
  });

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
          onClick={() => {
            console.log(dataSubmit);
          }}
          loadingIndicator="Chỉnh sửa..."
          sx={{ zIndex: 2 }}
        >
          Chỉnh sửa
        </Button>
      }
    />
  );

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
      <DialogTitle>Chỉnh sửa đề thi</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <Scrollbar sx={{ maxHeight: '70vh' }}>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
              {fields.map((field, index) => (
                <ComponentBox
                  id={`question_${index}`}
                  title={`Câu ${index + 1}:`}
                  key={`question_${index}`}
                  sx={{ ...sx }}
                >
                  <Controller
                    name={`answers.${index}.answer`}
                    control={control}
                    disabled={isView}
                    render={({ field: typeField }) => (
                      <FormControl component="fieldset" sx={{ width: 1 }}>
                        <FormLabel component="legend" sx={{ mb: 1, typography: 'subtitle1' }}>
                          {field.question}
                        </FormLabel>
                        <RadioGroup
                          {...typeField}
                          aria-labelledby={`answers.${index}.answer-radios`}
                        >
                          <Grid container spacing={2}>
                            {Choices.map((option) => (
                              <Grid key={option} size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                                <Button
                                  variant="outlined"
                                  fullWidth
                                  color={typeField.value === option ? 'primary' : 'inherit'}
                                  sx={{ flexGrow: 1 }}
                                >
                                  <FormControlLabel
                                    key={option}
                                    value={option}
                                    control={<Radio key={option} value={option} />}
                                    label={questions[index].choices[option]}
                                    sx={{ width: '100%', height: '100%' }}
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
            {renderConfirmDialog()}
          </DialogContent>
        </Scrollbar>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Huỷ
          </Button>

          {!isView && (
            <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
              Cập nhật
            </LoadingButton>
          )}
        </DialogActions>
      </Form>
    </Dialog>
  );
}
