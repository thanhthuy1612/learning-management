import { Controller, type Control } from 'react-hook-form';

import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';

import type { WizardSchemaType } from './type';
// ----------------------------------------------------------------------
type Props = {
  control: Control<WizardSchemaType>;
  loading: boolean;
};
// ----------------------------------------------------------------------

export function StepOne({ control, loading }: Props) {
  return (
    <>
      <Controller
        name="stepOne.subject"
        control={control}
        render={({ field }) => <Field.Text disabled={loading} {...field} label="Môn học" />}
      />
      <Controller
        name="stepOne.classId"
        control={control}
        render={({ field }) => (
          <Field.Text disabled={loading} type="number" {...field} label="Lớp" />
        )}
      />
      <Controller
        name="stepOne.time"
        control={control}
        render={({ field }) => (
          <Field.Text {...field} disabled={loading} type="number" label="Thời gian làm bài" />
        )}
      />
      <Controller
        name="stepOne.quantity"
        control={control}
        render={({ field }) => (
          <Field.Text {...field} disabled={loading} type="number" label="Số lượng câu hỏi" />
        )}
      />
      <Controller
        name="stepOne.matrix"
        control={control}
        render={({ field }) => (
          <Field.Text disabled={loading} multiline rows={10} {...field} label="Ma trận đề" />
        )}
      />
      <Controller
        name="stepOne.document"
        control={control}
        render={({ field }) => (
          <Field.Text
            {...field}
            disabled={loading}
            label="Tài liệu tham khảo"
            helperText={
              <Box component="span" sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                <Iconify icon="solar:info-circle-bold" width={16} />
                Link tài liệu. Không bắt buộc.
              </Box>
            }
          />
        )}
      />
    </>
  );
}
