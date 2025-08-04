# Firma Gob

Librería javascript para firmar documentos usando la API de Firma.Gob (Chile)

instalar

```js
// npm
npm install firma-gob

// yarn
yarn add firma-gob
```

Importa la librería en tu código

## FirmaGob

```js
const { FirmaGob, File } = require("firma-gob");
```

Por defecto la librería inicia con los parámetros de desarrollo (certificado desatendido), por lo que puedes comenzar a usarla para pruebas directamente

```js
// tuarchivo.js
// Ejemplo firma archivos PDF, firma gob recomienda firmar un hash

const { FirmaGob, File } = new FirmaGob();

const gob = new FirmaGob();
const file = new File();

const remote = await file.fromRemote("linkToPdf");
gob.addPDF(remote.base64, remote.checksum); // agrega pdf

// o también desde un archivo local

const local = file.fromLocal("pathToPdf");
gob.addPDF(local.base64, local.checksum); // agrega pdf

// firmar documentos y recibir respuesta
const output = await gob.signFiles();

// guarda archivos con la clase File
output.files.forEach((item) => {
  file.base64ToDisk(`file_${item.checksum_original}.pdf`, item.content);
});
```

luego ya puedes ejecutar `node tuarchivo.js`

## Firmar un hash

```js
// tuarchivo.js

const { FirmaGob, File } = new FirmaGob();

const gob = new FirmaGob();
const file = new File();

const hash = await file.fromRemoteToHash("linkToPdf"); // agrega hash
gob.addHash(hash);

// o también desde un archivo local

const hash = file.fromLocalToHash("pathToPdf");
gob.addHash(hash); // agrega hash

// firmar documentos y recibir respuesta
const output = await gob.signHashes();

// agregar firma a archivo PDF
const hashes = output.hashes; // array de hashes
```

# FirmaGob

Actualmente la clase `FirmaGob` cuenta con los siguientes métodos

### setConfig

modifica los parametros de configuración de la librería.

> Al modificar estos parámetros automáticamente la librería pasa a modo **producción**

- **run** identificador del titular de firma, no debe contener puntos, guión ni tampoco el dígito verificador
- **entity** código asociado a la institución a la cual pertenece el titular
- **api_token** campo no encriptado de tipo string que contiene el código único generado a partir del registro de la aplicación
- **secret** secreto generado por firma.gob al registrar la aplicación

```ts
gob.setConfig(run: string, entity: string, api_token: string, secret: string)
```

### setPurpose (Propósito Desatendido por defecto)

Establece si el certificado es de proposito general o desatendido

- **purpose** código asociado al tipo de certificado a utilizar

Parámetros permitidos:

- Purpose.ATENDIDO (Propósito general)

- Purpose.DESATENDIDO (Desatendido)

```ts
gob.setPurpose(purpose: Purpose)
```

### addJSON

Agrega un archivo JSON a la lista de archivos

- **content** Archivo en base64
- **checksum** SHA256 del archivo

```ts
gob.addJSON(content: string, checksum: string)
```

### addPDF

Agrega un archivo PDF a la lista de archivos

- **content** Archivo en base64
- **checksum** SHA256 del archivo
- **layout** string opcional en caso de desear incrustar elemento al archivo PDF

```ts
gob.addPDF(content: string, checksum: string, layout?: string)
```

### addHash

Agrega un hash a la lista de archivos

- **hash** hash del archivo a firmar

```ts
gob.addHash(hash: string)
```

### addXML

Agrega un archivo PDF a la lista de archivos

