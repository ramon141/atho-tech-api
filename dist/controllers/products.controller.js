"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let ProductsController = class ProductsController {
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }
    async create(products) {
        return this.productsRepository.create(products);
    }
    async count(where) {
        return this.productsRepository.count(where);
    }
    async find(filter) {
        return this.productsRepository.find(filter);
    }
    async updateAll(products, where) {
        return this.productsRepository.updateAll(products, where);
    }
    async findById(id, filter) {
        return this.productsRepository.findById(id, filter);
    }
    async updateById(id, products) {
        await this.productsRepository.updateById(id, products);
    }
    async replaceById(id, products) {
        await this.productsRepository.replaceById(id, products);
    }
    async deleteById(id) {
        await this.productsRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/products'),
    (0, rest_1.response)(200, {
        description: 'Products model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Products) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Products, {
                    title: 'NewProducts',
                    exclude: ['id'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/products/count'),
    (0, rest_1.response)(200, {
        description: 'Products model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Products)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductsController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/products'),
    (0, rest_1.response)(200, {
        description: 'Array of Products model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Products, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Products)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductsController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/products'),
    (0, rest_1.response)(200, {
        description: 'Products PATCH success count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Products, { partial: true }),
            },
        },
    })),
    tslib_1.__param(1, rest_1.param.where(models_1.Products)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.Products, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductsController.prototype, "updateAll", null);
tslib_1.__decorate([
    (0, rest_1.get)('/products/{id}'),
    (0, rest_1.response)(200, {
        description: 'Products model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Products, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Products, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductsController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/products/{id}'),
    (0, rest_1.response)(204, {
        description: 'Products PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Products, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, models_1.Products]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductsController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/products/{id}'),
    (0, rest_1.response)(204, {
        description: 'Products PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, models_1.Products]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductsController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/products/{id}'),
    (0, rest_1.response)(204, {
        description: 'Products DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteById", null);
ProductsController = tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.ProductsRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.ProductsRepository])
], ProductsController);
exports.ProductsController = ProductsController;
//# sourceMappingURL=products.controller.js.map