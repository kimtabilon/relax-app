import * as tslib_1 from "tslib";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { EnvService } from './env.service';
import { AlertService } from './alert.service';
var GetService = /** @class */ (function () {
    function GetService(http, storage, env, navCtrl, alertService) {
        this.http = http;
        this.storage = storage;
        this.env = env;
        this.navCtrl = navCtrl;
        this.alertService = alertService;
    }
    GetService.prototype.all = function () {
        var _this = this;
        this.http.post(this.env.HERO_API + 'categories/all', { key: this.env.APP_ID }).subscribe(function (data) {
            // console.log(data);
            _this.storage.set('categories', data);
            // 
        }, function (error) {
        }, function () {
            // this.navCtrl.navigateRoot('/tabs/service');
        });
    };
    GetService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient,
            Storage,
            EnvService,
            NavController,
            AlertService])
    ], GetService);
    return GetService;
}());
export { GetService };
//# sourceMappingURL=get.service.js.map