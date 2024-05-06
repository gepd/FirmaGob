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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDF = void 0;
var signpdf_1 = __importDefault(require("@signpdf/signpdf"));
var pdf_lib_1 = require("pdf-lib");
var PdfArrayCustom_1 = __importDefault(require("./PdfArrayCustom"));
var PDF_LIB_SIGNATURE = "iVBORw0KGgoAAAANSUhEUgAAApgAAAF5CAYAAAA7wVpzAAAgAElEQVR4nO3dT48jxf3H8Y5+sA" +
    "ssux4EaCGzy0y0URbESh4gCUi7kp1DtFH+yJZAWjYXG3KYlXKwb8MlsgkSl0h4LkRCHOwDEnvz" +
    "SBvOPeIJtPIImmfQD+H7O5Ay5bZnxn++/aeq3y+ppUCScY+nu+vTVd+qCgQAAABQFBR9AgAAAP" +
    "ALARMAAACqCJgAAABQRcAEAACAKgImAAAAVBEwAQAAoIqACQAAAFUETAAAAKgiYAIAAEAVARMA" +
    "AACqCJgAAABQRcAEAACAKgImAAAAVBEwAQAAoIqACQAAAFUETAAAAKgiYAIAAEAVARMAAACqCJ" +
    "gAAABQRcAEAACAKgImAAAAVBEwAQAAoIqACQAAAFUETAAAAKgiYAIAAEAVARMAAACqCJgAAABQ" +
    "RcAEAACAKgImAAAAVBEwAQAAoIqACQAAAFUETAAAAKgiYAIAAEAVARMAAACqCJgAAABQRcAEAA" +
    "CAKgImAAAAVBEwAQAAoIqACQAAAFUETAAAAKgiYAIAAEAVARMAAACqCJgAAABQRcAEAACAKgIm" +
    "AAAAVBEwAQAAoIqACQAAAFUETAAAAKgiYAIAAEAVARMAAACqCJgAAABQRcAEAACAKgImAAAAVB" +
    "EwAQAAoIqACQAAAFUETAAAAKgiYAIAAEAVARMAAACqCJgAAABQRcAEAACAKgImAAAAVBEwAQAA" +
    "oIqACQAAAFUETAAAAKgiYAIAAEAVARMAAACqCJgAAABQRcAEAACAKgImAAAAVBEwAQAAoIqACQ" +
    "AAAFUETAAAAKgiYAIAAEAVARMAAACqCJgAAABQRcAEAACAKgImAAAAVBEwAQAAoIqACQAAAFUE" +
    "TAAAAKgiYAIAAEAVARMAAACqCJgAAABQRcAEAACAKgImAAAAVBEwkYnBYCBBEMhgMCj6VAAAQM" +
    "4ImCUWhqFMJhMZDofS7Xal2WxKs9mU4XAow+FQTk9PJYqiok9zqSAIZgcAAKgWWv+ChWEow+FQ" +
    "2u22NJtN2d/fnwtnqx6XLl2Sfr8vcRwX/SuJiMje3l6lAyY9uACAKqtm61+gJElkMplIu93eKE" +
    "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" +
    "VQRMAAAAqCJgAgAAQBUBEwAAAKoImAAAAFBFwAQAAIAqAiYAAABUETABAACgioAJAAAAVQRMAA" +
    "AAqCJgAgAAQBUBEwAAAKoImAAAAFBFwAQAAIAqAiYAAABUETABAACgioAJAAAAVQRMAAAAqCJg" +
    "AgAAQBUBEwAAAKoImAAAAFBFwAQAAIAqAiYAAABUETABAACgioAJAAAAVQRMAAAAqCJgAgAAQB" +
    "UBEwAAAKoImAAAAFBFwAQAAIAqAiYAAABUETABAACgioAJAAAAVQRMAAAAqCJgAgAAQBUBEwAA" +
    "AKoImAAAAFBFwAQAAIAqAiYAAABUETABAACgioAJAAAAVQRMAAAAqCJgAgAAQBUBEwAAAKoImA" +
    "AAAFBFwAQAAIAqAiYAAABUETABAACgioAJAAAAVQRMAAAAqCJgAgAAQBUBEwAAAKoImAAAAFBF" +
    "wAQAAIAqAiYAAABUETABAACgioAJAAAAVQRMAAAAqCJgAgAAQBUBEwAAAKoImAAAAFBFwAQAAI" +
    "AqAiYAAABUETABAACgioAJAAAAVQRMAAAAqCJgAgAAQBUBEwAAAKoImAAAAFBFwAQAAIAqAiYA" +
    "AABUETABAACgioAJAAAAVQRMAAAAqCJgAgAAQBUBEwAAAKoImAAAAFBFwAQAAIAqAiYAAABUET" +
    "ABAACgioAJAAAAVQRMAAAAqPp/bVlFhjBDLggAAAAASUVORK5CYII=";
