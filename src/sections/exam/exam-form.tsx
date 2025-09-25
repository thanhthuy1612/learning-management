'use client';

import type { Theme, SxProps } from '@mui/material';
import type { IQuestionItem } from 'src/types/question';

import React from 'react';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Grid, Radio, FormLabel, RadioGroup, FormControl, FormControlLabel } from '@mui/material';

import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { ComponentBox } from 'src/components/layout';

import { Choices } from 'src/types/question';

import { ExamHeader } from './exam-header';

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
  questions: IQuestionItem[];
  sx?: SxProps<Theme>;
};

// ----------------------------------------------------------------------

export function ExamFormView({ handleSend, questions, sx }: Props) {
  const [isVisible, setIsVisible] = React.useState(false);
  const targetScrollPosition = 500;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY >= targetScrollPosition) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const methods = useForm<ExamFormSchemaType>({
    resolver: zodResolver(ExamFormSchema),
    defaultValues: {
      answers: questions.map((item) => ({ question: item.question, answer: '' })),
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const { fields } = useFieldArray({
    control,
    name: 'answers',
  });

  const onSubmit = handleSubmit(async (data) => {
    handleSend();
  });

  const renderButtonSubmit = () => (
    <Button
      fullWidth
      color="inherit"
      type="submit"
      variant="contained"
      loading={isSubmitting}
      loadingIndicator="Sign in..."
      sx={{ zIndex: 2 }}
      startIcon={<Iconify width={16} icon="custom:send-fill" />}
    >
      Nộp bài
    </Button>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <ExamHeader
        sx={sx}
        targetDate={new Date('2025-09-26 23:09')}
        renderButtonSubmit={renderButtonSubmit()}
      />

      <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
        {fields.map((field, index) => (
          <ComponentBox title={`Câu ${index + 1}:`} key={`question_${index}`} sx={{ ...sx }}>
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
                          <Button variant="outlined" fullWidth>
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
    </Form>
  );
}
