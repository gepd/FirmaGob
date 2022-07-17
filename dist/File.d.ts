/// <reference types="node" />
export declare class File {
    private isURL;
    private isPDF;
    private readFile;
    private readURL;
    private bufferChecksum;
    private bufferToBase64;
    fromLocal(path: string): {
        base64: string;
        checksum: string;
    };
    fromRemote(url: string): Promise<{
        base64: string;
        checksum: string;
    }>;
    base64ToBuffer(base64: string): Buffer;
    bufferToDisk(filename: string, buffer: Buffer): void;
    base64ToDisk(filename: string, base64: string): void;
}
