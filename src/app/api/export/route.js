// app/api/export/route.js

import { Packer, TextRun, Document, Paragraph } from 'docx';

export async function POST(request) {
  const { title, content } = await request.json();

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: title, bold: true }), new TextRun({ text: content })],
          }),
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
