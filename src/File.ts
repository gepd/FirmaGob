import { createHash } from "crypto";
import fileSystem from "fs";
import { resolve } from "path";

export class File {
    /**
     * Verifica si la URL enviada es válida o no
     * @param url link a vertificar
     * @returns True si es correcto, False si no
     */
    private isURL(url: string) {
        return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi.test(
            url
        );
    }

    /**
     * Verifica si la ruta enviada corresponde a un archivo PDF
     * @param path Archivo PDF
     * @returns True si es correcto, False si no
     */
    private isPDF(path: string) {
        return /(\.(pdf))/gi.test(path);
    }

    /**
     * Lee archivo desde ruta enviada
     * @param path Ruta del archivo a leer
     * @returns Buffer
     */
    private readFile(path: string) {
        if (fileSystem.statSync(path).isFile()) {
            return fileSystem.readFileSync(resolve(path));
        }
        return null;
    }

    /**
     * Obtiene datos desde una URL y los devuelve en un buffer
     * @param url ruta a leer
     * @returns Buffer
     */
    private async readURL(url: string) {
        const response = await fetch(url);
        return this.toBuffer(await response.arrayBuffer());
    }

    private toBuffer(arrayBuffer: ArrayBuffer) {
        const buffer = Buffer.alloc(arrayBuffer.byteLength);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < buffer.length; ++i) {
            buffer[i] = view[i];
        }
        return buffer;
    }

    /**
     * Calcula checksum desde el buffer de un archivo
     * @param buffer buffer de archivo
     * @returns string con checksum
     */
    private bufferChecksum(buffer: Buffer) {
        return createHash("sha256").update(buffer).digest("hex");
    }

    /**
     * Convierte el buffer de un archivo en base64
     * @param buffer buffer de archivo
     * @returns string de archivo en base64
     */
    private bufferToBase64(buffer: Buffer) {
        return Buffer.from(buffer).toString("base64");
    }

    /**
     * Obtiene los datos de un archivo local y los convierte en base64
     * además retorna el checksum del arhivo
     * @param path ruta del archivo
     * @returns objeto con archivo en base64 y checksum
     */
    fromLocal(path: string) {
        if (!fileSystem.statSync(path).isFile() && !this.isPDF(path)) {
            throw new Error("La ruta indicada no es un archivo válido");
        }

        const bufferFile = this.readFile(path);

        const base64 = this.bufferToBase64(bufferFile);
        const checksum = this.bufferChecksum(bufferFile);

        return { base64, checksum };
    }

    /**
     * Obtiene un archivo desde una URL
     * @param url dirección del archivo pdf
     * @returns objeto con archivo en base64 y checksum
     */
    async fromRemote(url: string) {
        if (!this.isURL(url)) {
            throw new Error("La URL indicada no es válida");
        }

        const bufferFile = await this.readURL(url);

        const base64 = this.bufferToBase64(bufferFile);
        const checksum = this.bufferChecksum(bufferFile);

        return { base64, checksum };
    }

    /**
     * Convierte un archivo base64 en buffer
     * @param base64 archivo en base64
     * @returns buffer de archivo
     */
    base64ToBuffer(base64: string) {
        return Buffer.from(base64, "base64");
    }

    /**
     * Guarda un buffer en memoria
     * @param filename nombre del archivo a guardar
     * @param buffer buffer a guardar
     */
    bufferToDisk(filename: string, buffer: Buffer) {
        fileSystem.writeFileSync(filename, buffer);
    }

    /**
     * Guarda un archivo base64 al disco
     * @param filename nombre del archivo
     * @param base64 archivi en base64
     */
    base64ToDisk(filename: string, base64: string) {
        const buffer = this.base64ToBuffer(base64);
        this.bufferToDisk(filename, buffer);
    }
}
