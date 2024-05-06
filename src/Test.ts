import {
  degrees,
  drawImage,
  drawText,
  PDFHexString,
  rgb,
  StandardFonts,
} from "pdf-lib";
import { File, PDF, FirmaGob } from "./index";

const signature1 = async () => {
  const file = new File();
  const pdf = new PDF();
  const firmaGob = new FirmaGob();

  // Load PDF
  const sourcePdfbuffer = file.fromLocalToBuffer("./Testing PDF.pdf");
  await pdf.loadFromBuffer(sourcePdfbuffer);

  // get page to sign
  const pages = pdf.getPages();

  // START CONFIG
  const font = StandardFonts.Helvetica;

  const bufferPng = file.fromLocalToBuffer("pngimage.png");
  const pngEncoded64 = file.bufferToBase64(bufferPng);

  // add image to PDF
  await pdf.addImage("PDF_LIB_SIG_IMG", pngEncoded64);

  // add shapes, images and text to pdf
  const appearance1 = [
    ...drawImage("PDF_LIB_SIG_IMG", {
      x: 0,
      y: 0,
      width: 60,
      height: 60,
      rotate: degrees(0),
      xSkew: degrees(0),
      ySkew: degrees(0),
    }),

    ...drawText(PDFHexString.fromText("Firmado Por: Firmante"), {
      x: 70,
      y: 40,
      font,
      size: 8,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
      xSkew: degrees(0),
      ySkew: degrees(0),
    }),
    ...drawText(PDFHexString.fromText(`Fecha: configurar fecha`), {
      x: 70,
      y: 30,
      font,
      size: 8,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
      xSkew: degrees(0),
      ySkew: degrees(0),
    }),
  ];

  // add signature
  await pdf.updateDictionary("Signature1", "reason1", appearance1, pages[0]);
  // get hash from updated pdf
  const updated = pdf.getUpdatedPDF();
  const hash = file.fromBufferToHash(updated);

  // sign with firma gob
  firmaGob.addHash(hash);
  const output = await firmaGob.signHashes();

  // add signature to pdf
  const signedBuffer = await pdf.sign(output);

  // store pdf to disk
  file.bufferToDisk("signedpdf_f1.pdf", signedBuffer);
};

const signature2 = async () => {
  const file = new File();
  const pdf = new PDF();
  const firmaGob = new FirmaGob();

  // Load PDF
  const sourcePdfbuffer = file.fromLocalToBuffer("./signedpdf_f1.pdf");
  await pdf.loadFromBuffer(sourcePdfbuffer);

  // get page to sign
  const pages = pdf.getPages();

  // START CONFIG
  const font = StandardFonts.Helvetica;

  const bufferPng = file.fromLocalToBuffer("imagepng.png");
  const pngEncoded64 = file.bufferToBase64(bufferPng);

  // add image to PDF
  await pdf.addImage("PDF_LIB_SIG_IMG", pngEncoded64);

  // add shapes, images and text to pdf
  const appearance1 = [
    ...drawImage("PDF_LIB_SIG_IMG", {
      x: 0,
      y: 0,
      width: 60,
      height: 60,
      rotate: degrees(0),
      xSkew: degrees(0),
      ySkew: degrees(0),
    }),

    ...drawText(PDFHexString.fromText("Firmado Por: Firmante"), {
      x: 70,
      y: 40,
      font,
      size: 8,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
      xSkew: degrees(0),
      ySkew: degrees(0),
    }),
    ...drawText(PDFHexString.fromText(`Fecha: configurar fecha`), {
      x: 70,
      y: 30,
      font,
      size: 8,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
      xSkew: degrees(0),
      ySkew: degrees(0),
    }),
  ];

  // add signature
  await pdf.updateDictionary("Signature2", "reason2", appearance1, pages[0]);

  // get hash from updated pdf
  const updated = pdf.getUpdatedPDF();
  const hash = file.fromBufferToHash(updated);

  // sign with firma gob
  firmaGob.addHash(hash);

  const output = await firmaGob.signHashes();

  // add signature to pdf
  const signedBuffer = await pdf.sign(output);

  // store pdf to disk
  file.bufferToDisk("signedpdf_f2.pdf", signedBuffer);
};

const main = async () => {
  await signature1();
  await signature2();
};

main();
