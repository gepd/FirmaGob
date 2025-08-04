/**
 * Convierte un texto en su representación hexadecimal UTF-16BE.
 *
 * Toma la cadena `t`, la codifica en UTF-16LE, luego intercambia cada par de bytes
 * para obtener UTF-16BE y devuelve el resultado en mayúsculas.
 *
 * @param text - Texto de entrada a convertir.
 * @returns Cadena con los bytes en hexadecimal (UTF-16BE) en mayúsculas.
 */
export const textToHex = (text: string) => {
  const le = Buffer.from(text, "utf16le");
  const be = Buffer.alloc(le.length);
  for (let i = 0; i < le.length; i += 2) {
    be[i] = le[i + 1];
    be[i + 1] = le[i];
  }
  return be.toString("hex").toUpperCase();
};
