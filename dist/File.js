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
exports.File = void 0;
var crypto_1 = require("crypto");
var fs_1 = __importDefault(require("fs"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var path_1 = require("path");
var File = (function () {
    function File() {
    }
    File.prototype.isURL = function (url) {
        return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi.test(url);
    };
    File.prototype.isPDF = function (path) {
        return /(\.(pdf))/gi.test(path);
    };
    File.prototype.readFile = function (path) {
        if (fs_1.default.statSync(path).isFile()) {
            return fs_1.default.readFileSync((0, path_1.resolve)(path));
        }
        return null;
    };
    File.prototype.readURL = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, node_fetch_1.default)(url)];
                    case 1:
                        response = _a.sent();
                        return [2, response.buffer()];
                }
            });
        });
    };
    File.prototype.bufferChecksum = function (buffer) {
        return (0, crypto_1.createHash)("sha256").update(buffer).digest("hex");
    };
    File.prototype.bufferToBase64 = function (buffer) {
        return Buffer.from(buffer).toString("base64");
    };
    File.prototype.fromLocal = function (path) {
        if (!fs_1.default.statSync(path).isFile() && !this.isPDF(path)) {
            throw new Error("La ruta indicada no es un archivo válido");
        }
        var bufferFile = this.readFile(path);
        var base64 = this.bufferToBase64(bufferFile);
        var checksum = this.bufferChecksum(bufferFile);
        return { base64: base64, checksum: checksum };
    };
    File.prototype.fromRemote = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var bufferFile, base64, checksum;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isURL(url)) {
                            throw new Error("La URL indicada no es válida");
                        }
                        return [4, this.readURL(url)];
                    case 1:
                        bufferFile = _a.sent();
                        base64 = this.bufferToBase64(bufferFile);
                        checksum = this.bufferChecksum(bufferFile);
                        return [2, { base64: base64, checksum: checksum }];
                }
            });
        });
    };
    File.prototype.base64ToBuffer = function (base64) {
        return Buffer.from(base64, "base64");
    };
    File.prototype.bufferToDisk = function (filename, buffer) {
        fs_1.default.writeFileSync(filename, buffer);
    };
    File.prototype.base64ToDisk = function (filename, base64) {
        var buffer = this.base64ToBuffer(base64);
        this.bufferToDisk(filename, buffer);
    };
    return File;
}());
exports.File = File;
