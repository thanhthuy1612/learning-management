import { type Control } from 'react-hook-form';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';
import { FieldContainer } from 'src/components/form-validation-view/components';

import type { WizardSchemaType } from './type';
// ----------------------------------------------------------------------
type Props = {
  control: Control<WizardSchemaType>;
  loading: boolean;
};
// ----------------------------------------------------------------------

export function StepOne({ control, loading }: Props) {
  return (
    <Grid container spacing={2}>
      <Field.Text name="stepOne.subject" disabled={loading} label="Môn học" />
      <Grid size={{ xs: 12, md: 4 }}>
        <FieldContainer label="Lớp" sx={{ alignItems: 'flex-start', width: '100%', mb: 1 }}>
          <Field.NumberInput name="stepOne.classId" disabled={loading} />
        </FieldContainer>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FieldContainer
          label="Thời gian làm bài"
          sx={{ alignItems: 'flex-start', width: '100%', mb: 1 }}
        >
          <Field.NumberInput name="stepOne.time" disabled={loading} />
        </FieldContainer>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FieldContainer
          label="Số lượng câu hỏi"
          sx={{ alignItems: 'flex-start', width: '100%', mb: 1 }}
        >
          <Field.NumberInput name="stepOne.quantity" disabled={loading} />
        </FieldContainer>
      </Grid>
      <Field.Text name="stepOne.matrix" disabled={loading} multiline rows={10} label="Ma trận đề" />
      <Field.Text
        name="stepOne.document"
        disabled={loading}
        label="Tài liệu tham khảo"
        helperText={
          <Box component="span" sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
            <Iconify icon="solar:info-circle-bold" width={16} />
            Link tài liệu. Không bắt buộc.
          </Box>
        }
      />
    </Grid>
  );
}
