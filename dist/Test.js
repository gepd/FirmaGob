"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var pdf_lib_1 = require("pdf-lib");
var index_1 = require("./index");
var signature1 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var file, pdf, firmaGob, sourcePdfbuffer, pages, font, bufferPng, pngEncoded64, appearance1, updated, hash, output, signedBuffer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                file = new index_1.File();
                pdf = new index_1.PDF();
                firmaGob = new index_1.FirmaGob();
                sourcePdfbuffer = file.fromLocalToBuffer("./Testing PDF.pdf");
                return [4, pdf.loadFromBuffer(sourcePdfbuffer)];
            case 1:
                _a.sent();
                pages = pdf.getPages();
                font = pdf_lib_1.StandardFonts.Helvetica;
                bufferPng = file.fromLocalToBuffer("/home/ubuntu-secundario/development/IMDA/FirmaGob/FirmaDigital-IMDA.png");
                pngEncoded64 = file.bufferToBase64(bufferPng);
                return [4, pdf.addImage("PDF_LIB_SIG_IMG", pngEncoded64)];
            case 2:
                _a.sent();
                appearance1 = __spreadArray(__spreadArray(__spreadArray([], (0, pdf_lib_1.drawImage)("PDF_LIB_SIG_IMG", {
                    x: 0,
                    y: 0,
                    width: 60,
                    height: 60,
                    rotate: (0, pdf_lib_1.degrees)(0),
                    xSkew: (0, pdf_lib_1.degrees)(0),
                    ySkew: (0, pdf_lib_1.degrees)(0),
                }), true), (0, pdf_lib_1.drawText)(pdf_lib_1.PDFHexString.fromText("Firmado Por: Firmante"), {
                    x: 70,
                    y: 40,
                    font: font,
                    size: 8,
                    color: (0, pdf_lib_1.rgb)(0, 0, 0),
                    rotate: (0, pdf_lib_1.degrees)(0),
                    xSkew: (0, pdf_lib_1.degrees)(0),
                    ySkew: (0, pdf_lib_1.degrees)(0),
                }), true), (0, pdf_lib_1.drawText)(pdf_lib_1.PDFHexString.fromText("Fecha: configurar fecha"), {
                    x: 70,
                    y: 30,
                    font: font,
                    size: 8,
                    color: (0, pdf_lib_1.rgb)(0, 0, 0),
                    rotate: (0, pdf_lib_1.degrees)(0),
                    xSkew: (0, pdf_lib_1.degrees)(0),
                    ySkew: (0, pdf_lib_1.degrees)(0),
                }), true);
                return [4, pdf.updateDictionary("Signature1", "reason1", appearance1, pages[0])];
            case 3:
                _a.sent();
                updated = pdf.getUpdatedPDF();
                hash = file.fromBufferToHash(updated);
                firmaGob.addHash(hash);
                return [4, firmaGob.signHashes()];
            case 4:
                output = _a.sent();
                return [4, pdf.sign(output)];
            case 5:
                signedBuffer = _a.sent();
                file.bufferToDisk("signedpdf_f1.pdf", signedBuffer);
                return [2];
        }
    });
}); };
var signature2 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var file, pdf, firmaGob, sourcePdfbuffer, pages, font, bufferPng, pngEncoded64, appearance1, updated, hash, output, signedBuffer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                file = new index_1.File();
                pdf = new index_1.PDF();
                firmaGob = new index_1.FirmaGob();
                sourcePdfbuffer = file.fromLocalToBuffer("./signedpdf_f1.pdf");
                return [4, pdf.loadFromBuffer(sourcePdfbuffer)];
            case 1:
                _a.sent();
                pages = pdf.getPages();
                font = pdf_lib_1.StandardFonts.Helvetica;
                bufferPng = file.fromLocalToBuffer("imagepng.png");
                pngEncoded64 = file.bufferToBase64(bufferPng);
                return [4, pdf.addImage("PDF_LIB_SIG_IMG", pngEncoded64)];
            case 2:
                _a.sent();
                appearance1 = __spreadArray(__spreadArray(__spreadArray([], (0, pdf_lib_1.drawImage)("PDF_LIB_SIG_IMG", {
                    x: 0,
                    y: 0,
                    width: 60,
                    height: 60,
                    rotate: (0, pdf_lib_1.degrees)(0),
                    xSkew: (0, pdf_lib_1.degrees)(0),
                    ySkew: (0, pdf_lib_1.degrees)(0),
                }), true), (0, pdf_lib_1.drawText)(pdf_lib_1.PDFHexString.fromText("Firmado Por: Firmante"), {
                    x: 70,
                    y: 40,
                    font: font,
                    size: 8,
                    color: (0, pdf_lib_1.rgb)(0, 0, 0),
                    rotate: (0, pdf_lib_1.degrees)(0),
                    xSkew: (0, pdf_lib_1.degrees)(0),
                    ySkew: (0, pdf_lib_1.degrees)(0),
                }), true), (0, pdf_lib_1.drawText)(pdf_lib_1.PDFHexString.fromText("Fecha: configurar fecha"), {
                    x: 70,
                    y: 30,
                    font: font,
                    size: 8,
                    color: (0, pdf_lib_1.rgb)(0, 0, 0),
                    rotate: (0, pdf_lib_1.degrees)(0),
                    xSkew: (0, pdf_lib_1.degrees)(0),
                    ySkew: (0, pdf_lib_1.degrees)(0),
                }), true);
                return [4, pdf.updateDictionary("Signature2", "reason2", appearance1, pages[0])];
            case 3:
                _a.sent();
                updated = pdf.getUpdatedPDF();
                hash = file.fromBufferToHash(updated);
                firmaGob.addHash(hash);
                return [4, firmaGob.signHashes()];
            case 4:
                output = _a.sent();
                return [4, pdf.sign(output)];
            case 5:
                signedBuffer = _a.sent();
                file.bufferToDisk("signedpdf_f2.pdf", signedBuffer);
                return [2];
        }
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, signature1()];
            case 1:
                _a.sent();
                return [4, signature2()];
            case 2:
                _a.sent();
                return [2];
        }
    });
}); };
main();
