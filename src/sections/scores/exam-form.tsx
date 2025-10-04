'use client';

import type { Theme, SxProps } from '@mui/material';

import React from 'react';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  Grid,
  Radio,
  Drawer,
  FormLabel,
  RadioGroup,
  FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

import { varAlpha } from 'src/theme/styles';
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
};

// ----------------------------------------------------------------------

export function ExamForm({ sx, open, onClose }: Props) {
  const { submission } = useAppSelector((state) => state.scores);

  const methods = useForm<ExamFormSchemaType>({
    resolver: zodResolver(ExamFormSchema),
  });

  const { handleSubmit, control, setValue } = methods;

  const { fields } = useFieldArray({
    control,
    name: 'answers',
  });

  React.useEffect(() => {
    setValue(
      'answers',
      (submission ?? []).map((item) => ({
        question: item.question,
        answer: item.submittedAnswer ?? '',
      }))
    );
  }, [submission, setValue]);

  const onSubmit = handleSubmit(async () => {});

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
                          onChange={() => {}}
                          aria-labelledby={`answers.${index}.answer-radios`}
                        >
                          <Grid container spacing={2}>
                            {Choices.map((option) => (
                              <Grid key={option} size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                                <Button
                                  variant="outlined"
                                  fullWidth
                                  color={
                                    submission[index].answer === option
                                      ? 'success'
                                      : option === submission[index].submittedAnswer
                                        ? 'error'
                                        : 'inherit'
                                  }
                                  sx={{ flexGrow: 1 }}
                                >
                                  <FormControlLabel
                                    key={option}
                                    value={option}
                                    control={
                                      <Radio
                                        color={
                                          submission[index].answer === option
                                            ? 'success'
                                            : option === submission[index].submittedAnswer
                                              ? 'error'
                                              : 'default'
                                        }
                                        key={option}
                                        value={option}
                                        onChange={() => {}}
                                      />
                                    }
                                    label={submission[index].choices[option]}
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
        </DialogActions>
      </Form>
    </Drawer>
  );
}
