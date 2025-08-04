import { createHash } from "crypto";
import fileSystem from "fs";
import fetch from "node-fetch";
import { resolve } from "path";

export class File {
  /**
   * Verifica si la URL enviada es válida o no
   * @param url link a vertificar
   * @returns True si es correcto, False si no
   */
  private static isURL(url: string) {
    return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi.test(
      url
    );
  }

  /**
   * Verifica si la ruta enviada corresponde a un archivo PDF
   * @param path Archivo PDF
   * @returns True si es correcto, False si no
   */
  private static isPDF(path: string) {
    return /(\.(pdf))/gi.test(path);
  }

  /**
   * Lee archivo desde ruta enviada
   * @param path Ruta del archivo a leer
   * @returns Buffer
   */
  static readFile(path: string) {
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
  static async readURL(url: string) {
    const response = await fetch(url);
    return response.buffer();
  }

  /**
   * Calcula checksum desde el buffer de un archivo
   * @param buffer buffer de archivo
   * @returns string con checksum
   */
  private static bufferChecksum(buffer: Buffer) {
    return createHash("sha256").update(buffer).digest("base64");
  }

  /**
   * Convierte el buffer de un archivo en base64
   * @param buffer buffer de archivo
   * @returns string de archivo en base64
   */
  static bufferToBase64(buffer: Buffer) {
    return Buffer.from(buffer).toString("base64");
  }

  /**
   * Obtiene los datos de un buffer y calcula su hash (checksum)
   * @param buffer buffer del archivo
   * @returns hash del archivo (checksum)
   */
  static fromBufferToHash(buffer: Buffer) {
    return File.bufferChecksum(buffer);
  }

  /**
   * Obtiene los datos de un archivo local y los convierte a un buffer
   * @param path ruta del archivo
   * @returns objeto buffer
   */
  static fromLocalToBuffer(path: string) {
    if (!fileSystem.statSync(path).isFile() && !File.isPDF(path)) {
      throw new Error("La ruta indicada no es un archivo válido");
    }

    return File.readFile(path);
  }

  /**
   * Obtiene los datos de un archivo local y los convierte en base64
   * además retorna el checksum del arhivo
   * @param path ruta del archivo
   * @returns objeto con archivo en base64 y checksum
   */
  static fromLocal(path: string) {
    const bufferFile = File.fromLocalToBuffer(path);
    const base64 = File.bufferToBase64(bufferFile);
    const checksum = File.bufferChecksum(bufferFile);

    return { base64, checksum };
  }

  /**
   * Obtiene los datos de un archivo local y calcula su hash (checksum)
   * @param path ruta del archivo
   * @returns hash del archivo (checksum)
   */
  static fromLocalToHash(path: string) {
    const bufferFile = File.fromLocalToBuffer(path);
    return File.bufferChecksum(bufferFile);
  }

  /**
   * Obtiene los datos de un archivo remoto (URL) y los convierte
   * a un buffer
   * @param path ruta del archivo
   * @returns objeto buffer
   */
  static async fromRemoteToBuffer(url: string) {
    if (!File.isURL(url)) {
      throw new Error("La URL indicada no es válida");
    }

    return File.readURL(url);
  }

  /**
   * Obtiene un archivo desde una URL
   * @param url dirección del archivo pdf
   * @returns objeto con archivo en base64 y checksum
   */
  static async fromRemote(url: string) {
    if (!File.isURL(url)) {
      throw new Error("La URL indicada no es válida");
    }

    const bufferFile = await File.fromRemoteToBuffer(url);

    const base64 = File.bufferToBase64(bufferFile);
    const checksum = File.bufferChecksum(bufferFile);

    return { base64, checksum };
  }

  /**
   * Obtiene un archivo desde una URL y calcula su hash (checksum)
   * @param url dirección del archivo pdf
   * @returns hash del archivo (checksum)
   */
  static async fromRemoteToHash(url: string) {
    if (!File.isURL(url)) {
      throw new Error("La URL indicada no es válida");
    }

    const bufferFile = await File.fromRemoteToBuffer(url);

    return File.bufferChecksum(bufferFile);
  }

  /**
   * Convierte un archivo base64 en buffer
   * @param base64 archivo en base64
   * @returns buffer de archivo
   */
  static base64ToBuffer(base64: string) {
    return Buffer.from(base64, "base64");
  }

  /**
   * Guarda un buffer en memoria
   * @param filename nombre del archivo a guardar
   * @param buffer buffer a guardar
   */
  static bufferToDisk(filename: string, buffer: Buffer) {
    fileSystem.writeFileSync(filename, buffer);
  }

  /**
   * Guarda un archivo base64 al disco
   * @param filename nombre del archivo
   * @param base64 archivi en base64
   */
  static base64ToDisk(filename: string, base64: string) {
    const buffer = File.base64ToBuffer(base64);
    File.bufferToDisk(filename, buffer);
  }
}
