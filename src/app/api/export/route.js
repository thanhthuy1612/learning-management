import { Packer, TextRun, Document, Paragraph } from 'docx';

export async function POST(request) {
  const { title, content } = await request.json();

  // Tách nội dung thành các đoạn dựa trên ký tự xuống dòng
  const contentParagraphs = content.split('\r\n').map(
    (line) =>
      new Paragraph({
        children: [new TextRun(line)],
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: title, bold: true })],
          }),
          ...contentParagraphs, // Thêm các đoạn đã tách vào tài liệu
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  const headers = {
    'Content-Disposition': 'attachment; filename=sample.docx',
    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };

  return new Response(buffer, { headers });
}
