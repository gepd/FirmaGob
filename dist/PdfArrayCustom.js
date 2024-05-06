var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a = require("pdf-lib"), PDFArray = _a.PDFArray, CharCodes = _a.CharCodes;
var PDFArrayCustom = (function (_super) {
    __extends(PDFArrayCustom, _super);
    function PDFArrayCustom() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFArrayCustom.withContext = function (context) {
        return new PDFArrayCustom(context);
    };
    PDFArrayCustom.prototype.clone = function (context) {
        var clone = PDFArrayCustom.withContext(context || this.context);
        for (var idx = 0, len = this.size(); idx < len; idx++) {
            clone.push(this.array[idx]);
        }
        return clone;
    };
    PDFArrayCustom.prototype.toString = function () {
        var arrayString = "[ ";
        for (var idx = 0, len = this.size(); idx < len; idx++) {
            arrayString += this.get(idx).toString();
            if (idx < len - 1)
                arrayString += " ";
        }
        arrayString += " ]";
        return arrayString;
    };
    PDFArrayCustom.prototype.sizeInBytes = function () {
        var size = 2;
        for (var idx = 0, len = this.size(); idx < len; idx++) {
            size += this.get(idx).sizeInBytes();
            if (idx < len - 1)
                size += 1;
        }
        return size;
    };
    PDFArrayCustom.prototype.copyBytesInto = function (buffer, offset) {
        var initialOffset = offset;
        buffer[offset++] = CharCodes.LeftSquareBracket;
        for (var idx = 0, len = this.size(); idx < len; idx++) {
            offset += this.get(idx).copyBytesInto(buffer, offset);
            if (idx < len - 1)
                buffer[offset++] = CharCodes.Space;
        }
        buffer[offset++] = CharCodes.RightSquareBracket;
        return offset - initialOffset;
    };
    return PDFArrayCustom;
}(PDFArray));
module.exports = PDFArrayCustom;
