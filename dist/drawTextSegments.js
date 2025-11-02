"use strict";
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
exports.drawTextSegments = void 0;
var pdf_lib_incremental_save_1 = require("pdf-lib-incremental-save");
var drawTextSegments = function (lines, base) {
    var x0 = base.x, y0 = base.y, fontObj = base.font, baseName = base.fontName, baseSize = base.size, _a = base.color, baseColor = _a === void 0 ? (0, pdf_lib_incremental_save_1.rgb)(0, 0, 0) : _a, _b = base.rotate, baseRotate = _b === void 0 ? (0, pdf_lib_incremental_save_1.degrees)(0) : _b, _c = base.xSkew, baseXSkew = _c === void 0 ? (0, pdf_lib_incremental_save_1.degrees)(0) : _c, _d = base.ySkew, baseYSkew = _d === void 0 ? (0, pdf_lib_incremental_save_1.degrees)(0) : _d, _e = base.lineHeight, lineHeight = _e === void 0 ? baseSize + 2 : _e;
    return lines.flatMap(function (line, rowIdx) {
        var cursorX = x0;
        return line.segments.flatMap(function (segment) {
            var texto = segment.texto, _a = segment.font, font = _a === void 0 ? fontObj : _a, _b = segment.fontName, fontName = _b === void 0 ? baseName : _b, _c = segment.size, size = _c === void 0 ? baseSize : _c, _d = segment.color, color = _d === void 0 ? baseColor : _d, _e = segment.rotate, rotate = _e === void 0 ? baseRotate : _e, _f = segment.xSkew, xSkew = _f === void 0 ? baseXSkew : _f, _g = segment.ySkew, ySkew = _g === void 0 ? baseYSkew : _g;
            var gap = 5;
            var textWidth = font.widthOfTextAtSize(texto, size);
            var characterSpacingOp = (0, pdf_lib_incremental_save_1.setCharacterSpacing)(0);
            var ops = (0, pdf_lib_incremental_save_1.drawText)(font.encodeText(texto), {
                x: cursorX,
                y: y0 - lineHeight * rowIdx,
                font: fontName,
                size: size,
                color: color,
                rotate: rotate,
                xSkew: xSkew,
                ySkew: ySkew,
            });
            cursorX += textWidth + gap;
            return __spreadArray([characterSpacingOp], ops, true);
        });
    });
};
exports.drawTextSegments = drawTextSegments;
