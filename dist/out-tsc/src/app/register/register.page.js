import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
var RegisterPage = /** @class */ (function () {
    function RegisterPage(modalController, authService, navCtrl, alertService, loading, storage) {
        this.modalController = modalController;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.alertService = alertService;
        this.loading = loading;
        this.storage = storage;
    }
    RegisterPage.prototype.ngOnInit = function () {
    };
    RegisterPage.prototype.register = function (form) {
        var _this = this;
        this.loading.present();
        this.authService.register(form.value.first_name, form.value.middle_name, form.value.last_name, form.value.street, form.value.city, form.value.province, form.value.country, form.value.zip, form.value.birthmonth, form.value.birthday, form.value.birthyear, form.value.phone_number, form.value.email, form.value.password, form.value.password_confirm).subscribe(function (data) {
            // console.log(data);
            _this.authService.login(form.value.email, form.value.password).subscribe(function (data) {
                console.log(data);
                _this.storage.set('customer', data);
            }, function (error) {
                _this.alertService.presentToast(error.message);
                console.log(error);
            }, function () {
                _this.navCtrl.navigateRoot('/tabs/home');
            });
            _this.alertService.presentToast('You are now registered!');
        }, function (error) {
            _this.alertService.presentToast(error.message);
            console.log(error);
        }, function () {
        });
        this.loading.dismiss();
    };
    RegisterPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.authService.getToken().then(function () {
            if (_this.authService.isLoggedIn) {
                _this.navCtrl.navigateRoot('/tabs/home');
            }
        });
    };
    RegisterPage = tslib_1.__decorate([
        Component({
            selector: 'app-register',
            templateUrl: './register.page.html',
            styleUrls: ['./register.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController,
            AuthService,
            NavController,
            AlertService,
            LoadingService,
            Storage])
    ], RegisterPage);
    return RegisterPage;
}());
export { RegisterPage };
//# sourceMappingURL=register.page.js.map