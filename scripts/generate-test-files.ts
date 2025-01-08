const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs');
const path = require('path');

// Sample text in different languages
const sampleText = {
  chinese: `中国是世界上最古老的文明古国之一。
它拥有丰富的文化遗产和悠久的历史传统。
中国的四大发明：造纸术、指南针、火药和印刷术，
对世界文明的发展产生了深远的影响。
现代中国在经济、科技等多个领域都取得了显著的进步。`,

  arabic: `المملكة العربية السعودية هي أكبر دولة في الشرق الأوسط.
تقع في قلب شبه الجزيرة العربية وتحتل معظم أراضيها.
تشتهر المملكة بمكانتها الدينية كموطن للحرمين الشريفين.
تمتلك المملكة أكبر احتياطي نفطي في العالم.
وتشهد تطوراً كبيراً في مجالات التعليم والتكنولوجيا.`,

  japanese: `日本は、豊かな文化と最先端の技術を兼ね備えた国です。
四季折々の美しい自然と、伝統的な祭りや行事が特徴です。
和食は、その健康的な特徴と美しい盛り付けで世界的に有名です。
日本の伝統芸能には、能、歌舞伎、茶道などがあります。
現代では、アニメやゲームなどのポップカルチャーも人気です。`
};

// Create test files directory if it doesn't exist
const testFilesDir = path.join(process.cwd(), 'test-files');
if (!fs.existsSync(testFilesDir)) {
  fs.mkdirSync(testFilesDir);
}

// Generate PDF files
Object.entries(sampleText).forEach(([lang, text]) => {
  const doc = new PDFDocument();
  const pdfPath = path.join(testFilesDir, `sample-${lang}.pdf`);
  doc.pipe(fs.createWriteStream(pdfPath));
  
  doc.fontSize(14);
  doc.text(text, {
    align: 'left',
    lineGap: 10
  });
  
  doc.end();
  console.log(`Created PDF file: ${pdfPath}`);
});

// Generate Word documents
Object.entries(sampleText).forEach(([lang, text]) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: text,
              size: 28
            })
          ]
        })
      ]
    }]
  });

  const docxPath = path.join(testFilesDir, `sample-${lang}.docx`);
  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(docxPath, buffer);
    console.log(`Created Word document: ${docxPath}`);
  });
});

// Generate text files
Object.entries(sampleText).forEach(([lang, text]) => {
  const txtPath = path.join(testFilesDir, `sample-${lang}.txt`);
  fs.writeFileSync(txtPath, text, 'utf8');
  console.log(`Created text file: ${txtPath}`);
});
