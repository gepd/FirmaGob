export declare enum Purpose {
    ATENDIDO = "Prop\u00F3sito General",
    DESATENDIDO = "Desatendido"
}
interface FileProps {
    "content-type": string;
    content: string;
    description: string;
    checksum: string;
    layout?: string;
    references?: string[];
    xmlObjects?: string[];
}
interface FileInProps {
    content: string;
    status: string;
    contentType: string;
    documentStatus: string;
    checksum_original: string;
}
interface MetadataProps {
    otpExpired: boolean;
    filesSigned: number;
    signedFailed: number;
    objectReceived: number;
}
interface FileOutputProps {
    files: FileInProps[];
    metadata: MetadataProps;
    status: number;
    error?: string;
}
export declare class FirmaGob {
    private url;
    private environment;
    private entity;
    private run;
    private purpose;
    private api_token_key;
    private secret;
    private files;
    constructor();
    setConfig(run: string, entity: string, api_token: string, secret: string): void;
    setPurpose(purpose: Purpose): void;
    addJSON(content: string, checksum: string): void;
    addPDF(content: string, checksum: string, layout?: string): void;
    addXML(content: string, checksum: string, references: string[], xmlObjects: string[]): void;
    addFiles(files: FileProps[]): void;
    signFiles(otp?: string): Promise<FileOutputProps>;
}
export {};
