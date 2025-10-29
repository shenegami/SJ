declare module 'pdf-parse/lib/pdf-parse.js' {
  interface PDFInfo {
    text: string;
  }
  export default function pdfParse(data: Buffer): Promise<PDFInfo>;
}
