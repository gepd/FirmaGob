## 1.4.0

- 🪄 Agregados metodos: `addHash`, `signHashes`
  Agregada lógica para firmar archivos por hashes db5b14b
- 🚧 usar types en vez de interface 8be217c
- 🚧 status solo puede ser "OK" o "error" 4c5c759

## 1.3.0

- 🪄 Agregado `fromLocalToHash` y `fromRemoteToHash` para calcular el hash sin necesidad de devolver el archivo en base64 4470e6c

## 1.2.4

- 🚧 Agregado estado, error e idSolicitud a respuesta de signFiles b01b7d4
- 🚧 Corregido errores menores tipográficos 6a1b94f

## 1.2.3

- 🚧 Corregido Purpose enum no exportado 7881409
- 🚧 Agregado release-it como dependencia de desarrollo aac99e1

## 1.2.2

- 🚧 Corregida ruta de archivo main en package.json 68ee2fb

## 1.2.1

- 🚧 Agregada dependencia faltante 4f471ab

## 1.2.0

- 🚧 Renombrado método `base64ToFile` a `base64ToDisk` 482287a
- 🚧 Renombrado método `bufferToFile` a `bufferToDisk` df962fa
- 🚧 Renombrado Método `fromURL` a `fromRemote` f71222a
- 🚧Renombrado método `fromFile` a `fromLocal` 17ef572
- 🚧 Renombrada clase `PDF` a `File` ab7f2f9
- 🚧 Ignorar node_modules y archivos fuentes en npm 905711b
- 📄Documentación actualizada 76782db
- 📄Actualización menor de la documentación c162149
- 📄 Agregada referencia a manuales en firma.gob .cl 7d5da3a
- 🚧 actualizado código fuente y types f6f10f6
- 🚧 Corregido número versión para publicar de06723

## 1.0.0

- 🚧Actualizados pasos de instalación 0b54c20
- 📄 Agregada información de clase PDF 0b54c20
- 🪄 Nuevo método base64ToFile a1d4b18
- 🪄 Nuevo método bufferToFile 9ae7341
- 🪄 Nuevo método base64ToBuffer 75574c8
- 🧹 Eliminada la manipulación de PDF b701b67
- 🧹 Eliminado método outputRaw ya que signFiles retornará la respuesta b701b67
- 🚧 Archivos fuentes trasladados a la carpeta `src ` 010bab0
- 🚧 Documentada información faltante 15808ef
- 🚧 Agregada información con últimos cambios 927b8c0

https://github.com/gepd/FirmaGob/compare/v1.0.0-0...v1.0.0

## 1.0.0-beta

### Nuevo

- Método `base64ToFile` que permite guardar archivo PDF en el disco
- Método `outputRaw` que permite obtener la respuesta de la API sin modificar
- Clase para manejar archivos PDFs

### Bug

- Corregido problema que no permitía firmar documentos PDFs

## 0.0.1

- Primera publicación del código, prueba de concepto del
