'use client';

import type { IQuestionItem } from 'src/types/question';

import React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import { Box, Alert, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { prompt } from 'src/utils/default';

import { DashboardContent } from 'src/layouts/dashboard';
import { examService } from 'src/services/exam.services';

import { Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Stepper, StepCompleted } from 'src/components/form-wizard/form-steps';

import { StepTwo } from '../step-two';
import { StepOne } from '../step-one';
import { steps, matrixExam, WizardSchema } from '../type';

import type { WizardSchemaType } from '../type';
// ----------------------------------------------------------------------

export function ExamCreateView() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [loadingStepOne, setLoadingStepOne] = React.useState<boolean>(false);

  const router = useRouter();

  const defaultValues: WizardSchemaType = {
    stepOne: {
      subject: '',
      classId: 6,
      time: 45,
      quantity: 16,
      matrix: matrixExam,
      document: '',
    },
    stepTwo: {
      name: '',
      answers: [],
    },
  };

  const methods = useForm<WizardSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(WizardSchema),
    defaultValues,
  });

  const {
    reset,
    trigger,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const { fields } = useFieldArray({
    control,
    name: 'stepTwo.answers',
  });

  const handleNext = React.useCallback(
    async (step?: 'stepOne') => {
      if (step) {
        const isValid = await trigger(step);

        if (isValid) {
          try {
            setLoadingStepOne(true);
            const { subject, classId, time, matrix, document, quantity } = getValues('stepOne');
            const res = await examService.prompt(
              prompt(
                subject,
                Number(classId),
                document ?? '',
                matrix,
                Number(time),
                Number(quantity)
              )
            );
            setValue(
              'stepTwo.answers',
              res.map((item: any) => ({
                id: item?.id ?? '',
                question: item?.question ?? '',
                answer: item?.answer ?? '',
                choices: item?.choices,
              }))
            );
          } catch (e: any) {
            setErrorMessage(e);
          } finally {
            setLoadingStepOne(false);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setErrorMessage(null);
          }
        } else {
          setErrorMessage('Vui lòng nhập thông tin đúng yêu cầu');
        }
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    },
    [getValues, setValue, trigger]
  );

  const handleBack = React.useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handleReset = React.useCallback(() => {
    reset();
    setActiveStep(0);
  }, [reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage('');
      const promise = new Promise((resolve, reject) => {
        examService
          .create({
            name: data.stepTwo.name,
            questions: data.stepTwo.answers.map(
              (item) =>
                ({
                  id: item.id,
                  question: item.question,
                  choices: item.choices,
                  answer: item.answer,
                }) as IQuestionItem
            ),
          })
          .then(() => {
            resolve('Tạo thành công');
            router.push(paths.dashboard.exam.list);
          })
          .catch((e) => {
            toast.error(e);
            reject(e);
          });
      });

      toast.promise(promise, {
        loading: 'Đang tải',
        success: 'Tạo thành công',
      });
    } catch (error: any) {
      setErrorMessage(error);
    }
  });

  const completedStep = activeStep === steps.length;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Tạo đề thi mới"
        links={[
          { name: 'Tổng quan', href: paths.dashboard.root },
          { name: 'Đề thi', href: paths.dashboard.exam.root },
          { name: 'Tạo mới' },
        ]}
        sx={{ mb: 3 }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stepper steps={steps} activeStep={activeStep} />

        {!!errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        <Box
          gap={3}
          display="flex"
          flexDirection="column"
          sx={{
            p: 3,
            mb: 3,
            minHeight: 240,
            borderRadius: 1.5,
            border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
          }}
        >
          {activeStep === 0 && <StepOne control={control} loading={loadingStepOne} />}
          {activeStep === 1 && <StepTwo control={control} fields={fields} />}
          {completedStep && <StepCompleted onReset={handleReset} />}
        </Box>

        {!completedStep && (
          <Box display="flex">
            {activeStep !== 0 && (
              <Button variant="outlined" onClick={handleBack}>
                Quay lại
              </Button>
            )}

            <Box sx={{ flex: '1 1 auto' }} />

            {activeStep === 0 && (
              <LoadingButton
                loading={loadingStepOne}
                variant="contained"
                onClick={() => handleNext('stepOne')}
              >
                Tiếp
              </LoadingButton>
            )}
            {activeStep === 1 && (
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Lưu
              </LoadingButton>
            )}
          </Box>
        )}
      </Form>
    </DashboardContent>
  );
}
