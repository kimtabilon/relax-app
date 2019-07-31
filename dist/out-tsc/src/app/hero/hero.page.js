import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { EnvService } from 'src/app/services/env.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from 'src/app/services/loading.service';
var HeroPage = /** @class */ (function () {
    function HeroPage(menu, authService, navCtrl, storage, alertService, router, activatedRoute, http, loading, env) {
        this.menu = menu;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.alertService = alertService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.http = http;
        this.loading = loading;
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
        this.title = 'Please wait...';
        this.heroes = [];
        this.menu.enable(true);
    }
    HeroPage.prototype.ngOnInit = function () {
    };
    HeroPage.prototype.doRefresh = function (event) {
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    HeroPage.prototype.ionViewWillEnter = function () {
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
            _this.job_id = res.job_id;
            _this.form_id = res.form_id;
            _this.option_id = res.option_id;
            _this.service_id = res.service_id;
            _this.category_id = res.category_id;
            _this.schedule_date = res.schedule_date;
            _this.payper = res.payper * 1;
            _this.http.post(_this.env.HERO_API + 'services/heroes', { app_key: _this.env.APP_ID, id: _this.service_id, schedule_date: _this.schedule_date })
                .subscribe(function (data) {
                var response = data;
                if (response !== null) {
                    _this.heroes = response.data.heroes;
                    _this.title = response.data.name;
                }
                console.log(data);
            }, function (error) {
                console.log(error);
            });
        });
        this.loading.dismiss();
    };
    HeroPage.prototype.tapHero = function (hero) {
        var _this = this;
        this.loading.present();
        this.amount = (hero.pivot.pay_per * 1) * (this.payper);
        this.http.post(this.env.HERO_API + 'jobs/modify', { job_id: this.job_id, hero_id: hero.id, amount: this.amount }).subscribe(function (data) {
            // this.job = data;
        }, function (error) {
            _this.alertService.presentToast("Server not responding!");
        }, function () {
            // this.alertService.presentToast("Please wait for confirmation!"); 
            _this.router.navigate(['/tabs/summary'], {
                queryParams: {
                    service: JSON.stringify({
                        name: _this.title,
                        amount: _this.amount,
                        provider: hero.profile.first_name + ' ' + hero.profile.last_name,
                        status: 'For Confirmation'
                    })
                },
            });
        });
        this.loading.dismiss();
    };
    HeroPage.prototype.tapBack = function () {
        this.loading.present();
        this.router.navigate(['/tabs/home'], {
            queryParams: {},
        });
        this.loading.dismiss();
    };
    HeroPage.prototype.logout = function () {
        this.loading.present();
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
        this.loading.dismiss();
    };
    HeroPage = tslib_1.__decorate([
        Component({
            selector: 'app-hero',
            templateUrl: './hero.page.html',
            styleUrls: ['./hero.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController,
            AuthService,
            NavController,
            Storage,
            AlertService,
            Router,
            ActivatedRoute,
            HttpClient,
            LoadingService,
            EnvService])
    ], HeroPage);
    return HeroPage;
}());
export { HeroPage };
//# sourceMappingURL=hero.page.js.map