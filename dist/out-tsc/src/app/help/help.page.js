import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GetService } from 'src/app/services/get.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/services/env.service';
var HelpPage = /** @class */ (function () {
    function HelpPage(menu, authService, navCtrl, storage, alertService, loading, getService, router, http, env) {
        this.menu = menu;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.alertService = alertService;
        this.loading = loading;
        this.getService = getService;
        this.router = router;
        this.http = http;
        this.env = env;
        this.user = {
            email: '',
            password: '',
            status: ''
        };
        this.profile = {
            first_name: '',
            middle_name: '',
            last_name: '',
            birthday: '',
            gender: '',
            photo: ''
        };
        this.photo = '';
        this.menu.enable(true);
    }
    HelpPage.prototype.ngOnInit = function () {
    };
    HelpPage.prototype.doRefresh = function (event) {
        var _this = this;
        this.authService.validateApp();
        this.storage.get('customer').then(function (val) {
            _this.user = val.data;
            _this.profile = val.data.profile;
            if (_this.profile.photo !== null) {
                _this.photo = _this.env.IMAGE_URL + 'uploads/' + _this.profile.photo;
            }
            else {
                _this.photo = _this.env.DEFAULT_IMG;
            }
        });
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    HelpPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.loading.present();
        this.authService.validateApp();
        this.storage.get('customer').then(function (val) {
            // console.log(val.data);
            _this.user = val.data;
            _this.profile = val.data.profile;
            if (_this.profile.photo !== null) {
                _this.photo = _this.env.IMAGE_URL + 'uploads/' + _this.profile.photo;
            }
            else {
                _this.photo = _this.env.DEFAULT_IMG;
            }
        });
        this.loading.dismiss();
    };
    HelpPage.prototype.logout = function () {
        this.loading.present();
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
        this.loading.dismiss();
    };
    HelpPage = tslib_1.__decorate([
        Component({
            selector: 'app-help',
            templateUrl: './help.page.html',
            styleUrls: ['./help.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController,
            AuthService,
            NavController,
            Storage,
            AlertService,
            LoadingService,
            GetService,
            Router,
            HttpClient,
            EnvService])
    ], HelpPage);
    return HelpPage;
}());
export { HelpPage };
//# sourceMappingURL=help.page.js.map