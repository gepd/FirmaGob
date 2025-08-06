"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawTextSegments = exports.PDF = exports.File = exports.Purpose = exports.FirmaGob = void 0;
var FirmaGob_1 = require("./FirmaGob");
Object.defineProperty(exports, "FirmaGob", { enumerable: true, get: function () { return FirmaGob_1.FirmaGob; } });
Object.defineProperty(exports, "Purpose", { enumerable: true, get: function () { return FirmaGob_1.Purpose; } });
var File_1 = require("./File");
Object.defineProperty(exports, "File", { enumerable: true, get: function () { return File_1.File; } });
var PDF_1 = require("./PDF");
Object.defineProperty(exports, "PDF", { enumerable: true, get: function () { return PDF_1.PDF; } });
var drawTextSegments_1 = require("./drawTextSegments");
Object.defineProperty(exports, "drawTextSegments", { enumerable: true, get: function () { return drawTextSegments_1.drawTextSegments; } });
__exportStar(require("pdf-lib-incremental-save"), exports);
