import { SignPdf } from "node-signpdf";

import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFFont,
  PDFHexString,
  PDFName,
  PDFNumber,
  PDFOperator,
  PDFRef,
  PDFString,
  StandardFonts,
} from "pdf-lib-incremental-save";
import { HashOutputProps } from "./FirmaGob";

const SIGNATURE_LENGTH = 15000;
const DEFAULT_BYTE_RANGE_PLACEHOLDER = "**********";

export type SignerInfo = {
  width: number;
  height: number;
  x: number;
  y: number;
  reason: string;
};

type FontReference = {
  name: PDFName;
  font: PDFFont;
};

/**
 * Clase `PDF` encargada de preparar e inyectar firmas digitales en
 * documentos PDF de forma incremental.
 *
 * Permite cargar un PDF existente, definir la posición y apariencia del widget de firma
 * (imágenes, rectángulos, texto segmentado, opacidad), obtener el PDF preparado para
 * calcular su hash y finalmente aplicar las firmas en base64 retornadas por FirmaGob
 * sin invalidar firmas previas.
 */
export class PDF {
  // Referencia del PDF Cargado
  private pdf: PDFDocument | null = null;
  // Refencia del PDF en bytes, sin modificar
  private pdfBuffer: Buffer | null = null;
  // Referencia del PDF después de agregar
  // las referencias visuales
  private preparedPdf: {
    pdf: Buffer;
    placeholderLength: number;
    byteRange1: number;
  };
  // Almacena objetos visuales para agregar al PDF
  private operators: (
    regular: FontReference,
    bold: FontReference
  ) => PDFOperator[];
  // Almacena las imagenes registradas
  private images: Record<string, Buffer> = {};
  // Indice de la pagina donde se firmará
  private pageIndex: number;
  // Habilita opacidad para usar en los objetos visuales
  private opacity: boolean = false;
  // Información que se usará para firmar
  private signer: SignerInfo;

  constructor() {}

  async loadFromBuffer(pdfBuffer: Buffer) {
    this.pdfBuffer = pdfBuffer;
    this.pdf = await PDFDocument.load(pdfBuffer, { updateMetadata: false });
  }

  setPage(pageIndex: number) {
    this.pageIndex = pageIndex;
  }

  getPages() {
    return this.pdf.getPages();
  }

  setSigner(signer: SignerInfo) {
    this.signer = signer;
  }

  async addImage(name: string, data: Buffer) {
    this.images[name] = data;
  }

  setOperators(
    operator: (regular: FontReference, bold: FontReference) => PDFOperator[]
  ) {
    this.operators = operator;
  }

  async getPreparedPDF() {
    await this.updateDictionary();
    return this.preparedPdf.pdf;
  }

  enableOpacity() {
    this.opacity = true;
  }

  async getPdfBuffer() {
    const modifiedPdfBytes1 = await this.pdf.save({ useObjectStreams: false });
    return Buffer.from(modifiedPdfBytes1);
  }

