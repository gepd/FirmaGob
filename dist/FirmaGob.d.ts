export declare enum Purpose {
    ATENDIDO = "Prop\u00F3sito General",
    DESATENDIDO = "Desatendido"
}
type FileProps = {
    "content-type": string;
    content: string;
    description?: string;
    checksum?: string;
    layout?: string;
    references?: string[];
    xmlObjects?: string[];
};
type FileInProps = {
    content: string;
    status: "OK" | "error";
    contentType: string;
    documentStatus: string;
    checksum_original: string | null;
    hashOriginal?: string;
};
type MetadataProps = {
    otpExpired: boolean;
    filesSigned: number;
    signedFailed: number;
    objectReceived: number;
};
type OutputProps = {
    metadata: MetadataProps;
    status: number;
    error?: string;
    idSolicitud?: number;
};
export type FileOutputProps = OutputProps & {
    files: FileInProps[];
};
export type HashOutputProps = OutputProps & {
    hashes: FileInProps[];
};
export declare class FirmaGob {
    private url_desarrollo;
    private url_produccion;
    private environment;
    private entity;
    private run;
    private purpose;
    private api_token_key;
    private secret;
    private files;
    constructor();
    setConfig(props: {
        entity: string;
        api_token: string;
        secret: string;
    }): void;
    setPurpose(purpose: Purpose): void;
    addJSON(content: string, checksum: string): void;
    addPDF(content: string, checksum: string, layout?: string): void;
    addHash(hash: string): void;
    addXML(content: string, checksum: string, references: string[], xmlObjects: string[]): void;
    addFiles(files: FileProps[]): void;
    private sign;
    signFiles(otp?: string): Promise<FileOutputProps>;
    signHashes(otp?: string): Promise<HashOutputProps>;
}
export {};
