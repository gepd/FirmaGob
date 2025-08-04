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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDF = void 0;
var node_signpdf_1 = require("node-signpdf");
var pdf_lib_incremental_save_1 = require("pdf-lib-incremental-save");
var SIGNATURE_LENGTH = 15000;
var DEFAULT_BYTE_RANGE_PLACEHOLDER = "**********";
var PDF = (function () {
    function PDF() {
        this.pdf = null;
        this.pdfBuffer = null;
        this.images = {};
        this.opacity = false;
    }
    PDF.prototype.loadFromBuffer = function (pdfBuffer) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.pdfBuffer = pdfBuffer;
                        _a = this;
                        return [4, pdf_lib_incremental_save_1.PDFDocument.load(pdfBuffer, { updateMetadata: false })];
                    case 1:
                        _a.pdf = _b.sent();
                        return [2];
                }
            });
        });
    };
    PDF.prototype.setPage = function (pageIndex) {
        this.pageIndex = pageIndex;
    };
    PDF.prototype.getPages = function () {
        return this.pdf.getPages();
    };
    PDF.prototype.setSigner = function (signer) {
        this.signer = signer;
    };
    PDF.prototype.addImage = function (name, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.images[name] = data;
                return [2];
            });
        });
    };
    PDF.prototype.setOperators = function (operator) {
        this.operators = operator;
    };
    PDF.prototype.getPreparedPDF = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.updateDictionary()];
                    case 1:
                        _a.sent();
                        return [2, this.preparedPdf.pdf];
                }
            });
        });
    };
    PDF.prototype.enableOpacity = function () {
        this.opacity = true;
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
    PDF.prototype.updateDictionary = function () {
        return __awaiter(this, void 0, void 0, function () {
            var snapshot, page, regular, bold, signatureDate, IMGObjs, _i, _a, key, imageBuffer, imageBytes, signatureDict, signatureDictRef, signatureIndex, widgetDict, widgetDictRef, context, rectArray, _b, x1, y1, x2, y2, width, height, Resources, XObject, Font, gsDict, gsRef, ExtGState, regularFont, boldFont, appearanceStream, appearanceRef, oldAnnots, annots, acroForm, oldAcro, keyFields, newFields, oldFields, catalogRef, catalogDict, incrementalBytes, incrementalPdf;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.pdf) {
                            throw new Error("NO_PDF");
                        }
                        if (!this.signer) {
                            throw new Error("NO_SIGNER");
                        }
                        snapshot = this.pdf.takeSnapshot();
                        page = this.pdf.getPage((_c = this.pageIndex) !== null && _c !== void 0 ? _c : 0);
                        return [4, this.pdf.embedFont(pdf_lib_incremental_save_1.StandardFonts.Helvetica, {
                                subset: true,
                            })];
                    case 1:
                        regular = _d.sent();
                        return [4, this.pdf.embedFont(pdf_lib_incremental_save_1.StandardFonts.HelveticaBold, {
                                subset: true,
                            })];
                    case 2:
                        bold = _d.sent();
                        signatureDate = new Date();
                        IMGObjs = {};
                        _i = 0, _a = Object.keys(this.images);
                        _d.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3, 6];
                        key = _a[_i];
                        imageBuffer = this.images[key];
                        return [4, this.pdf.embedPng(imageBuffer)];
                    case 4:
                        imageBytes = _d.sent();
                        IMGObjs[key] = imageBytes.ref;
                        _d.label = 5;
                    case 5:
                        _i++;
                        return [3, 3];
                    case 6:
                        snapshot.markRefForSave(page.ref);
                        signatureDict = this.pdf.context.obj({
                            Type: "Sig",
                            Filter: "Adobe.PPKLite",
                            SubFilter: "adbe.pkcs7.detached",
                            ByteRange: [
                                0,
                                DEFAULT_BYTE_RANGE_PLACEHOLDER,
                                DEFAULT_BYTE_RANGE_PLACEHOLDER,
                                DEFAULT_BYTE_RANGE_PLACEHOLDER,
                            ],
                            Contents: pdf_lib_incremental_save_1.PDFHexString.of("0".repeat(SIGNATURE_LENGTH)),
                            Reason: pdf_lib_incremental_save_1.PDFString.of(this.signer.reason),
                            M: pdf_lib_incremental_save_1.PDFString.fromDate(signatureDate),
                        });
                        signatureDictRef = this.pdf.context.register(signatureDict);
                        signatureIndex = this.pdf.getForm().getFields().length + 1;
                        widgetDict = this.pdf.context.obj({
                            Type: pdf_lib_incremental_save_1.PDFName.of("Annot"),
                            Subtype: pdf_lib_incremental_save_1.PDFName.of("Widget"),
                            FT: pdf_lib_incremental_save_1.PDFName.of("Sig"),
                            Rect: [
                                this.signer.x,
                                this.signer.y,
                                this.signer.x + this.signer.width,
                                this.signer.y + this.signer.height,
                            ],
                            V: signatureDictRef,
                            T: pdf_lib_incremental_save_1.PDFString.of("Signature".concat(signatureIndex)),
                            F: pdf_lib_incremental_save_1.PDFNumber.of(4),
                            P: page.ref,
                        });
                        widgetDictRef = this.pdf.context.register(widgetDict);
                        context = widgetDict.context;
                        rectArray = widgetDict.lookup(pdf_lib_incremental_save_1.PDFName.of("Rect"), pdf_lib_incremental_save_1.PDFArray);
                        _b = rectArray
                            .asArray()
                            .map(function (n) { return n.asNumber(); }), x1 = _b[0], y1 = _b[1], x2 = _b[2], y2 = _b[3];
                        width = x2 - x1;
                        height = y2 - y1;
                        Resources = {};
                        XObject = context.obj(IMGObjs);
                        Resources["XObject"] = XObject;
                        Font = context.obj({ Regular: regular.ref, Bold: bold.ref });
                        Resources["Font"] = Font;
                        if (this.opacity) {
                            gsDict = this.pdf.context.obj({
                                Type: "ExtGState",
                                ca: 0.5,
                                CA: 0.5,
                            });
                            gsRef = this.pdf.context.register(gsDict);
                            ExtGState = this.pdf.context.obj({ Opacity: gsRef });
                            Resources["ExtGState"] = ExtGState;
                        }
                        regularFont = {
                            name: pdf_lib_incremental_save_1.PDFName.of("Regular"),
                            font: regular,
                        };
                        boldFont = {
                            name: pdf_lib_incremental_save_1.PDFName.of("Bold"),
                            font: bold,
                        };
                        appearanceStream = context.formXObject(this.operators(regularFont, boldFont), {
                            Resources: Resources,
                            BBox: context.obj([0, 0, width, height]),
                            Matrix: context.obj([1, 0, 0, 1, 0, 0]),
                        });
                        appearanceRef = context.register(appearanceStream);
                        widgetDict.set(pdf_lib_incremental_save_1.PDFName.of("AP"), context.obj({ N: appearanceRef }));
                        oldAnnots = page.node.lookupMaybe(pdf_lib_incremental_save_1.PDFName.of("Annots"), pdf_lib_incremental_save_1.PDFArray);
                        annots = pdf_lib_incremental_save_1.PDFArray.withContext(context);
                        if (oldAnnots)
                            oldAnnots.asArray().forEach(function (ref) { return annots.push(ref); });
                        annots.push(widgetDictRef);
                        page.node.set(pdf_lib_incremental_save_1.PDFName.of("Annots"), annots);
                        oldAcro = this.pdf.catalog.lookupMaybe(pdf_lib_incremental_save_1.PDFName.of("AcroForm"), pdf_lib_incremental_save_1.PDFDict);
                        if (oldAcro) {
                            acroForm = context.obj({});
                            oldAcro.keys().forEach(function (key) { return acroForm.set(key, oldAcro.get(key)); });
                        }
                        else {
                            acroForm = context.obj({ SigFlags: pdf_lib_incremental_save_1.PDFNumber.of(3) });
                        }
                        keyFields = pdf_lib_incremental_save_1.PDFName.of("Fields");
                        newFields = pdf_lib_incremental_save_1.PDFArray.withContext(context);
                        oldFields = acroForm.lookupMaybe(keyFields, pdf_lib_incremental_save_1.PDFArray);
                        if (oldFields)
                            oldFields.asArray().forEach(function (ref) { return newFields.push(ref); });
                        newFields.push(widgetDictRef);
                        acroForm.set(keyFields, newFields);
                        catalogRef = this.pdf.context.getObjectRef(this.pdf.catalog);
                        catalogDict = this.pdf.context.lookup(catalogRef, pdf_lib_incremental_save_1.PDFDict);
                        catalogDict.set(pdf_lib_incremental_save_1.PDFName.of("AcroForm"), acroForm);
                        snapshot.markRefsForSave([catalogRef, appearanceRef]);
                        this.pdf.context.pdfFileDetails.useObjectStreams = false;
                        return [4, this.pdf.saveIncremental(snapshot)];
                    case 7:
                        incrementalBytes = _d.sent();
                        incrementalPdf = Buffer.concat([this.pdfBuffer, incrementalBytes]);
                        this.preparedPdf = node_signpdf_1.SignPdf.preparePdfForSigning(incrementalPdf);
                        return [2];
                }
            });
        });
    };
    PDF.prototype.sign = function (apiSignatures) {
        return __awaiter(this, void 0, void 0, function () {
            var signer, _i, _a, hash, signature, signedPdfBuffer;
            return __generator(this, function (_b) {
                if (!this.pdf && !this.pdfBuffer) {
                    throw new Error("NO_PDF");
                }
                signer = new node_signpdf_1.SignPdf();
                for (_i = 0, _a = apiSignatures.hashes; _i < _a.length; _i++) {
                    hash = _a[_i];
                    signature = hash.content;
                    signedPdfBuffer = signer.sign(this.preparedPdf.pdf, Buffer.from(signature, "base64"), this.preparedPdf.placeholderLength, this.preparedPdf.byteRange1);
                    return [2, signedPdfBuffer];
                }
                return [2];
            });
        });
    };
    return PDF;
}());
exports.PDF = PDF;
