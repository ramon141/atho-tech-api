"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlDataSource = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const config = {
    name: 'mysql',
    connector: 'mysql',
    url: 'mysql://sql10530995:IpGWF2lSsL@sql10.freesqldatabase.com/sql10530995',
    host: '',
    port: 0,
    user: '',
    password: '',
    database: ''
};
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
let MysqlDataSource = class MysqlDataSource extends repository_1.juggler.DataSource {
    constructor(dsConfig = config) {
        super(dsConfig);
    }
};
MysqlDataSource.dataSourceName = 'mysql';
MysqlDataSource.defaultConfig = config;
MysqlDataSource = tslib_1.__decorate([
    (0, core_1.lifeCycleObserver)('datasource'),
    tslib_1.__param(0, (0, core_1.inject)('datasources.config.mysql', { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], MysqlDataSource);
exports.MysqlDataSource = MysqlDataSource;
//# sourceMappingURL=mysql.datasource.js.map