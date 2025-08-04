export declare class File {
    private static isURL;
    private static isPDF;
    static readFile(path: string): NonSharedBuffer;
    static readURL(url: string): Promise<Buffer<ArrayBufferLike>>;
    private static bufferChecksum;
    static bufferToBase64(buffer: Buffer): string;
    static fromBufferToHash(buffer: Buffer): string;
    static fromLocalToBuffer(path: string): NonSharedBuffer;
    static fromLocal(path: string): {
        base64: string;
        checksum: string;
    };
    static fromLocalToHash(path: string): string;
    static fromRemoteToBuffer(url: string): Promise<Buffer<ArrayBufferLike>>;
    static fromRemote(url: string): Promise<{
        base64: string;
        checksum: string;
    }>;
    static fromRemoteToHash(url: string): Promise<string>;
    static base64ToBuffer(base64: string): Buffer<ArrayBuffer>;
    static bufferToDisk(filename: string, buffer: Buffer): void;
    static base64ToDisk(filename: string, base64: string): void;
}
