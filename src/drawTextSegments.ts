import {
  degrees,
  drawText,
  PDFFont,
  PDFName,
  PDFOperator,
  rgb,
  RGB,
  Rotation,
  setCharacterSpacing,
} from "pdf-lib-incremental-save";

type Segment = {
  texto: string;
  font?: PDFFont;
  fontName?: string | PDFName;
  size?: number;
  color?: RGB;
  rotate?: Rotation;
  xSkew?: Rotation;
  ySkew?: Rotation;
};

type SegmentedLine = {
  segments: Segment[];
};

type BaseOpts = {
  x: number;
  y: number;
  font: PDFFont;
  fontName: string | PDFName;
  size: number;
  color?: RGB;
  rotate?: Rotation;
  xSkew?: Rotation;
  ySkew?: Rotation;
  lineHeight?: number;
};

/**
 * Genera operadores de dibujo para líneas con múltiples segmentos de texto
 * con diferentes estilos en un PDF.
 *
 * @param lines - Array de objetos que contiene segmentos de texto:
 *   • segments: Array de segmentos { texto, font?, size?, color?, rotate?, xSkew?, ySkew? }
 * @param base - Opciones base para todos los segmentos:
 *   • x, y: Coordenadas de inicio.
 *   • font, size: Fuente y tamaño por defecto.
 *   • color, rotate, xSkew, ySkew: Estilos por defecto.
 *   • lineHeight: Altura de línea.
 * @returns PDFOperator[] — Lista de operadores para dibujar el texto.
 */
export const drawTextSegments = (
  lines: SegmentedLine[],
  base: BaseOpts
): PDFOperator[] => {
  const {
    x: x0,
    y: y0,
    font: fontObj,
    fontName: baseName,
    size: baseSize,
    color: baseColor = rgb(0, 0, 0),
    rotate: baseRotate = degrees(0),
    xSkew: baseXSkew = degrees(0),
    ySkew: baseYSkew = degrees(0),
    lineHeight = baseSize + 2,
  } = base;

  return lines.flatMap((line, rowIdx) => {
    let cursorX = x0;
    return line.segments.flatMap((segment) => {
      const {
        texto,
        font = fontObj,
        fontName = baseName,
        size = baseSize,
        color = baseColor,
        rotate = baseRotate,
        xSkew = baseXSkew,
        ySkew = baseYSkew,
      } = segment;

      const gap = 5; // distancia entre palabras
      const textWidth = font.widthOfTextAtSize(texto, size);

      const characterSpacingOp = setCharacterSpacing(0);

      const ops = drawText(font.encodeText(texto), {
        x: cursorX,
        y: y0 - lineHeight * rowIdx,
        font: fontName,
        size,
        color,
        rotate,
        xSkew,
        ySkew,
      });

      cursorX += textWidth + gap;

      return [characterSpacingOp, ...ops];
    });
  });
};
