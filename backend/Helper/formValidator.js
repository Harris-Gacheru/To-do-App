"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.FormSchema = joi_1.default.object({
    title: joi_1.default.string().required().max(30),
    description: joi_1.default.string().required(),
    due_date: joi_1.default.date().required(),
    assigned_to: joi_1.default.string().email().required()
});
