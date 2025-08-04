"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textToHex = void 0;
var textToHex = function (text) {
    var le = Buffer.from(text, "utf16le");
    var be = Buffer.alloc(le.length);
    for (var i = 0; i < le.length; i += 2) {
        be[i] = le[i + 1];
        be[i + 1] = le[i];
    }
    return be.toString("hex").toUpperCase();
};
exports.textToHex = textToHex;
