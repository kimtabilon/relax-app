import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { EnvService } from 'src/app/services/env.service';
var SummaryPage = /** @class */ (function () {
    function SummaryPage(menu, authService, navCtrl, storage, activatedRoute, loading, env, alertService) {
        this.menu = menu;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.activatedRoute = activatedRoute;
        this.loading = loading;
        this.env = env;
        this.alertService = alertService;
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
        this.service = {
            name: '',
            amount: '',
            provider: '',
            status: ''
        };
        this.photo = '';
        this.menu.enable(true);
    }
    SummaryPage.prototype.ngOnInit = function () {
    };
    SummaryPage.prototype.doRefresh = function (event) {
        var _this = this;
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
        this.activatedRoute.queryParams.subscribe(function (res) {
            _this.service = JSON.parse(res.service);
        });
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    SummaryPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.loading.present();
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
        this.activatedRoute.queryParams.subscribe(function (res) {
            _this.service = JSON.parse(res.service);
        });
        this.loading.dismiss();
    };
    SummaryPage.prototype.logout = function () {
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
    };
    SummaryPage = tslib_1.__decorate([
        Component({
            selector: 'app-summary',
            templateUrl: './summary.page.html',
            styleUrls: ['./summary.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController,
            AuthService,
            NavController,
            Storage,
            ActivatedRoute,
            LoadingService,
            EnvService,
            AlertService])
    ], SummaryPage);
    return SummaryPage;
}());
export { SummaryPage };
//# sourceMappingURL=summary.page.js.map