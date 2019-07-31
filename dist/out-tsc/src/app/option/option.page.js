import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { EnvService } from 'src/app/services/env.service';
import { HttpClient } from '@angular/common/http';
var OptionPage = /** @class */ (function () {
    function OptionPage(menu, authService, navCtrl, storage, alertService, router, loading, env, http, activatedRoute) {
        this.menu = menu;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.alertService = alertService;
        this.router = router;
        this.loading = loading;
        this.env = env;
        this.http = http;
        this.activatedRoute = activatedRoute;
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
        this.title = 'Please wait...';
        this.service = [];
        this.services = [];
        this.heroes = [];
        this.photo = '';
        this.menu.enable(true);
    }
    OptionPage.prototype.ngOnInit = function () {
    };
    OptionPage.prototype.doRefresh = function (event) {
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
            _this.service_id = res.service_id;
            _this.category_id = res.category_id;
            _this.http.post(_this.env.HERO_API + 'services/byID', { app_key: _this.env.APP_ID, id: _this.service_id })
                .subscribe(function (data) {
                _this.service = data;
                _this.service = _this.service.data;
                _this.options = _this.service.options;
                _this.title = _this.service.name;
                _this.payType = _this.service.pay_type;
            }, function (error) {
                console.log(error);
            });
        });
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    OptionPage.prototype.ionViewWillEnter = function () {
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
            _this.service_id = res.service_id;
            _this.category_id = res.category_id;
            _this.http.post(_this.env.HERO_API + 'services/byID', { app_key: _this.env.APP_ID, id: _this.service_id })
                .subscribe(function (data) {
                _this.service = data;
                _this.service = _this.service.data;
                _this.options = _this.service.options;
                _this.title = _this.service.name;
                _this.payType = _this.service.pay_type;
            }, function (error) {
                console.log(error);
            });
        });
        this.loading.dismiss();
    };
    OptionPage.prototype.tapOption = function (option) {
        this.loading.present();
        if (option.form !== null) {
            this.router.navigate(['/tabs/form'], {
                queryParams: {
                    option_id: option.id,
                    service_id: this.service_id,
                    category_id: this.category_id,
                    payType: this.payType
                },
            });
        }
        else {
            // this.alertService.presentToast("No Form Available");
        }
        this.loading.dismiss();
    };
    OptionPage.prototype.tapBack = function () {
        this.loading.present();
        this.router.navigate(['/tabs/service'], {
            queryParams: {
                category_id: this.category_id
            },
        });
        this.loading.dismiss();
    };
    OptionPage.prototype.logout = function () {
        this.loading.present();
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
        this.loading.dismiss();
    };
    OptionPage = tslib_1.__decorate([
        Component({
            selector: 'app-option',
            templateUrl: './option.page.html',
            styleUrls: ['./option.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController,
            AuthService,
            NavController,
            Storage,
            AlertService,
            Router,
            LoadingService,
            EnvService,
            HttpClient,
            ActivatedRoute])
    ], OptionPage);
    return OptionPage;
}());
export { OptionPage };
//# sourceMappingURL=option.page.js.map