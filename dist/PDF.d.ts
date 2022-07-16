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
}
