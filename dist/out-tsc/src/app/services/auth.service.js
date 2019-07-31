import * as tslib_1 from "tslib";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { EnvService } from './env.service';
import { AlertService } from './alert.service';
var AuthService = /** @class */ (function () {
    function AuthService(http, storage, env, navCtrl, alertService) {
        this.http = http;
        this.storage = storage;
        this.env = env;
        this.navCtrl = navCtrl;
        this.alertService = alertService;
        this.isLoggedIn = false;
        this.customerId = '';
    }
    AuthService.prototype.validateApp = function () {
        var _this = this;
        this.http.post(this.env.HERO_API + 'app/validate', { key: this.env.APP_ID }).subscribe(function (data) {
            // this.storage.set('customer', data)
            // 
        }, function (error) {
            _this.alertService.presentToast("Invalid App Key");
            _this.logout();
            _this.navCtrl.navigateRoot('/login');
        }, function () {
            // this.navCtrl.navigateRoot('/tabs/service');
        });
    };
    AuthService.prototype.login = function (email, password) {
        var _this = this;
        return this.http.post(this.env.API_URL + 'customer/login', { email: email, password: password }).pipe(tap(function (token) {
            _this.storage.set('token', token)
                .then(function () {
                console.log('Token Stored');
            }, function (error) { return console.error('Error storing item', error); });
            _this.token = token;
            _this.isLoggedIn = true;
            return token;
        }));
        /*return this.http.get(this.env.API_URL + 'customers/1').subscribe((response) => {
            console.log(response);
        });*/
    };
    AuthService.prototype.register = function (first_name, middle_name, last_name, street, city, province, country, zip, birthmonth, birthday, birthyear, phone_number, email, password, password_confirm) {
        return this.http.post(this.env.API_URL + 'customer/register', {
            first_name: first_name,
            middle_name: middle_name,
            last_name: last_name,
            street: street,
            city: city,
            province: province,
            country: country,
            zip: zip,
            birthmonth: birthmonth,
            birthday: birthday,
            birthyear: birthyear,
            phone_number: phone_number,
            email: email,
            password: password,
            password_confirm: password_confirm
        });
    };
    AuthService.prototype.logout = function () {
        // const headers = new HttpHeaders({
        //   'Authorization': this.token["token_type"]+" "+this.token["access_token"]
        // });
        // return this.http.get(this.env.API_URL + 'customers/1', { headers: headers })
        // .pipe(
        //   tap(data => {
        //     this.storage.remove("token");
        //     this.isLoggedIn = false;
        //     delete this.token;
        //     return data;
        //   })
        // )
        this.storage.remove("token");
        this.storage.remove("customer");
        this.isLoggedIn = false;
        delete this.token;
        return '';
    };
    AuthService.prototype.user = function () {
        var headers = new HttpHeaders({
            'Authorization': this.token["token_type"] + " " + this.token["access_token"]
        });
        return this.http.get(this.env.API_URL + 'customers/1', { headers: headers })
            .pipe(tap(function (user) {
            return user;
        }));
    };
    AuthService.prototype.getToken = function () {
        var _this = this;
        return this.storage.get('token').then(function (data) {
            _this.token = data;
            if (_this.token != null) {
                _this.isLoggedIn = true;
            }
            else {
                _this.isLoggedIn = false;
            }
        }, function (error) {
            _this.token = null;
            _this.isLoggedIn = false;
        });
    };
    AuthService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient,
            Storage,
            EnvService,
            NavController,
            AlertService])
    ], AuthService);
    return AuthService;
}());
export { AuthService };
//# sourceMappingURL=auth.service.js.map