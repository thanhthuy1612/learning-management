export const defaultPageSize = 10;
export const defaultPageIndex = 1;

export const prompt = (
  subject: string,
  clasIn: number,
  document: string,
  matrix: string,
  time: number,
  quantity: number
) => `Bạn là một giáo viên bộ môn ${subject}. Hãy tạo một đề thi học kỳ môn ${subject} lớp ${clasIn} với các yêu cầu sau:

1. Nội dung kiến thức: Bám sát sách giáo khoa ${subject} lớp ${clasIn} (không sử dụng nguồn bên ngoài). Sách giáo khoa có thể tham khảo từ file: ${document}

2. Cấu trúc đề: Đề thi cần bao gồm 100% câu hỏi trắc nghiệm.

3. Mức độ nhận thức: Phân chia theo thang Bloom – gồm các mức độ: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao.

4. Tạo ma trận đề thi gồm ${quantity} câu với mô tả nội dung câu hỏi như sau: 

- MA TRẬN:
    ${matrix}
    
- Sử dụng ma trận đề thi được cung cấp, ghi rõ số câu hỏi và điểm số cho từng ô trong ma trận, phân chia theo các chủ đề/chương học và các mức độ nhận thức. Đề thi cần bao gồm cả các câu hỏi với 2 đáp án đúng và sai hoặc dạng 4 đáp án A, B,C D.

5. Thời gian làm bài: ${time} phút.

6. Thang điểm: Tổng điểm 10 điểm, phân bổ theo tỷ lệ câu hỏi.

7. Đáp Án Chi Tiết:

- Cung cấp đáp án đúng cho từng câu hỏi trắc nghiệm với định dạng JSON như sau:

{
"question": "Câu hỏi ở đây?",
"choices": {
"A": "Lựa chọn A",
"B": "Lựa chọn B",
"C": "Lựa chọn C",
"D": "Lựa chọn D"
},
"answer": "B" // Nếu câu hỏi này có 4 đáp án
}

// Hoặc nếu câu hỏi có 2 đáp án với dạng TRẮC NGHIỆM ĐÚNG SAI :
{
"question": "Câu hỏi đúng/sai ở đây?",
"choices": {
"A": "Đúng",
"B": "Sai"
},
"answer": "A" // Nếu câu hỏi này có 2 đáp án
}

- Những điểm chính mà học sinh cần đề cập, dựa trên nội dung sách giáo khoa.
- Mục tiêu cần kiểm tra theo từng bài học.
- Yêu cầu kỹ năng: trình bày, giải thích, liên hệ, nhận xét...
- Không được sử dụng nội dung ngoài sách giáo khoa hoặc vượt quá đặc tả.

8. Yêu cầu:
   Đề thi cần được trình bày rõ ràng:
   Đáp án + thang điểm.

9. Kết quả mong muốn:

- Một đề thi trắc nghiệm hoàn chỉnh đáp ứng tất cả các yêu cầu trên, có cấu trúc rõ ràng và đầy đủ thông tin.

- Chỉ TRẢ RA ARRAY DATA mục 7, không muốn có thêm BẤT CỨC CÂU DẪN DẮT nào đi kèm từ AI
`;
