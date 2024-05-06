/// <reference types="node" />
import { PDFDocument, PDFPage, PDFOperator } from "pdf-lib";
import { HashOutputProps } from "./FirmaGob";
export declare class PDF {
    private pdf;
    private images;
    private preSigned;
    constructor();
    loadFromBuffer(pdfBuffer: Buffer): Promise<void>;
    loadFromPdfDocument(pdfDocument: PDFDocument): void;
    getPages(): PDFPage[];
    getPresignedPDF(): Buffer;
    addImage(name: string, data: string): Promise<void>;
    updateDictionary(reason: string, operators: PDFOperator[], page: PDFPage): Promise<void>;
    sign(apiSignatures: HashOutputProps): Promise<Buffer>;
}
