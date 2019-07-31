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
var QuotationPage = /** @class */ (function () {
    function QuotationPage(menu, authService, navCtrl, storage, alertService, router, activatedRoute, http, loading, env) {
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
        this.menu.enable(true);
    }
    QuotationPage.prototype.ngOnInit = function () {
    };
    QuotationPage.prototype.doRefresh = function (event) {
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
            _this.job = JSON.parse(res.job);
            _this.quotations = _this.job.quotations;
            _this.title = _this.job.form.option.name;
        });
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    QuotationPage.prototype.ionViewWillEnter = function () {
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
            _this.job = JSON.parse(res.job);
            _this.quotations = _this.job.quotations;
            _this.title = _this.job.form.option.name;
        });
        this.loading.dismiss();
    };
    QuotationPage.prototype.tapHero = function (quote) {
        var _this = this;
        this.loading.present();
        this.http.post(this.env.HERO_API + 'jobs/modify', { job_id: this.job.id, hero_id: quote.hero.id, amount: quote.amount }).subscribe(function (data) {
            // this.job = data;
        }, function (error) {
            _this.alertService.presentToast("Server not responding!");
        }, function () {
            // this.alertService.presentToast("Please wait for confirmation!"); 
            _this.router.navigate(['/tabs/job'], {
                queryParams: {},
            });
        });
        this.loading.dismiss();
    };
    QuotationPage.prototype.tapBack = function () {
        this.loading.present();
        this.router.navigate(['/tabs/inbox'], {
            queryParams: {},
        });
        this.loading.dismiss();
    };
    QuotationPage.prototype.logout = function () {
        this.loading.present();
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
        this.loading.dismiss();
    };
    QuotationPage = tslib_1.__decorate([
        Component({
            selector: 'app-quotation',
            templateUrl: './quotation.page.html',
            styleUrls: ['./quotation.page.scss'],
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
    ], QuotationPage);
    return QuotationPage;
}());
export { QuotationPage };
//# sourceMappingURL=quotation.page.js.map