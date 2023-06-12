"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Services = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let Services = class Services extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", String)
], Services.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Services.prototype, "description", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
        dataType: 'FLOAT'
    }),
    tslib_1.__metadata("design:type", Number)
], Services.prototype, "value", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Services.prototype, "enterpriseId", void 0);
Services = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Services);
exports.Services = Services;
//# sourceMappingURL=services.model.js.map