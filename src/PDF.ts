import { SignPdf } from "node-signpdf";
import { plainAddPlaceholder } from "node-signpdf/dist/helpers/index.js";
import { PDFDocument, PDFOperator, PDFPage } from "pdf-lib";
import { HashOutputProps } from "./FirmaGob";

export class PDF {
  private pdfBuffer: Buffer | null = null;
  private pdf: PDFDocument | null = null;
  private xObject: { [key: string]: any } = {};

  private preSigned: {
    pdf: Buffer;
    placeholderLength: number;
    byteRange: number;
  };

  constructor() {}

  async loadFromBuffer(pdfBuffer: Buffer) {
    this.pdfBuffer = pdfBuffer;
    // this.pdf = await PDFDocument.load(pdfBuffer);
  }

  getPages() {
    return this.pdf.getPages();
  }

  getUpdatedPDF() {
    return this.preSigned.pdf;
  }

  async addImage(name: string, data: string) {
    // const embedImage = await this.pdf.embedPng(data);
    // this.xObject[name] = embedImage.ref;
  }

  async getPdfBuffer() {
    const modifiedPdfBytes1 = await this.pdf.save({ useObjectStreams: false });
    return Buffer.from(modifiedPdfBytes1);
  }

  async updateDictionary(
    signatureId: string,
    reason: string,
    operators: PDFOperator[],
    page?: PDFPage
  ) {
    if (!this.pdf && !this.pdfBuffer) {
      throw new Error("NO_PDF");
    }

    const signatureDate = new Date();
    const SIGNATURE_LENGTH = 15000;

    let pdfBuffer = this.pdfBuffer;
    // const imageBuffer = fs.readFileSync("./signature.png");

    pdfBuffer = plainAddPlaceholder({
      pdfBuffer: pdfBuffer,
      name: signatureId,
      location: "",
      contactInfo: "",
      reason,
      signatureLength: SIGNATURE_LENGTH,
      // imageBuffer: imageBuffer,
    });

    // Update Modified PDF
    const { pdf, placeholderLength, byteRange1 } =
      SignPdf.preparePdfForSigning(pdfBuffer);

    this.preSigned = {
      pdf,
      placeholderLength,
      byteRange: byteRange1,
    };
  }

  async sign(apiSignatures: HashOutputProps) {
    if (!this.pdf && !this.pdfBuffer) {
      throw new Error("NO_PDF");
    }

    for (const hash of apiSignatures.hashes) {
      const signature = hash.content;
      const binaryString = Buffer.from(signature, "base64").toString("latin1");
      const bytes = new Uint8Array(binaryString.length);

      for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const byteBuffer = bytes.buffer;

      const signedObj = new SignPdf();

      const signedPdfBuffer = signedObj.sign(
        this.preSigned.pdf,
        byteBuffer,
        this.preSigned.placeholderLength,
        this.preSigned.byteRange
      ) as Buffer;

      return signedPdfBuffer;
    }
  }
}
