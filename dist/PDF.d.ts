import { PDFFont, PDFName, PDFOperator } from "pdf-lib-incremental-save";
import { HashOutputProps } from "./FirmaGob";
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
export declare class PDF {
    private pdf;
    private pdfBuffer;
    private preparedPdf;
    private operators;
    private images;
    private pageIndex;
    private opacity;
    private signer;
    constructor();
    loadFromBuffer(pdfBuffer: Buffer): Promise<void>;
    setPage(pageIndex: number): void;
    getPages(): import("pdf-lib-incremental-save").PDFPage[];
    setSigner(signer: SignerInfo): void;
    addImage(name: string, data: Buffer): Promise<void>;
    setOperators(operator: (regular: FontReference, bold: FontReference) => PDFOperator[]): void;
    getPreparedPDF(): Promise<Buffer<ArrayBufferLike>>;
    enableOpacity(): void;
    getPdfBuffer(): Promise<Buffer<ArrayBuffer>>;
    updateDictionary(): Promise<void>;
    sign(apiSignatures: HashOutputProps): Promise<Buffer<ArrayBufferLike>>;
}
export {};
