'use client';

import type { Theme, SxProps } from '@mui/material';
import type { Control, FieldArrayWithId } from 'react-hook-form';

import React from 'react';
import { Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Grid, Radio, RadioGroup, FormControl, FormControlLabel } from '@mui/material';

import { Field } from 'src/components/hook-form';
import { ComponentBox } from 'src/components/layout';

import { Choices } from 'src/types/question';

import type { WizardSchemaType } from './type';

// ----------------------------------------------------------------------
type Props = {
  sx?: SxProps<Theme>;
  control: Control<WizardSchemaType>;
  fields: FieldArrayWithId<WizardSchemaType, 'stepTwo.answers', 'id'>[];
};

// ----------------------------------------------------------------------

export function StepTwo({ sx, control, fields }: Props) {
  return (
    <Box display="flex" flexDirection="column" gap={3} sx={{ mt: 2 }}>
      <Controller
        name="stepTwo.name"
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
              name={`stepTwo.answers.${index}.question`}
              control={control}
              render={({ field: questionField }) => (
                <Field.Text {...questionField} label="Câu hỏi" />
              )}
            />
            <Controller
              name={`stepTwo.answers.${index}.answer`}
              control={control}
              render={({ field: typeField }) => (
                <FormControl component="fieldset" sx={{ width: 1 }}>
                  <RadioGroup {...typeField} aria-labelledby={`answers.${index}.answer-radios`}>
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
                              label={
                                <Controller
                                  name={`stepTwo.answers.${index}.choices.${option}`}
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
  );
}
