export = PDFArrayCustom;
declare class PDFArrayCustom extends PDFArray {
    static withContext(context: any): any;
    clone(context: any): any;
    copyBytesInto(buffer: any, offset: any): number;
}
import { PDFArray } from "pdf-lib/cjs/core";
