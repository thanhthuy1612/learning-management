'use client';

import type { Theme, SxProps } from '@mui/material';

import React from 'react';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Grid, Radio, FormLabel, RadioGroup, FormControl, FormControlLabel } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAppSelector } from 'src/lib/hooks';

import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { ComponentBox } from 'src/components/layout';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { Choices } from 'src/types/question';

import { ExamHeader } from './exam-header';
import { ExamFooter } from './exam-footer';

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
  handleSend: (error?: string) => void;
  sx?: SxProps<Theme>;
};

// ----------------------------------------------------------------------

export function ExamFormView({ handleSend, sx }: Props) {
  const [dataSubmit, setDataSubmit] = React.useState<ExamFormSchemaType>();
  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  const ref = React.useRef<HTMLDivElement | null>(null);

  const confirmDialog = useBoolean();

  const { questions } = useAppSelector((state) => state.exam);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.1, // Điều chỉnh ngưỡng nếu cần
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  const methods = useForm<ExamFormSchemaType>({
    resolver: zodResolver(ExamFormSchema),
  });

  const {
    handleSubmit,
    control,
    watch,
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
      questions.map((item) => ({ question: item.question, answer: '' }))
    );
  }, [questions, setValue]);

  const answers = watch('answers');

  const onSubmit = handleSubmit(async (data) => {
    setDataSubmit(data);
    console.log(data);
    confirmDialog.onTrue();
  });

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button
          color="primary"
          variant="contained"
          loading={isSubmitting}
          onClick={() => {
            console.log(dataSubmit);
          }}
          loadingIndicator="Nộp bài..."
          sx={{ zIndex: 2 }}
          startIcon={<Iconify width={16} icon="custom:send-fill" />}
        >
          Nộp bài
        </Button>
      }
    />
  );

  const renderButtonSubmit = () => (
    <Button
      color="primary"
      type="submit"
      variant="contained"
      loading={isSubmitting}
      loadingIndicator="Nộp bài..."
      sx={{ zIndex: 2 }}
      startIcon={<Iconify width={16} icon="custom:send-fill" />}
    >
      Nộp bài
    </Button>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <ExamHeader ref={ref} sx={sx} renderButtonSubmit={renderButtonSubmit()} fields={answers} />

      <Box sx={{ gap: 3, mb: 5, display: 'flex', flexDirection: 'column' }}>
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
              render={({ field: typeField }) => (
                <FormControl component="fieldset" sx={{ width: 1 }}>
                  <FormLabel component="legend" sx={{ mb: 1, typography: 'subtitle1' }}>
                    {field.question}
                  </FormLabel>
                  <RadioGroup {...typeField} aria-labelledby={`answers.${index}.answer-radios`}>
                    <Grid container spacing={2}>
                      {Choices.map((option) => (
                        <Grid key={option} size={{ xs: 12, md: 6 }}>
                          <Button
                            variant="outlined"
                            fullWidth
                            color={typeField.value === option ? 'primary' : 'inherit'}
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
      {isVisible && (
        <ExamFooter sx={sx} renderButtonSubmit={renderButtonSubmit()} fields={answers} />
      )}
      {renderConfirmDialog()}
    </Form>
  );
}
