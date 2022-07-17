/// <reference types="node" />
export declare class PDF {
    private isURL;
    private isPDF;
    private readFile;
    private readURL;
    private bufferChecksum;
    private bufferToBase64;
    fromFile(path: string): {
        base64: string;
        checksum: string;
    };
    fromURL(url: string): Promise<{
        base64: string;
        checksum: string;
    }>;
    base64ToBuffer(base64: string): Buffer;
    bufferToFile(filename: string, buffer: Buffer): void;
    base64ToFile(filename: string, base64: string): void;
}