- **content** Archivo en base64
- **checksum** SHA256 del archivo
- **references** array de string con la identificación del nodo a firmar en caso de ser un archivo XML ejemplo: [“#nodo1”, “#nodo2”]
- **xmlObjects** array de string con los pie de firma en un archivo XML ejemplo: `["<a></a>","<b/>”]`

```ts
  gob.addXML(content: string, checksum: string, references: string[], xmlObjects: string[])
```

### addFiles

Agrega multiples archivos a la lista de archivos a ser firmados

- **files** Lista de archivos a firmar

```ts
gob.addFiles(files: FileProps[])
```

### signFiles

Firma los archivos previamente establecidos

- **otp** Si la firma es de propósito general necesitas enviar el código OTP

- **Respuesta** con documentos firmados o errores, para este método siempre existirá una clave **files** con los archivos firmados

```ts
gob.signFiles(otp?: string)

```

### signHashes

Firma los hashes previamente establecidos con `addHash`

- **otp** Si la firma es de propósito general necesitas enviar el código OTP

- **Respuesta** con documentos firmados o errores, para este método siempre existirá una clave **hashes** con los certificados que deben ser agregados al archivo PDF

```ts
gob.signHashes(otp?: string)

```

## PDF

La clase `PDF` te permite preparar e inyectar firmas digitales en tus documentos de forma sencilla.
Funciona como complemento de `FirmaGob`, recibiendo la firma en `base64` generada por el método de firma con hash y añadiéndola incrementalmente al PDF para mantener válida la primera o las firmas sucesivas.

---

### Importación

```ts
import { PDF } from "firma-gob";
```

---

### Tipos y configuración inicial

#### `SignerInfo`

Define los parámetros visuales y de posición del widget de firma:

```ts
export type SignerInfo = {
  reason: string; // Motivo que aparecerá en la firma
  width: number; // Ancho del área de firma (en pts)
  height: number; // Alto del área de firma (en pts)
  x: number; // Coordenada X (desde la esquina inferior izquierda)
  y: number; // Coordenada Y
};
```

---

### Métodos principales

Carga un PDF existente desde un buffer en memoria.

```ts
await pdf.loadFromBuffer(pdfBytes);
```

---

#### `setSigner(signer: SignerInfo): void`

Define la información del firmante (posición, tamaño y motivo).

```ts
pdf.setSigner({
  reason: "Revisión Contable",
  width: 230,
  height: 80,
  x: 50,
  y: 650,
});
```

---

#### `addImage(name: string, imageBytes: Uint8Array): Promise<void>`

Inyecta una imagen al PDF y la registra.

```ts
await pdf.addImage("Git", signatureImagen);
```

---

#### `enableOpacity(): void`

Habilita el uso de estados gráficos (`ExtGState`) para soportar opacidad en los operadores.

```ts
pdf.enableOpacity();
```

---

#### `setOperators(operatorFn: (regular: FontInfo, bold: FontInfo) => PDFOperator[]): void`

Define la secuencia de operadores gráficos que formarán el contenido visual del widget de firma.

- Recibe dos objetos `FontInfo` el primero con Helvetica Regular y el Segundo con Helvetica Bold. El objeto contiene su nombre y ` PDFFont`para ser usado con `drawTextSegments`
- Debe devolver un array de `PDFOperator` (puede usar helpers como `pushGraphicsState()`, `drawRectangle()`, `drawImage()`, `drawTextSegments()`, `popGraphicsState()`, etc.).

```ts
pdf.setOperators((regular, bold) => [
  pushGraphicsState(),
  setGraphicsState(PDFName.of("Opacity")),
  ...drawRectangle({
    x: 0,
    y: 0,
    width: signer.width,
    height: signer.height,
    color: rgb(0.95, 0.95, 0.95),
    borderWidth: 1,
    borderColor: rgb(0.8, 0.8, 0.8),
  }),
  popGraphicsState(),

  ...drawImage("Git", {
    x: 10,
    y: (signer.height - 40) / 2,
    width: 40,
    height: 40,
    rotate: degrees(0),
    xSkew: degrees(0),
    ySkew: degrees(0),
  }),

  setCharacterSpacing(-0.8),

  ...drawTextSegments(
    [
      { segments: [{ texto: "Firmado por", fontName: regular.name }] },
      {
        segments: [
          {
            texto: "Guillermo Parraguez",
            fontName: bold.name,
            font: bold.font,
          },
        ],
      },
      { segments: [{ texto: "Coordinador de Transformación Digital" }] },
      {
        segments: [
          { texto: "Fecha", fontName: bold.name, font: bold.font },
          { texto: new Date().toISOString() },
        ],
      },
      { segments: [{ texto: "Ilustre Municipalidad de Diego de Almagro" }] },
    ],
    {
      x: 65,
      y: 55,
      fontName: regular.name,
      font: regular.font,
      size: 7,
      color: rgb(0, 0, 0),
    }
  ),
]);
```

---

Nota: `drawTextSegments` es una función que permite generar texto con diferentes fuentes (regular, Bold) en una misma linea, tal como el ejemplo anterior

#### `getPreparedPDF(): Promise<Uint8Array>`

Devuelve el buffer del PDF **preparado** para firmar (contiene AcroForm, campos, widgets y aparición visual). Se usa para calcular el hash antes de la firma.

```ts
const prepared = await pdf.getPreparedPDF();
```

---

#### `sign(signedHashes: SignatureOutput[]): Uint8Array`

Aplica la firma PKCS#7 (base64) retornada por la API y devuelve el PDF firmado final.

```ts
const signedPDF = pdf.sign(outputFromFirmaGob);
```

---

### Ejemplo completo de uso

```ts
import { FirmaGob, File, PDF } from "firma-gob";

const signer: SignerInfo = {
  reason: "Revisión Contable",
  width: 230,
  height: 80,
  x: 50,
  y: 650,
};

const main = async () => {
  const gob = new FirmaGob();
  const pdf = new PDF();
  const file = new File();

  // Leer archivos
  const signatureImagen = file.fromLocalToBytes("./signature.png");
  const pdfBuffer = file.fromLocalToBytes("./Testing PDF.pdf");

  // Preparar PDF
  await pdf.loadFromBuffer(pdfBuffer);
  pdf.setSigner(signer);
  await pdf.addImage("Git", signatureImagen);
  pdf.enableOpacity();
  pdf.setOperators((regular, bold) => [
    /* ...operadores como se mostró arriba... */
  ]);

  // Obtener PDF preparado y firmarlo
  const prepared = await pdf.getPreparedPDF();
  const hash = file.fromBufferToHash(prepared);
  gob.addHash(hash);

  const signedOut = await gob.signHashes();
  const signedPDF = pdf.sign(signedOut);

  // Guardar resultado
  file.base64ToDisk("./documento-final-firmado.pdf", signedPDF);
  console.log("PDF final guardado en ./documento-final-firmado.pdf");
};

main();
```

# File

La clase `File` te ayudará a manipular tus archivos para ser usados con `FirmaGob`

```js
// crea una instancia de la clase File
const file = new File();
```

### fromLocal

Obtiene los datos de un archivo local y los convierte en base64

- **path** Ruta del archivo en tu disco

- **Respuesta** objeto { base64, checksum }

```ts
pdf.fromLocal(path: string)

```

### fromLocalToHash

Obtiene los datos de un archivo local y calcula su hash (cheksum)

- **path** Ruta del archivo en tu disco

- **Respuesta** string hash (checksum)

```ts
pdf.fromLocalToHash(path: string)

```

### fromRemote

Obtiene un archivo pdf desde un servidor remoto y lo convierte a base64

- **url** URL del archivo PDF

- **Respuesta** objeto { base64, checksum }

```ts
pdf.fromRemote(url: string)

```

### fromRemoteToHash

Obtiene los datos de un archivo desde un servidor remoto y calcula su hash (cheksum)

- **path** Ruta del archivo en tu disco

- **Respuesta** string hash (checksum)

```ts
pdf.fromRemoteToHash(url: string)

```

### base64ToBuffer

Convierte un archivo en base64 a buffer

- **base64** archivo en base64

- **Respuesta** buffer de archivo

```ts
pdf.base64ToBuffer(base64: string)

```

### bufferToDisk

Usa el buffer dado y lo almacena en el disco con el nombre especificado

- **filename** nombre del archivo a guardar

- **buffer** buffer de archivo

```ts
pdf.bufferToDisk(filename: string, buffer: Buffer)

```

### base64ToDisk

Almacena en el disco un archivo en base64

- **filename** nombre del archivo a guardar

- **base64** archivo en base64

```ts
pdf.base64ToDisk(filename: string, base64: string)

```

# Desarrollo

La librería está escrita con typescript, al modificar el `index.ts` debes ejecutar `tsc` para recompilar el archivo `index.js` (debes tener instalado tsc)

Todos los comentarios y PR son bienvenidos.

La idea es ir complementando la librería para poder manejar con mayor facilidad cada archivo

# Más información

Para obtener más información acerca de esta API pudes descargar los manuales en https://firma.digital.gob.cl/biblioteca/manuales-firmagob/

# Licencia

Este proyecto está liberado bajo la licencia MIT, quiere decir que puedes hacer lo que quieras (incluso comercialmente)
