import signer from "@signpdf/signpdf";
import {
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFNumber,
  PDFOperator,
  PDFPage,
  PDFString,
} from "pdf-lib";
import { HashOutputProps } from "./FirmaGob";
import PDFArrayCustom from "./PdfArrayCustom";

export class PDF {
  private pdf: PDFDocument | null = null;
  private images: { [key: string]: any } = {};
  private preSigned: {
    pdf: Buffer;
    placeholderLength: number;
    byteRange: number;
  };

  constructor() {}

  async loadFromBuffer(pdfBuffer: Buffer) {
    this.pdf = await PDFDocument.load(pdfBuffer);
  }

  loadFromPdfDocument(pdfDocument: PDFDocument) {
    this.pdf = pdfDocument;
  }

  getPages() {
    return this.pdf.getPages();
  }

  getPresignedPDF() {
    return this.preSigned?.pdf;
  }

  async addImage(name: string, data: string) {
    const embedImage = await this.pdf.embedPng(data);
    this.images[name] = embedImage.ref;
  }

  async updateDictionary(
    reason: string,
    operators: PDFOperator[],
    page: PDFPage
  ) {
    if (!this.pdf) {
      throw new Error("NO_PDF");
    }

    // Definir la posición y el tamaño del rectángulo y el texto
    const rectX = 100; // Cambia la posición en el eje X del rectángulo
    const rectY = 0; // Cambia la posición en el eje Y del rectángulo
    const rectWidth = 200; // Cambia el ancho del rectángulo
    const rectHeight = 60; // Cambia la altura del rectángulo

    const signatureDate = new Date();

    const SIGNATURE_LENGTH = 15000;

    const ByteRange = PDFArrayCustom.withContext(this.pdf.context);
    ByteRange.push(PDFNumber.of(0));
    ByteRange.push(PDFName.of(signer.DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(signer.DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(signer.DEFAULT_BYTE_RANGE_PLACEHOLDER));

    const signatureDict = this.pdf.context.obj({
      Type: "Sig",
      Filter: "Adobe.PPKLite",
      SubFilter: "adbe.pkcs7.detached",
      ByteRange,
      Contents: PDFHexString.of("A".repeat(SIGNATURE_LENGTH)),
      Reason: PDFString.of(reason),
      M: PDFString.fromDate(signatureDate),
    });

    const signatureDictRef = this.pdf.context.register(signatureDict);

    const widgetDict = this.pdf.context.obj({
      Type: "Annot",
      Subtype: "Widget",
      FT: "Sig",
      Rect: [rectX, rectY, rectX + rectWidth, rectY + rectHeight],
      V: signatureDictRef,
      T: PDFString.of("Signature1"),
      F: 4,
      P: page.ref,
    });

    const widgetDictRef = this.pdf.context.register(widgetDict);

    // Add our signature widget to the sent page
    page.node.set(PDFName.of("Annots"), this.pdf.context.obj([widgetDictRef]));

    // Create an AcroForm object containing our signature widget
    this.pdf.catalog.set(
      PDFName.of("AcroForm"),
      this.pdf.context.obj({
        SigFlags: 3,
        Fields: [widgetDictRef],
      })
    );

    const form = this.pdf.getForm();
    const sig = form.getSignature("Signature1");

    sig.acroField.getWidgets().forEach((widget) => {
      const { context } = widget.dict;
      const { width, height } = widget.getRectangle();

      const stream = context.formXObject(operators, {
        Resources: { XObject: this.images },
        BBox: context.obj([0, 0, width, height]),
        Matrix: context.obj([1, 0, 0, 1, 0, 0]),
      });
      const streamRef = context.register(stream);

      widget.setNormalAppearance(streamRef);
    });

    const modifiedPdfBytes = await this.pdf.save({ useObjectStreams: false });
    const modifiedPdfBuffer = Buffer.from(modifiedPdfBytes);

    const preSigned = new signer.SignPdf();
    const { pdf, placeholderLength, byteRange1 } = preSigned.sign(
      modifiedPdfBuffer,
      true
    ) as any;

    this.preSigned = {
      pdf,
      placeholderLength,
      byteRange: byteRange1,
    };
  }

  async sign(apiSignatures: HashOutputProps) {
    if (!this.pdf) {
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

      const signedObj = new signer.SignPdf();

      const signedPdfBuffer = signedObj.sign(
        this.preSigned.pdf,
        false,
        byteBuffer,
        this.preSigned.placeholderLength,
        this.preSigned.byteRange
      ) as Buffer;

      return signedPdfBuffer;
    }
  }
}