  async updateDictionary() {
    if (!this.pdf) {
      throw new Error("NO_PDF");
    }

    if (!this.signer) {
      throw new Error("NO_SIGNER");
    }

    const snapshot = this.pdf.takeSnapshot();
    const page = this.pdf.getPage(this.pageIndex ?? 0);

    const regular = await this.pdf.embedFont(StandardFonts.Helvetica, {
      subset: true,
    });
    const bold = await this.pdf.embedFont(StandardFonts.HelveticaBold, {
      subset: true,
    });

    const signatureDate = new Date();

    // Se agregan las imágenes al PDF y se guardan las referencias
    const IMGObjs: { [key: string]: PDFRef } = {};

    for (let key of Object.keys(this.images)) {
      const imageBuffer = this.images[key];
      const imageBytes = await this.pdf.embedPng(imageBuffer);

      IMGObjs[key] = imageBytes.ref;
    }

    snapshot.markRefForSave(page.ref);

    // Se crea el diccionario de firma
    const signatureDict = this.pdf.context.obj({
      Type: "Sig",
      Filter: "Adobe.PPKLite",
      SubFilter: "adbe.pkcs7.detached",
      ByteRange: [
        0,
        DEFAULT_BYTE_RANGE_PLACEHOLDER,
        DEFAULT_BYTE_RANGE_PLACEHOLDER,
        DEFAULT_BYTE_RANGE_PLACEHOLDER,
      ],
      Contents: PDFHexString.of("0".repeat(SIGNATURE_LENGTH)),
      Reason: PDFString.of(this.signer.reason),
      M: PDFString.fromDate(signatureDate),
    });

    // Se registra y se obtiene referencia
    const signatureDictRef = this.pdf.context.register(signatureDict);

    const signatureIndex = this.pdf.getForm().getFields().length + 1;

    // se crea el widget de firma (visual)
    const widgetDict = this.pdf.context.obj({
      Type: PDFName.of("Annot"),
      Subtype: PDFName.of("Widget"),
      FT: PDFName.of("Sig"),
      Rect: [
        this.signer.x,
        this.signer.y,
        this.signer.x + this.signer.width,
        this.signer.y + this.signer.height,
      ],
      V: signatureDictRef,
      T: PDFString.of(`Signature${signatureIndex}`),
      F: PDFNumber.of(4),
      P: page.ref,
    });

    const widgetDictRef = this.pdf.context.register(widgetDict);
    const context = widgetDict.context;

    // Obtener el rectángulo del widget
    const rectArray = widgetDict.lookup(PDFName.of("Rect"), PDFArray);

    const [x1, y1, x2, y2] = rectArray
      .asArray()
      .map((n) => (n as PDFNumber).asNumber());
    const width = x2 - x1;
    const height = y2 - y1;

    let Resources = {};

    // Crear un XObject de apariencia visual
    const XObject = context.obj(IMGObjs);
    Resources["XObject"] = XObject;

    // Registra Fuentes
    const Font = context.obj({ Regular: regular.ref, Bold: bold.ref });
    Resources["Font"] = Font;

    // Habilita opacidad
    if (this.opacity) {
      const gsDict = this.pdf.context.obj({
        Type: "ExtGState",
        ca: 0.5,
        CA: 0.5,
      });

      const gsRef = this.pdf.context.register(gsDict);
      const ExtGState = this.pdf.context.obj({ Opacity: gsRef });

      Resources["ExtGState"] = ExtGState;
    }

    const regularFont = {
      name: PDFName.of("Regular"),
      font: regular,
    };

    const boldFont = {
      name: PDFName.of("Bold"),
      font: bold,
    };

    const appearanceStream = context.formXObject(
      this.operators(regularFont, boldFont),
      {
        Resources,
        BBox: context.obj([0, 0, width, height]),
        Matrix: context.obj([1, 0, 0, 1, 0, 0]),
      }
    );

    // Registra apariencia
    const appearanceRef = context.register(appearanceStream);

    // Asigna la apariencia visual al widget
    widgetDict.set(PDFName.of("AP"), context.obj({ N: appearanceRef }));

    // Obtiene annots anteriores
    const oldAnnots = page.node.lookupMaybe(PDFName.of("Annots"), PDFArray);

    const annots = PDFArray.withContext(context);

    // Copia referencias previas
    if (oldAnnots) oldAnnots.asArray().forEach((ref) => annots.push(ref));

    annots.push(widgetDictRef);

    // Agrega a la página
    page.node.set(PDFName.of("Annots"), annots);

    // Obtiene Acros
    let acroForm: PDFDict;
    let oldAcro = this.pdf.catalog.lookupMaybe(PDFName.of("AcroForm"), PDFDict);

    if (oldAcro) {
      acroForm = context.obj({});
      // copia las referencias previas
      oldAcro.keys().forEach((key) => acroForm.set(key, oldAcro.get(key)));
    } else {
      // Agrega SigFlags
      acroForm = context.obj({ SigFlags: PDFNumber.of(3) });
    }

    const keyFields = PDFName.of("Fields");
    const newFields = PDFArray.withContext(context);

    // Obtiene Fields anteriores
    const oldFields = acroForm.lookupMaybe(keyFields, PDFArray);

    // Agrega referencias
    if (oldFields) oldFields.asArray().forEach((ref) => newFields.push(ref));

    // Agrega referencia de nuevo widget
    newFields.push(widgetDictRef);

    // Asigna /Fields con todas las referencias
    acroForm.set(keyFields, newFields);

    // Obtiene referencia de catalog
    const catalogRef = this.pdf.context.getObjectRef(this.pdf.catalog);

    // Obtiene /Catalog
    const catalogDict = this.pdf.context.lookup(catalogRef, PDFDict);

    // Agrega /AcroForm a /Catalog
    catalogDict.set(PDFName.of("AcroForm"), acroForm);

    // Marca el /Catalog y la apariencia para que sea guardados
    snapshot.markRefsForSave([catalogRef, appearanceRef]);

    // No usar object streams, al usarlo no se crea el /Catalog
    this.pdf.context.pdfFileDetails.useObjectStreams = false;

    // Guarda de modo incremental
    const incrementalBytes = await this.pdf.saveIncremental(snapshot);

    // concatena el PDF original + lo agregado anteriormente
    const incrementalPdf = Buffer.concat([this.pdfBuffer, incrementalBytes]);

    // Deja el PDF listo para ser firmado
    this.preparedPdf = SignPdf.preparePdfForSigning(incrementalPdf);
  }

  async sign(apiSignatures: HashOutputProps) {
    if (!this.pdf && !this.pdfBuffer) {
      throw new Error("NO_PDF");
    }

    const signer = new SignPdf();

    for (const hash of apiSignatures.hashes) {
      const signature = hash.content;
      const signedPdfBuffer = signer.sign(
        this.preparedPdf.pdf,
        Buffer.from(signature, "base64"),
        this.preparedPdf.placeholderLength,
        this.preparedPdf.byteRange1
      );

      return signedPdfBuffer;
    }
  }
}
