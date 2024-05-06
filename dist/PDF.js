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
var PDF = (function () {
    function PDF() {
        this.pdf = null;
        this.xObject = {};
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
    PDF.prototype.getUpdatedPDF = function () {
        return this.preSigned.pdf;
    };
    PDF.prototype.addImage = function (name, data) {
        return __awaiter(this, void 0, void 0, function () {
            var embedImage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.pdf.embedPng(data)];
                    case 1:
                        embedImage = _a.sent();
                        this.xObject[name] = embedImage.ref;
                        return [2];
                }
            });
        });
    };
    PDF.prototype.getPdfBuffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modifiedPdfBytes1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.pdf.save({ useObjectStreams: false })];
                    case 1:
                        modifiedPdfBytes1 = _a.sent();
                        return [2, Buffer.from(modifiedPdfBytes1)];
                }
            });
        });
    };
    PDF.prototype.updateDictionary = function (signatureId, reason, operators, page) {
        return __awaiter(this, void 0, void 0, function () {
            var modifiedPdfBytes1, modifiedPdfBuffer1, rectX, rectY, rectWidth, rectHeight, signatureDate, SIGNATURE_LENGTH, ByteRange, signatureDict, signatureDictRef, widgetDict, widgetDictRef, annots, acroForm, fields, form, sig, modifiedPdfBytes, modifiedPdfBuffer, preSigned, _a, pdf, placeholderLength, byteRange1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.pdf) {
                            throw new Error("NO_PDF");
                        }
                        return [4, this.pdf.save({ useObjectStreams: false })];
                    case 1:
                        modifiedPdfBytes1 = _b.sent();
                        modifiedPdfBuffer1 = Buffer.from(modifiedPdfBytes1);
                        console.log("Tamaño inicial del PDF:", modifiedPdfBuffer1.length);
                        console.log("Contenido inicial del PDF:", modifiedPdfBuffer1.toString("utf8", 0, 500));
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
                            T: pdf_lib_1.PDFString.of(signatureId),
                            F: 4,
                            P: page.ref,
                        });
                        widgetDictRef = this.pdf.context.register(widgetDict);
                        annots = page.node.Annots() || this.pdf.context.obj([]);
                        annots.push(widgetDictRef);
                        page.node.set(pdf_lib_1.PDFName.of("Annots"), annots);
                        acroForm = this.pdf.catalog.lookupMaybe(pdf_lib_1.PDFName.of("AcroForm"), pdf_lib_1.PDFDict);
                        if (acroForm) {
                            fields = acroForm.lookup(pdf_lib_1.PDFName.of("Fields"), pdf_lib_1.PDFArray);
                            fields.push(widgetDictRef);
                        }
                        else {
                            this.pdf.catalog.set(pdf_lib_1.PDFName.of("AcroForm"), this.pdf.context.obj({
                                SigFlags: 3,
                                Fields: [widgetDictRef],
                            }));
                        }
                        form = this.pdf.getForm();
                        sig = form.getSignature(signatureId);
                        sig.acroField.getWidgets().forEach(function (widget) {
                            var context = widget.dict.context;
                            var _a = widget.getRectangle(), width = _a.width, height = _a.height;
                            var stream = context.formXObject(operators, {
                                Resources: { XObject: _this.xObject },
                                BBox: context.obj([0, 0, width, height]),
                                Matrix: context.obj([1, 0, 0, 1, 0, 0]),
                            });
                            var streamRef = context.register(stream);
                            widget.setNormalAppearance(streamRef);
                        });
                        return [4, this.pdf.save({ useObjectStreams: false })];
                    case 2:
                        modifiedPdfBytes = _b.sent();
                        modifiedPdfBuffer = Buffer.from(modifiedPdfBytes);
                        console.log("Contenido cerca del primer ByteRange:", modifiedPdfBuffer.toString("utf8", 20520 - 50, 35522 + 50));
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
