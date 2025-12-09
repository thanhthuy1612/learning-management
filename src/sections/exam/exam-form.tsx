'use client';

import type { Theme, SxProps } from '@mui/material';
import type { IQuizRequestBody } from 'src/types/question';

import React from 'react';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Grid, Radio, FormLabel, RadioGroup, FormControl, FormControlLabel } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { updateSubmit } from 'src/lib/features';
import { quizService } from 'src/services/quiz.services';
import { useAppDispatch, useAppSelector } from 'src/lib/hooks';

import { Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ComponentBox } from 'src/components/layout';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { SplashScreen } from 'src/components/loading-screen';

import { Choice1, Choices, ChoicesIsYesNo, ChoicesIsYesNo1 } from 'src/types/question';

import { ExamHeader } from './exam-header';
import { ExamFooter } from './exam-footer';

// ----------------------------------------------------------------------

export type ExamFormSchemaType = zod.infer<typeof ExamFormSchema>;

export const ExamFormSchema = zod.object({
  answers: zod.array(
    zod.object({
      id: zod.string(),
      question: zod.string(),
      answer: zod.union([
        zod.enum(Choices, { message: 'Câu trả lời phải là A, B, C hoặc D!' }),
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
  const [isVisibleTime, setIsVisibleTime] = React.useState(true);
  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);
  const [dataSubmit, setDataSubmit] = React.useState<ExamFormSchemaType>();
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const [count, setCount] = React.useState<number>(0);

  const ref = React.useRef<HTMLDivElement | null>(null);

  const confirmDialog = useBoolean();
  const dispatch = useAppDispatch();

  const { questions, dataStepOne, targetDate } = useAppSelector((state) => state.exam);

  const methods = useForm<ExamFormSchemaType>({
    resolver: zodResolver(ExamFormSchema),
  });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const { fields } = useFieldArray({
    control,
    name: 'answers',
  });

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, [ref, timer, count, questions]);

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const newTimer = setTimeout(() => {
          setCount((pre) => pre + 1);
          alert(
            'Vui lòng tập trung làm bài thi nghiêm túc. Kết quả làm bài sẽ bị xóa nếu tái phạm!'
          );
        }, 3000);
        setTimer(newTimer);
      } else {
        if (timer) {
          clearTimeout(timer);
          setTimer(null);
        }
      }
      setIsVisibleTime(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  React.useEffect(() => {
    if (count > 2) {
      setValue(
        'answers',
        questions.map((item) => ({ question: item.question, answer: '', id: item.id ?? '' }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  React.useEffect(() => {
    setValue(
      'answers',
      questions.map((item) => ({ question: item.question, answer: '', id: item.id ?? '' }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  React.useEffect(() => {
    const checkTime = () => {
      if (new Date().getTime() >= targetDate) {
        const body = {
          scoreId: dataStepOne?.scoreId,
          questions: (getValues('answers') ?? []).map((item) => ({
            id: item.id,
            answer: item.answer,
          })),
          isFinished: true,
        } as IQuizRequestBody;
        onHandleSubmit(body);
        clearInterval(intervalId);
      }
    };

    const intervalId = setInterval(checkTime, 120000); // Kiểm tra mỗi 2 phút
    checkTime(); // Kiểm tra ngay lần đầu tiên

    return () => clearInterval(intervalId); // Dọn dẹp khi component unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answers = watch('answers');

  const onSubmit = handleSubmit(async (data) => {
    setDataSubmit(data);
    confirmDialog.onTrue();
  });

  const onHandleSubmit = (body?: IQuizRequestBody) => {
    try {
      const promise = new Promise((resolve, reject) => {
        quizService
          .quiz(
            body ??
              ({
                scoreId: dataStepOne?.scoreId,
                questions: dataSubmit?.answers.map((item) => ({
                  id: item.id,
                  answer: item.answer,
                })),
                isFinished: true,
              } as IQuizRequestBody)
          )
          .then((res) => {
            resolve('Nộp thành công');
            dispatch(updateSubmit(true));
          })
          .catch((e) => {
            toast.error(e);
            reject(e);
          });
      });

      toast.promise(promise, {
        loading: 'Đang tải',
        success: 'Nộp thành công',
      });
    } catch (error: any) {
      console.error(error);
    }
  };

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Nộp bài"
      content="Bạn có chắc chắn muốn nộp bài?"
      action={
        <Button
          color="primary"
          variant="contained"
          loading={isSubmitting}
          onClick={() => onHandleSubmit()}
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

  if (!isVisibleTime) return <SplashScreen />;
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
                      {(Object.entries(questions[index].choices).length === 2
                        ? ChoicesIsYesNo1[index % ChoicesIsYesNo.length]
                        : Choice1[index % Choice1.length]
                      ).map((option) => (
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
