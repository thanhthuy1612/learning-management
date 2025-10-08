'use client';

import type { IExamItem } from 'src/types/exam';
import type { Theme, SxProps } from '@mui/material';
import type { IExamSession } from 'src/types/exam-session';
import type { Choice, IQuestionItem } from 'src/types/question';

import React from 'react';
import axios from 'axios';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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

import { useAppSelector } from 'src/lib/hooks';

import { Form } from 'src/components/hook-form';
import { ComponentBox } from 'src/components/layout';
import { Scrollbar } from 'src/components/scrollbar';

import { Choices } from 'src/types/question';

// ----------------------------------------------------------------------

export type ExamFormSchemaType = zod.infer<typeof ExamFormSchema>;

export const ExamFormSchema = zod.object({
  answers: zod.array(
    zod.object({
      question: zod.string().min(1, { message: 'Bắt buộc nhập!' }),
      answer: zod.union([
        zod.enum(Choices, { message: 'Câu trả lời phải là A, B, C hoặc D!' }),
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
  row: IExamItem | IExamSession;
};

// ----------------------------------------------------------------------

export function ExamForm({ sx, open, onClose, row }: Props) {
  const { questions } = useAppSelector((state) => state.examDashboard);

  const methods = useForm<ExamFormSchemaType>({
    resolver: zodResolver(ExamFormSchema),
  });

  const handleDownload = async () => {
    try {
      const response = await axios.post(
        '/api/export',
        {
          title: `\r\n${row.name}`,
          content: `${questions.reduce((result: string, question: IQuestionItem, index) => {
            result += `\r\nCâu hỏi ${index + 1}: ${question.question}\r\n`;
            Choices.map((choice: Choice) => {
              result += `${choice}: ${question.choices?.[choice]}\r\n`;
            }, '');
            result += `Đáp án: ${question.answer}\r\n`;
            return result;
          }, '')}`,
        },
        {
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${row.name}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const { handleSubmit, control, setValue } = methods;

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

  const onSubmit = handleSubmit(async () => {});

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
      <DialogTitle>Xem đề thi</DialogTitle>
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
                    disabled
                    render={({ field: typeField }) => (
                      <FormControl component="fieldset" sx={{ width: 1 }}>
                        <FormLabel component="legend" sx={{ mb: 1, typography: 'subtitle1' }}>
                          {field.question}
                        </FormLabel>
                        <RadioGroup
                          {...typeField}
                          aria-labelledby={`answers.${index}.answer-radios`}
                          onChange={() => {}}
                        >
                          <Grid container spacing={2}>
                            {Choices.map((option) => (
                              <Grid key={option} size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
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
                                      <Radio
                                        color="success"
                                        key={option}
                                        value={option}
                                        onChange={() => {}}
                                      />
                                    }
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
          </DialogContent>
        </Scrollbar>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Huỷ
          </Button>
          <Button variant="contained" onClick={handleDownload}>
            Xuất file
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
