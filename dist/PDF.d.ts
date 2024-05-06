/// <reference types="node" />
import { PDFDocument, PDFOperator, PDFPage } from "pdf-lib";
import { HashOutputProps } from "./FirmaGob";
export declare class PDF {
    private pdf;
    private xObject;
    private preSigned;
    constructor();
    loadFromBuffer(pdfBuffer: Buffer): Promise<void>;
    loadFromPdfDocument(pdfDocument: PDFDocument): void;
    getPages(): PDFPage[];
    getUpdatedPDF(): Buffer;
    addImage(name: string, data: string): Promise<void>;
    getPdfBuffer(): Promise<Buffer>;
    updateDictionary(signatureId: string, reason: string, operators: PDFOperator[], page: PDFPage): Promise<void>;
    sign(apiSignatures: HashOutputProps): Promise<Buffer>;
}
