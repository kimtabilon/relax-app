import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GetService } from 'src/app/services/get.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { EnvService } from 'src/app/services/env.service';
import { HttpClient } from '@angular/common/http';
var ServicePage = /** @class */ (function () {
    function ServicePage(menu, authService, navCtrl, storage, alertService, loading, getService, router, env, http, activatedRoute) {
        this.menu = menu;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.alertService = alertService;
        this.loading = loading;
        this.getService = getService;
        this.router = router;
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
        this.category = [];
        this.services = [];
        this.title = 'Please wait...';
        this.photo = '';
        this.menu.enable(true);
    }
    ServicePage.prototype.ngOnInit = function () {
    };
    ServicePage.prototype.doRefresh = function (event) {
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
            _this.category_id = res.category_id;
            _this.http.post(_this.env.HERO_API + 'categories/byID', { app_key: _this.env.APP_ID, id: _this.category_id })
                .subscribe(function (data) {
                _this.category = data;
                _this.category = _this.category.data;
                _this.services = _this.category.services;
                _this.title = _this.category.name;
            }, function (error) {
                console.log(error);
            });
        });
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    ServicePage.prototype.ionViewWillEnter = function () {
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
            _this.category_id = res.category_id;
            _this.http.post(_this.env.HERO_API + 'categories/byID', { app_key: _this.env.APP_ID, id: _this.category_id })
                .subscribe(function (data) {
                _this.category = data;
                _this.category = _this.category.data;
                _this.services = _this.category.services;
                _this.title = _this.category.name;
            }, function (error) {
                console.log(error);
            });
        });
        this.loading.dismiss();
    };
    ServicePage.prototype.tapService = function (service) {
        // console.log(this.services);
        if (service.options.length && service.heroes.length) {
            this.router.navigate(['/tabs/option'], {
                queryParams: {
                    service_id: service.id,
                    category_id: this.category_id
                },
            });
        }
        else {
            // this.alertService.presentToast("No Service or Heroes Available");
        }
    };
    ServicePage.prototype.tapBack = function () {
        // console.log(service);
        this.router.navigate(['/tabs/home'], {
            queryParams: {},
        });
    };
    ServicePage.prototype.logout = function () {
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
    };
    ServicePage = tslib_1.__decorate([
        Component({
            selector: 'app-service',
            templateUrl: './service.page.html',
            styleUrls: ['./service.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController,
            AuthService,
            NavController,
            Storage,
            AlertService,
            LoadingService,
            GetService,
            Router,
            EnvService,
            HttpClient,
            ActivatedRoute])
    ], ServicePage);
    return ServicePage;
}());
export { ServicePage };
//# sourceMappingURL=service.page.js.map