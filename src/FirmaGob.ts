import { createHmac } from "crypto"
import fetch from "node-fetch"

enum Environment {
  TEST = 0,
  PRODUCTION = 1,
}

export enum Purpose {
  ATENDIDO = "Propósito General",
  DESATENDIDO = "Desatendido",
}

interface FileProps {
  "content-type": string
  content: string
  description: string
  checksum: string
  layout?: string
  references?: string[]
  xmlObjects?: string[]
}

interface FileInProps {
  content: string
  status: string
  contentType: string
  documentStatus: string
  checksum_original: string
}

interface MetadataProps {
  otpExpired: boolean
  filesSigned: number
  signedFailed: number
  objectReceived: number
}

interface FileOutputProps {
  files: FileInProps[]
  metadata: MetadataProps
  status: number
  error?: string
}

export class FirmaGob {
  private url = "https://api.firma.cert.digital.gob.cl/firma/v2/files/tickets"
  private environment = Environment.TEST
  private entity = "Subsecretaría General de la Presidencia"
  private run = "22222222"
  private purpose = Purpose.DESATENDIDO
  private api_token_key = "sandbox"
  private secret = "27a216342c744f89b7b82fa290519ba0"
  private files: FileProps[] = []

  constructor() {}

  /**
   * Modifica los parametros de configuración de la librería
   * @param run run identificador del titular de firma, no debe contener puntos, guión ni tampoco el dígito verificador
   * @param entity código asociado a la institución a la cual pertenece el titular
   * @param api_token Campo no encriptado de tipo string que contiene el código único generado a partir del registro de la aplicación
   * @param secret secreto generado por firma.gob al registrar la aplicación
   */
  setConfig(run: string, entity: string, api_token: string, secret: string) {
    this.run = run
    this.entity = entity
    this.api_token_key = api_token
    this.secret = secret
    this.environment = Environment.PRODUCTION
  }

  /**
   * Establece si el certificado es de proposito general o desatendido
   * @param purpose código asociado al tipo de certificado a utilizar
   *                Purpose.ATENDIDO (Propósito general)
   *                Purpose.DESATENDIDO (Desatendido)
   */
  setPurpose(purpose: Purpose) {
    this.purpose = purpose
  }

  /**
   * Agrega un archivo JSON a la lista de archivos
   * @param content Archivo en base64
   * @param checksum SHA256 del archivo
   */
  addJSON(content: string, checksum: string) {
    this.files.push({
      "content-type": "application/json",
      description: "str",
      content,
      checksum,
    })
  }

  /**
   * Agrega un archivo PDF a la lista de archivos
   * @param content Archivo en base64
   * @param checksum SHA256 del archivo
   * @param layout string opcional en caso de desear incrustar elemento al archivo PDF
   */
  addPDF(content: string, checksum: string, layout?: string) {
    this.files.push({
      "content-type": "application/pdf",
      description: "str",
      content,
      checksum,
      layout,
    })
  }

  /**
   * Agrega un archivo PDF a la lista de archivos
   * @param content Archivo en base64
   * @param checksum SHA256 del archivo
   * @param references array de string con la identificación del nodo a firmar en
   *                   caso de ser un archivo XML ejemplo: [“#nodo1”, “#nodo2”]
   * @param xmlObjects array de string con los pie de firma en un archivo XML
                       ejemplo: ["<a></a>","<b/>”]
   */
  addXML(
    content: string,
    checksum: string,
    references: string[],
    xmlObjects: string[]
  ) {
    this.files.push({
      "content-type": "application/xml",
      description: "str",
      content,
      checksum,
      references,
      xmlObjects,
    })
  }

  /**
   * Agrega multiples archivos a la lista de archivos a ser firmados
   * @param files Lista de archivos a firmar
   */
  addFiles(files: FileProps[]) {
    this.files = files
  }

  /**
   * Firma los archivos previamente establecidos
   * @param otp Si la firma es de propósito general necesitas enviar el código OTG
   * @returns Respuesta con documentos firmados o errores
   */
  async signFiles(otp?: string): Promise<FileOutputProps> {
    if (this.environment === Environment.TEST) {
      console.warn(
        "Estás en el ambiente de pruebas, para cambiar a producción utiliza, setConfig"
      )
    }

    if (this.purpose === Purpose.ATENDIDO && !otp) {
      throw new Error(
        "Los certificados de propósito general requieren de un código OTG"
      )
    }

    const header = {
      alg: "HS256",
      typ: "JWT",
    }

    const THIRTY_MINUTES = 29 * 60 * 1000
    const expiration = new Date()
    const tzoffset = new Date().getTimezoneOffset() * 60000 // Para obtener hora local

    expiration.setTime(expiration.getTime() - tzoffset + THIRTY_MINUTES) // Agrega 30 minutos

    const payload = {
      entity: this.entity,
      run: this.run,
      purpose: this.purpose,
      expiration: expiration.toISOString(),
    }

    const header_str = JSON.stringify(header)
    const header_enc = Buffer.from(header_str).toString("base64")

    const payload_str = JSON.stringify(payload)
    const payload_enc = Buffer.from(payload_str)
      .toString("base64")
      .replace(/\=/g, "")

    const unsigned_token = `${header_enc}.${payload_enc}`

    const signature_str = createHmac("sha256", this.secret).update(
      unsigned_token
    )
    const signature_enc = signature_str.digest("base64").replace(/\=/g, "")

    const token = `${unsigned_token}.${signature_enc}`

    const headers: HeadersInit = { "Content-Type": "application/json" }

    if (this.purpose === Purpose.ATENDIDO) {
      headers.OTP = otp
    }

    const body = JSON.stringify({
      api_token_key: this.api_token_key,
      files: this.files,
      token,
    })

    const response = await fetch(this.url, { method: "post", body, headers })

    return await { ...response.json(), status: response.status }
  }
}
