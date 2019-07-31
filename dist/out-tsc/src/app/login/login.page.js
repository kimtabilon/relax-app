import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
var LoginPage = /** @class */ (function () {
    function LoginPage(modalController, authService, navCtrl, alertService, storage, loading) {
        this.modalController = modalController;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.alertService = alertService;
        this.storage = storage;
        this.loading = loading;
    }
    LoginPage.prototype.ngOnInit = function () {
    };
    LoginPage.prototype.login = function (form) {
        var _this = this;
        this.loading.present();
        if (form.value.email != '' && form.value.password != '') {
            this.authService.login(form.value.email, form.value.password).subscribe(function (data) {
                // console.log(data);
                _this.loading.dismiss();
                _this.storage.set('customer', data);
                _this.alertService.presentToast("Logged In");
            }, function (error) {
                console.log(error);
                _this.loading.dismiss();
                _this.alertService.presentToast("Wrong Email or Password");
                // this.alertService.presentToast(error.message);
            }, function () {
                _this.navCtrl.navigateRoot('/tabs/home');
            });
        }
        else {
            this.loading.dismiss();
            this.alertService.presentToast("Empty Email or Password");
        }
    };
    LoginPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.authService.getToken().then(function () {
            if (_this.authService.isLoggedIn) {
                _this.navCtrl.navigateRoot('/tabs/home');
            }
        });
    };
    LoginPage = tslib_1.__decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.page.html',
            styleUrls: ['./login.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController,
            AuthService,
            NavController,
            AlertService,
            Storage,
            LoadingService])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.page.js.map