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
const { FirmaGob, PDF } = require("firma-gob");

```

Por defecto la librería inicia con los parámetros de desarrollo con el certificado desatendido, por lo que puedes comenzar a usarla para pruebas directamente

> tuarchivo.js
```js
const {FirmaGob, PDF} = new FirmaGob();

const gob = new FirmaGob();
const pdf = new PDF();

const file = await pdf.fromURL("linkToPdf");
gob.addPDF(file.base64, file.checksum); // agrega pdf

// o también desde un archivo local

const file = pdf.fromFile("pathToPdf");
gob.addPDF(file.base64, file.checksum); // agrega pdf

// firmar documentos y recibir respuesta
const output = await gob.sign();

// guarda archivos con la clase PDF
pdf.files.forEach((file) => {
   base64ToFile(`file_${file.checksum_original}.pdf`,file.content)
});

```

luego ya puedes ejecutar `node tuarchivo.js`


# FirmaGob

Actualmente la clase `FirmaGob` cuenta con los siguientes métodos

### setConfig

modifica los parametros de configuración de la librería. 

> Al modificar estos parámetros automáticamente la librería pasa a modo **producción**

  * **run** identificador del titular de firma, no debe contener puntos, guión ni tampoco el dígito verificador
   * **entity** código asociado a la institución a la cual pertenece el titular
   * **api_token** campo no encriptado de tipo string que contiene el código único generado a partir del registro de la aplicación
   * **secret** secreto generado por firma.gob al registrar la aplicación

```ts
gob.setConfig(run: string, entity: string, api_token: string, secret: string)
```

### setPurpose (Propósito General por defecto)

Establece si el certificado es de proposito general o desatendido
   * **purpose** código asociado al tipo de certificado a utilizar

Parámetros permitidos:

* Purpose.ATENDIDO (Propósito general)

* Purpose.DESATENDIDO (Desatendido)

```ts
gob.setPurpose(purpose: Purpose)
```

### addJSON

Agrega un archivo JSON a la lista de archivos
   
   * **content** Archivo en base64
   * **checksum** SHA256 del archivo

 ```ts
 gob.addJSON(content: string, checksum: string)
 ```

### addPDF

Agrega un archivo PDF a la lista de archivos

   * **content** Archivo en base64
   * **checksum** SHA256 del archivo
   * **layout** string opcional en caso de desear incrustar elemento al archivo PDF

  ```ts
  gob.addPDF(content: string, checksum: string, layout?: string)
  ```
    
### addXML

Agrega un archivo PDF a la lista de archivos
   * **content** Archivo en base64
   * **checksum** SHA256 del archivo
   * **references** array de string con la identificación del nodo a firmar en caso de ser un archivo XML ejemplo: [“#nodo1”, “#nodo2”]
   * **xmlObjects** array de string con los pie de firma en un archivo XML ejemplo: `["<a></a>","<b/>”]`

```ts
  gob.addXML(content: string, checksum: string, references: string[], xmlObjects: string[])
```

### addFiles

Agrega multiples archivos a la lista de archivos a ser firmados

   * **files** Lista de archivos a firmar

  ```ts
  gob.addFiles(files: FileProps[])
  ```

### sign

Firma los archivos previamente establecidos

   * **otp** Si la firma es de propósito general necesitas enviar el código OTG
  
   * **Respuesta** con documentos firmados o errores

```ts
gob.signFiles(otp?: string)

```

# PDF

La clase `PDF` te ayudará a manipular tus archivos PDF para ser usados con `FirmaGob`

```js
// crea una instancia de la clase PDF
const pdf = new PDF();
```

### fromFile

Obtiene los datos de un archivo local y los convierte en base64

   * **path** Ruta del archivo en tu disco
  
   * **Respuesta** objeto { base64, checksum }

```ts
pdf.fromFile(path: string) 

```

### fromURL

Obtiene un archivo pdf desde un servidor remoto y lo convierte a base64 

   * **url** URL del archivo PDF
  
   * **Respuesta** objeto { base64, checksum }

```ts
pdf.fromURL(url: string)

```

### base64ToBuffer

Convierte un archivo en base64 a buffer

   * **base64** archivo en base64
  
   * **Respuesta** buffer de archivo

```ts
pdf.base64ToBuffer(base64: string)

```

### bufferToFile

  Usa el buffer dado y lo almacena en el disco con el nombre especificado

   * **filename** nombre del archivo a guardar

   * **buffer** buffer de archivo
  

```ts
pdf.bufferToFile(filename: string, buffer: Buffer)

```

### base64ToFile

  Almacena en el disco un archivo en base64

   * **filename** nombre del archivo a guardar

   * **base64** archivo en base64
  

```ts
pdf.base64ToFile(filename: string, base64: string)

```

# Desarrollo

La librería está escrita con typescript, al modificar el `index.ts` debes ejecutar `tsc` para recompilar el archivo `index.js` (debes tener instalado tsc)

Todos los comentarios y PR son bienvenidos.

La idea es ir complementando la librería para poder manejar con mayor facilidad cada archivo

# Licencia

Este proyecto está liberado bajo la licencia MIT, quiere decir que puedes hacer lo que quieras (incluso comercialmente)