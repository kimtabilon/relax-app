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
var InboxPage = /** @class */ (function () {
    function InboxPage(http, menu, authService, navCtrl, storage, alertService, loading, getService, router, env) {
        this.http = http;
        this.menu = menu;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.alertService = alertService;
        this.loading = loading;
        this.getService = getService;
        this.router = router;
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
        this.jobs = [];
        this.photo = '';
        this.menu.enable(true);
    }
    InboxPage.prototype.ngOnInit = function () {
    };
    InboxPage.prototype.doRefresh = function (event) {
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    InboxPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.loading.present();
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
            /*Get My Jobs*/
            _this.http.post(_this.env.HERO_API + 'customer/quotations', { customer_id: _this.user.id, app_key: _this.env.APP_ID })
                .subscribe(function (data) {
                _this.jobs = data;
                _this.jobs = _this.jobs.data;
            }, function (error) { });
        });
        this.loading.dismiss();
    };
    InboxPage.prototype.tapJob = function (job) {
        this.loading.present();
        if (job.quotations.length) {
            this.router.navigate(['/tabs/quotation'], {
                queryParams: {
                    job: JSON.stringify(job)
                },
            });
        }
        else {
            // this.alertService.presentToast("Service not active");
        }
        this.loading.dismiss();
    };
    InboxPage.prototype.logout = function () {
        this.loading.present();
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
        this.loading.dismiss();
    };
    InboxPage = tslib_1.__decorate([
        Component({
            selector: 'app-inbox',
            templateUrl: './inbox.page.html',
            styleUrls: ['./inbox.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient,
            MenuController,
            AuthService,
            NavController,
            Storage,
            AlertService,
            LoadingService,
            GetService,
            Router,
            EnvService])
    ], InboxPage);
    return InboxPage;
}());
export { InboxPage };
//# sourceMappingURL=inbox.page.js.map