var PDF = (function () {
    function PDF() {
        this.pdf = null;
        this.images = {};
    }
    PDF.prototype.loadFromBuffer = function (pdfBuffer) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4, pdf_lib_1.PDFDocument.load(pdfBuffer)];
                    case 1:
                        _a.pdf = _b.sent();
                        return [2];
                }
            });
        });
    };
    PDF.prototype.loadFromPdfDocument = function (pdfDocument) {
        this.pdf = pdfDocument;
    };
    PDF.prototype.getPages = function () {
        return this.pdf.getPages();
    };
    PDF.prototype.getPresignedPDF = function () {
        var _a;
        return (_a = this.preSigned) === null || _a === void 0 ? void 0 : _a.pdf;
    };
    PDF.prototype.addImage = function (name, data) {
        return __awaiter(this, void 0, void 0, function () {
            var embedImage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.pdf.embedPng(data)];
                    case 1:
                        embedImage = _a.sent();
                        this.images[name] = embedImage.ref;
                        return [2];
                }
            });
        });
    };
    PDF.prototype.updateDictionary = function (reason, operators, page) {
        return __awaiter(this, void 0, void 0, function () {
            var rectX, rectY, rectWidth, rectHeight, signatureDate, SIGNATURE_LENGTH, ByteRange, signatureDict, signatureDictRef, widgetDict, widgetDictRef, form, sig, modifiedPdfBytes, modifiedPdfBuffer, preSigned, _a, pdf, placeholderLength, byteRange1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.pdf) {
                            throw new Error("NO_PDF");
                        }
                        rectX = 100;
                        rectY = 0;
                        rectWidth = 200;
                        rectHeight = 60;
                        signatureDate = new Date();
                        SIGNATURE_LENGTH = 15000;
                        ByteRange = PdfArrayCustom_1.default.withContext(this.pdf.context);
                        ByteRange.push(pdf_lib_1.PDFNumber.of(0));
                        ByteRange.push(pdf_lib_1.PDFName.of(signpdf_1.default.DEFAULT_BYTE_RANGE_PLACEHOLDER));
                        ByteRange.push(pdf_lib_1.PDFName.of(signpdf_1.default.DEFAULT_BYTE_RANGE_PLACEHOLDER));
                        ByteRange.push(pdf_lib_1.PDFName.of(signpdf_1.default.DEFAULT_BYTE_RANGE_PLACEHOLDER));
                        signatureDict = this.pdf.context.obj({
                            Type: "Sig",
                            Filter: "Adobe.PPKLite",
                            SubFilter: "adbe.pkcs7.detached",
                            ByteRange: ByteRange,
                            Contents: pdf_lib_1.PDFHexString.of("A".repeat(SIGNATURE_LENGTH)),
                            Reason: pdf_lib_1.PDFString.of(reason),
                            M: pdf_lib_1.PDFString.fromDate(signatureDate),
                        });
                        signatureDictRef = this.pdf.context.register(signatureDict);
                        widgetDict = this.pdf.context.obj({
                            Type: "Annot",
                            Subtype: "Widget",
                            FT: "Sig",
                            Rect: [rectX, rectY, rectX + rectWidth, rectY + rectHeight],
                            V: signatureDictRef,
                            T: pdf_lib_1.PDFString.of("Signature1"),
                            F: 4,
                            P: page.ref,
                        });
                        widgetDictRef = this.pdf.context.register(widgetDict);
                        page.node.set(pdf_lib_1.PDFName.of("Annots"), this.pdf.context.obj([widgetDictRef]));
                        this.pdf.catalog.set(pdf_lib_1.PDFName.of("AcroForm"), this.pdf.context.obj({
                            SigFlags: 3,
                            Fields: [widgetDictRef],
                        }));
                        form = this.pdf.getForm();
                        sig = form.getSignature("Signature1");
                        sig.acroField.getWidgets().forEach(function (widget) {
                            var context = widget.dict.context;
                            var _a = widget.getRectangle(), width = _a.width, height = _a.height;
                            var stream = context.formXObject(operators, {
                                Resources: { XObject: _this.images },
                                BBox: context.obj([0, 0, width, height]),
                                Matrix: context.obj([1, 0, 0, 1, 0, 0]),
                            });
                            var streamRef = context.register(stream);
                            widget.setNormalAppearance(streamRef);
                        });
                        return [4, this.pdf.save({ useObjectStreams: false })];
                    case 1:
                        modifiedPdfBytes = _b.sent();
                        modifiedPdfBuffer = Buffer.from(modifiedPdfBytes);
                        console.log({ modifiedPdfBuffer: modifiedPdfBuffer });
                        preSigned = new signpdf_1.default.SignPdf();
                        _a = preSigned.sign(modifiedPdfBuffer, true), pdf = _a.pdf, placeholderLength = _a.placeholderLength, byteRange1 = _a.byteRange1;
                        this.preSigned = {
                            pdf: pdf,
                            placeholderLength: placeholderLength,
                            byteRange: byteRange1,
                        };
                        return [2];
                }
            });
        });
    };
    PDF.prototype.sign = function (apiSignatures) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, hash, signature, binaryString, bytes, i, byteBuffer, signedObj, signedPdfBuffer;
            return __generator(this, function (_b) {
                if (!this.pdf) {
                    throw new Error("NO_PDF");
                }
                for (_i = 0, _a = apiSignatures.hashes; _i < _a.length; _i++) {
                    hash = _a[_i];
                    signature = hash.content;
                    binaryString = Buffer.from(signature, "base64").toString("latin1");
                    bytes = new Uint8Array(binaryString.length);
                    for (i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    byteBuffer = bytes.buffer;
                    signedObj = new signpdf_1.default.SignPdf();
                    signedPdfBuffer = signedObj.sign(this.preSigned.pdf, false, byteBuffer, this.preSigned.placeholderLength, this.preSigned.byteRange);
                    return [2, signedPdfBuffer];
                }
                return [2];
            });
        });
    };
    return PDF;
}());
exports.PDF = PDF;
