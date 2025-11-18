import {
  degrees,
  drawImage,
  drawRectangle,
  drawTextSegments,
  File,
  FirmaGob,
  PDF,
  PDFName,
  popGraphicsState,
  pushGraphicsState,
  rgb,
  setCharacterSpacing,
  setGraphicsState,
  SignerInfo,
} from "firma-gob";

const signer: SignerInfo = {
  reason: "Revisión Contable",
  width: 230,
  height: 80,
  x: 50,
  y: 650,
};

const main = async () => {
  const gob = new FirmaGob();
  const pdf = new PDF();

  // Leer archivos
  const signatureImagen = File.readFile("./signature.png");
  const pdfBuffer = File.readFile("./Testing PDF.pdf");

  // pagina donde se agregarán los elementos visuales
  pdf.setPage(1);

  // Preparar PDF
  await pdf.loadFromBuffer(pdfBuffer);
  pdf.setSigner(signer);
  await pdf.addImage("Git", signatureImagen);
  pdf.enableOpacity();

  pdf.setOperators((regular, bold) => [
    pushGraphicsState(),
    setGraphicsState(PDFName.of("Opacity")),
    ...drawRectangle({
      x: 0,
      y: 0,
      width: signer.width,
      height: signer.height,
      color: rgb(0.95, 0.95, 0.95),
      borderWidth: 1,
      borderColor: rgb(0.9, 0.9, 0.9),
      rotate: degrees(0),
      xSkew: degrees(0),
      ySkew: degrees(0),
    }),
    popGraphicsState(),

    ...drawImage("Git", {
      x: 10,
      y: (signer.height - 40) / 2,
      width: 40,
      height: 40,
      rotate: degrees(0),
      xSkew: degrees(0),
      ySkew: degrees(0),
    }),
    setCharacterSpacing(-0.8),
    ...drawTextSegments(
      [
        { segments: [{ texto: "Firmado por", fontName: regular.name }] },
        {
          segments: [
            {
              texto: "Guillermo Parraguez",
              fontName: bold.name,
              font: bold.font,
            },
          ],
        },
        {
          segments: [
            { texto: "Coordinador de Transformación Digital - año 2025" },
          ],
        },
        {
          segments: [
            { texto: "Fecha", fontName: bold.name, font: bold.font },
            { texto: new Date().toISOString() },
          ],
        },
        { segments: [{ texto: "Ilustre Municipalidad de Diego de Almagro" }] },
      ],
      {
        x: 65,
        y: 55,
        fontName: regular.name,
        font: regular.font,
        size: 7,
        color: rgb(0, 0, 0),
      }
    ),
  ]);

  // Obtener PDF preparado y firmarlo
  const prepared = await pdf.getPreparedPDF();
  const hash = File.fromBufferToHash(prepared);
  gob.addHash(hash);

  const signedOut = await gob.signHashes();
  const signedPDF = await pdf.sign(signedOut);

  // Guardar resultado
  File.bufferToDisk("./documento-final-firmado.pdf", signedPDF);
  console.log("PDF final guardado en ./documento-final-firmado.pdf");
};

main();
