import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { EnvService } from 'src/app/services/env.service';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
var JobviewPage = /** @class */ (function () {
    function JobviewPage(menu, authService, navCtrl, storage, alertService, router, activatedRoute, loading, http, env) {
        this.menu = menu;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.alertService = alertService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.loading = loading;
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
        this.heroExist = false;
        this.formExist = false;
        this.enableCancel = false;
        this.status = '';
        this.photo = '';
        this.customer_info = [];
        this.menu.enable(true);
    }
    JobviewPage.prototype.ngOnInit = function () {
    };
    JobviewPage.prototype.doRefresh = function (event) {
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
            _this.attributes = JSON.parse(_this.job.form_value);
            _this.status = _this.job.status;
            if (_this.job.form !== null) {
                _this.form = _this.job.form;
                _this.formExist = true;
            }
            else {
                _this.formExist = false;
            }
            if (_this.job.hero !== null) {
                _this.hero = _this.job.hero;
                _this.heroExist = true;
            }
            else {
                _this.heroExist = false;
            }
            if (_this.job.status == 'Pending' || _this.job.status == 'Completed') {
                _this.enableCancel = false;
            }
            else {
                _this.enableCancel = true;
            }
        });
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    JobviewPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        // this.loading.present();
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
            _this.attributes = JSON.parse(_this.job.form_value);
            _this.customer_info = JSON.parse(_this.job.customer_info);
            _this.status = _this.job.status;
            if (_this.job.form !== null) {
                _this.form = _this.job.form;
                _this.formExist = true;
            }
            else {
                _this.formExist = false;
            }
            if (_this.job.hero !== null) {
                _this.hero = _this.job.hero;
                _this.heroExist = true;
            }
            else {
                _this.heroExist = false;
            }
            if (_this.job.status == 'Pending' || _this.job.status == 'Completed') {
                _this.enableCancel = false;
            }
            else {
                _this.enableCancel = true;
            }
        });
        // this.loading.dismiss();
    };
    JobviewPage.prototype.tapBack = function () {
        this.loading.present();
        this.router.navigate(['/tabs/job'], {
            queryParams: {},
        });
        this.loading.dismiss();
    };
    JobviewPage.prototype.tapCancel = function () {
        var _this = this;
        this.loading.present();
        /*Cancel Jobs*/
        this.http.post(this.env.HERO_API + 'jobs/cancel', { id: this.job.id })
            .subscribe(function (data) {
        }, function (error) {
            _this.alertService.presentToast("Server no response");
        }, function () { _this.navCtrl.navigateRoot('/tabs/job'); });
        this.loading.dismiss();
    };
    JobviewPage.prototype.logout = function () {
        this.loading.present();
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
        this.loading.dismiss();
    };
    JobviewPage = tslib_1.__decorate([
        Component({
            selector: 'app-jobview',
            templateUrl: './jobview.page.html',
            styleUrls: ['./jobview.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController,
            AuthService,
            NavController,
            Storage,
            AlertService,
            Router,
            ActivatedRoute,
            LoadingService,
            HttpClient,
            EnvService])
    ], JobviewPage);
    return JobviewPage;
}());
export { JobviewPage };
//# sourceMappingURL=jobview.page.js.map