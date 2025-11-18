"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirmaGob = exports.Purpose = void 0;
var crypto_1 = require("crypto");
var node_fetch_1 = __importDefault(require("node-fetch"));
var Environment;
(function (Environment) {
    Environment[Environment["TEST"] = 0] = "TEST";
    Environment[Environment["PRODUCTION"] = 1] = "PRODUCTION";
})(Environment || (Environment = {}));
var Purpose;
(function (Purpose) {
    Purpose["ATENDIDO"] = "Prop\u00F3sito General";
    Purpose["DESATENDIDO"] = "Desatendido";
})(Purpose || (exports.Purpose = Purpose = {}));
var FirmaGob = (function () {
    function FirmaGob() {
        this.url_desarrollo = "https://api.firma.cert.digital.gob.cl/firma/v2/files/tickets";
        this.url_produccion = "https://api.firma.digital.gob.cl/firma/v2/files/tickets";
        this.environment = Environment.TEST;
        this.entity = "Subsecretaría General de la Presidencia";
        this.run = "22222222";
        this.purpose = Purpose.DESATENDIDO;
        this.api_token_key = "sandbox";
        this.secret = "27a216342c744f89b7b82fa290519ba0";
        this.files = [];
    }
    FirmaGob.prototype.setConfig = function (props) {
        this.entity = props.entity;
        this.api_token_key = props.api_token;
        this.secret = props.secret;
        this.environment = Environment.PRODUCTION;
    };
    FirmaGob.prototype.setPurpose = function (purpose) {
        this.purpose = purpose;
    };
    FirmaGob.prototype.setRun = function (run) {
        this.run = run;
    };
    FirmaGob.prototype.addJSON = function (content, checksum) {
        this.files.push({
            "content-type": "application/json",
            description: "str",
            content: content,
            checksum: checksum,
        });
    };
    FirmaGob.prototype.addPDF = function (content, checksum, layout) {
        this.files.push({
            "content-type": "application/pdf",
            description: "str",
            content: content,
            checksum: checksum,
            layout: layout,
        });
    };
    FirmaGob.prototype.addHash = function (hash) {
        this.files.push({
            "content-type": "application/pdf",
            content: hash,
        });
    };
    FirmaGob.prototype.addXML = function (content, checksum, references, xmlObjects) {
        this.files.push({
            "content-type": "application/xml",
            description: "str",
            content: content,
            checksum: checksum,
            references: references,
            xmlObjects: xmlObjects,
        });
    };
    FirmaGob.prototype.addFiles = function (files) {
        this.files = files;
    };
    FirmaGob.prototype.sign = function (signPayload, otp) {
        return __awaiter(this, void 0, void 0, function () {
            var url, header, THIRTY_MINUTES, expiration, tzoffset, payload, header_str, header_enc, payload_str, payload_enc, unsigned_token, signature_str, signature_enc, token, headers, body, response, responseJson, status;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = this.url_produccion;
                        if (this.environment === Environment.TEST) {
                            url = this.url_desarrollo;
                            console.warn("Estás en el ambiente de pruebas, para cambiar a producción utiliza, setConfig");
                        }
                        if (this.purpose === Purpose.ATENDIDO && !otp) {
                            throw new Error("Los certificados de propósito general requieren de un código OTP");
                        }
                        if ((!signPayload.files || ((_a = signPayload.files) === null || _a === void 0 ? void 0 : _a.length) === 0) &&
                            (!signPayload.hashes || ((_b = signPayload.hashes) === null || _b === void 0 ? void 0 : _b.length) === 0)) {
                            throw new Error("Necesitas agregar al menos un archivo o un hash");
                        }
                        header = {
                            alg: "HS256",
                            typ: "JWT",
                        };
                        THIRTY_MINUTES = 29 * 60 * 1000;
                        expiration = new Date();
                        tzoffset = new Date().getTimezoneOffset() * 60000;
                        expiration.setTime(expiration.getTime() - tzoffset + THIRTY_MINUTES);
                        payload = {
                            entity: this.entity,
                            run: this.run,
                            purpose: this.purpose,
                            expiration: expiration.toISOString(),
                        };
                        header_str = JSON.stringify(header);
                        header_enc = Buffer.from(header_str).toString("base64");
                        payload_str = JSON.stringify(payload);
                        payload_enc = Buffer.from(payload_str)
                            .toString("base64")
                            .replace(/\=/g, "");
                        unsigned_token = "".concat(header_enc, ".").concat(payload_enc);
                        signature_str = (0, crypto_1.createHmac)("sha256", this.secret).update(unsigned_token);
                        signature_enc = signature_str.digest("base64").replace(/\=/g, "");
                        token = "".concat(unsigned_token, ".").concat(signature_enc);
                        headers = { "Content-Type": "application/json" };
                        if (this.purpose === Purpose.ATENDIDO) {
                            headers.OTP = otp;
                        }
                        body = JSON.stringify(__assign({ api_token_key: this.api_token_key, token: token }, signPayload));
                        return [4, (0, node_fetch_1.default)(url, {
                                method: "post",
                                body: body,
                                headers: headers,
                            })];
                    case 1:
                        response = _c.sent();
                        return [4, response.json()];
                    case 2:
                        responseJson = _c.sent();
                        status = response.status;
                        return [2, __assign(__assign({}, responseJson), { status: status })];
                }
            });
        });
    };
    FirmaGob.prototype.signFiles = function (otp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.sign({ files: this.files }, otp)];
            });
        });
    };
    FirmaGob.prototype.signHashes = function (otp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.sign({ hashes: this.files }, otp)];
            });
        });
    };
    return FirmaGob;
}());
exports.FirmaGob = FirmaGob;
