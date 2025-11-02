import { PDFFont, PDFName, PDFOperator, RGB, Rotation } from "pdf-lib-incremental-save";
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
export declare const drawTextSegments: (lines: SegmentedLine[], base: BaseOpts) => PDFOperator[];
export {};
