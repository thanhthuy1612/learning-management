import { z as zod } from 'zod';

import { Choices } from 'src/types/question';

// ----------------------------------------------------------------------

export const steps = ['Sử dụng AI', 'Kiểm tra'];

export const StepOneSchema = zod.object({
  subject: zod.string().min(1, { message: 'Bắt buộc nhập!' }),
  classId: zod
    .number()
    .int()
    .min(1, { message: 'Giá trị tối thiểu là 1!' })
    .max(12, { message: 'Giá trị tối đa là 12!' }),
  time: zod.number().int().min(1, { message: 'Giá trị tối thiểu là 1!' }),
  quantity: zod.number().int().min(1, { message: 'Giá trị tối thiểu là 1!' }),
  matrix: zod.string().min(1, { message: 'Bắt buộc nhập!' }),
  document: zod.string().optional(),
});

export const StepTwoSchema = zod.object({
  name: zod.string().min(1, { message: 'Bắt buộc nhập!' }),
  answers: zod.array(
    zod.object({
      id: zod.string(),
      question: zod.string().min(1, 'Bắt buộc nhập!'),
      choices: zod.record(zod.enum(Choices), zod.string().min(1, 'Bắt buộc nhập!')),
      answer: zod.enum(Choices, { message: 'Câu trả lời phải là A, B, C hoặc D!' }),
    })
  ),
});

export const WizardSchema = zod.object({
  stepOne: StepOneSchema,
  stepTwo: StepTwoSchema,
});
export type StepTwoSchemaType = zod.infer<typeof StepTwoSchema>;
export type WizardSchemaType = zod.infer<typeof WizardSchema>;
export const matrixExam = `
PHẦN I. TRẮC NGHIỆM NHIỀU ĐÁP ÁN gồm 12 câu (3,0 điểm)
(4 đáp án a,b,c,d; 1 đáp án đúng; mỗi câu trả lời đúng 0,25 điểm)
2 câu hỏi mức độ nhận biết trong “Bài 7. Ai Cập và Lưỡng Hà”:
– Trình bày được quá trình thành lập nhà nước của người Ai Cập và người Lưỡng Hà.
– Kể tên và nêu được những thành tựu chủ yếu về văn hoá ở Ai Cập, Lưỡng Hà.
3 câu hỏi mức độ nhận biết trong “Bài 8. Ấn Độ cổ đại”
– Nêu được những thành tựu văn hoá tiêu biểu của Ấn Độ cổ đại.
– Trình bày được những điểm chính về chế độ xã hội Ấn Độ cổ đại.
3 câu hỏi mức độ nhận biết trong “Bài 9. Trung Quốc từ thời cổ đại đến thế kỉ VII”
– Nêu được những thành tựu cơ bản của nền văn minh Trung Quốc.
– Trình bày được những đặc điểm về điều kiện tự nhiên của Trung Quốc cổ đại.
4 câu hỏi mức độ nhận biết trong “Bài 10: Hi Lạp và La Mã cổ đại”
– Trình bày được tổ chức nhà nước thành bang, nhà nước đế chế ở Hy Lạp và La Mã cổ đại.
– Nêu được một số thành tựu văn hoá tiêu biểu của Hy Lạp, La Mã cổ đại.
PHẦN II. TRẮC NGHIỆM ĐÚNG SAI gầm 4 câu (4,0 điểm)
(Câu hỏi gồm câu dẫn hoặc tình huống, 4 đáp án a,b,c,d; HS chọn đúng 1 đáp án 0,1 điểm; đúng 2 đáp án 0,25 điểm; đúng 3 đáp án 0,5 điểm; đúng 4 đáp án 1,0 điểm)
- 1 câu hỏi mức độ nhận biết và hiểu trong “Bài 7. Ai Cập và Lưỡng Hà”
- 1 câu hỏi mức độ nhận biết và hiểu trong “Bài 8. Ấn Độ cổ đại”
- 1 câu hỏi mức độ nhận biết và hiểu trong “Bài 9. Trung Quốc từ thời cổ đại đến thế kỉ VII”
- 1 câu hỏi mức độ nhận biết và hiểu trong “Bài 10: Hi Lạp và La Mã cổ đại`;
