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
var FormPage = /** @class */ (function () {
    function FormPage(menu, authService, navCtrl, storage, alertService, router, loading, activatedRoute, http, env) {
        this.menu = menu;
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.alertService = alertService;
        this.router = router;
        this.loading = loading;
        this.activatedRoute = activatedRoute;
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
        this.customer_info = {
            name: '',
            address: '',
            contact: ''
        };
        this.schedule_date = '';
        this.schedule_time = '';
        this.form = [];
        this.title = 'Please wait...';
        this.quote_enable = '';
        this.attributes = [];
        this.heroes = [];
        this.job = [];
        this.payType = '';
        this.payper = 1;
        this.option = [];
        this.photo = '';
        this.option_id = '';
        this.service_id = '';
        this.category_id = '';
        this.current_date = '';
        this.next_year = '';
        this.menu.enable(true);
    }
    FormPage.prototype.ngOnInit = function () {
    };
    FormPage.prototype.doRefresh = function (event) {
        setTimeout(function () {
            event.target.complete();
        }, 2000);
    };
    FormPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.loading.present();
        this.schedule_date = '';
        this.schedule_time = '';
        var curday = function (sp) {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //As January is 0.
            var yyyy = today.getFullYear();
            if (dd < 10)
                dd = '0' + dd;
            if (mm < 10)
                mm = '0' + mm;
            return (yyyy + sp + mm + sp + dd);
        };
        var nextYear = function (sp) {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //As January is 0.
            var yyyy = today.getFullYear() + 1;
            if (dd < 10)
                dd = '0' + dd;
            if (mm < 10)
                mm = '0' + mm;
            return (yyyy + sp + mm + sp + dd);
        };
        this.current_date = curday('-');
        this.next_year = nextYear('-');
        this.storage.get('customer').then(function (val) {
            _this.user = val.data;
            _this.profile = val.data.profile;
            if (_this.profile.photo !== null) {
                _this.photo = _this.env.IMAGE_URL + 'uploads/' + _this.profile.photo;
            }
            else {
                _this.photo = _this.env.DEFAULT_IMG;
            }
            var address = _this.profile.addresses[0];
            var contact = _this.profile.contacts[0];
            var profile = _this.profile;
            var customer_address = '';
            var customer_contact = '';
            var customer_name = '';
            if (address.street) {
                customer_address += address.street + ', ';
            }
            if (address.city) {
                customer_address += address.city + ', ';
            }
            if (address.province) {
                customer_address += address.province + ', ';
            }
            if (address.country) {
                customer_address += address.country + ' ';
            }
            if (address.zip) {
                customer_address += address.zip;
            }
            if (contact.dial_code) {
                customer_contact += contact.dial_code + ' ';
            }
            if (contact.number) {
                customer_contact += contact.number;
            }
            if (profile.first_name) {
                customer_name += profile.first_name + ' ';
            }
            if (profile.middle_name) {
                customer_name += profile.middle_name + ' ';
            }
            if (profile.last_name) {
                customer_name += profile.last_name;
            }
            _this.customer_info = {
                name: customer_name,
                address: customer_address,
                contact: customer_contact
            };
        });
        this.activatedRoute.queryParams.subscribe(function (res) {
            _this.option_id = res.option_id;
            _this.service_id = res.service_id;
            _this.category_id = res.category_id;
            _this.payType = res.payType;
            _this.http.post(_this.env.HERO_API + 'options/byID', { app_key: _this.env.APP_ID, id: _this.option_id })
                .subscribe(function (data) {
                var response = data;
                if (response !== null) {
                    _this.option = response.data;
                    _this.form = _this.option.form;
                    _this.title = _this.option.name;
                    _this.quote_enable = _this.option.enable_quote;
                    _this.attributes = JSON.parse(_this.form.attributes);
                }
            }, function (error) {
                console.log(error);
            });
        });
        this.loading.dismiss();
    };
    FormPage.prototype.tapBack = function () {
        this.router.navigate(['/tabs/option'], {
            queryParams: {
                category_id: this.category_id,
                service_id: this.service_id
            },
        });
    };
    FormPage.prototype.tapNext = function () {
        var _this = this;
        this.loading.present();
        if (this.schedule_date !== '' && this.schedule_time !== '') {
            this.http.post(this.env.HERO_API + 'services/heroes', { app_key: this.env.APP_ID, id: this.service_id, schedule_date: this.schedule_date })
                .subscribe(function (data) {
                var response = data;
                if (response !== null && response.data.heroes.length) {
                    _this.http.post(_this.env.HERO_API + 'jobs/create', { app_key: _this.env.APP_ID,
                        customer_id: _this.user.id,
                        form_id: _this.form.id,
                        form_value: JSON.stringify(_this.attributes),
                        customer_info: JSON.stringify(_this.customer_info),
                        schedule_date: _this.schedule_date,
                        schedule_time: _this.schedule_time,
                        status: 'For Quotation'
                    }).subscribe(function (data) {
                        _this.job = data;
                    }, function (error) {
                        console.log(error);
                        _this.alertService.presentToast("Schedule date and time required.");
                    }, function () {
                        if (_this.quote_enable == 'Yes') {
                            // this.alertService.presentToast("Please wait for quotation!"); 
                            _this.router.navigate(['/tabs/summary'], {
                                queryParams: {
                                    service: JSON.stringify({
                                        name: _this.title,
                                        amount: '0',
                                        provider: '',
                                        status: 'For Quotation'
                                    })
                                },
                            });
                        }
                        else {
                            if (_this.payper == null) {
                                _this.payper = 1;
                            }
                            _this.router.navigate(['/tabs/hero'], {
                                queryParams: {
                                    job_id: _this.job.data.id,
                                    category_id: _this.category_id,
                                    service_id: _this.service_id,
                                    option_id: _this.option_id,
                                    form_id: _this.form.id,
                                    payper: _this.payper,
                                    schedule_date: _this.schedule_date
                                },
                            });
                        }
                    });
                }
                else {
                    _this.alertService.presentToast("No available heroes. Change schedule date.");
                }
            }, function (error) {
                _this.alertService.presentToast("No available heroes. Change schedule date.");
                console.log(error);
            });
        }
        else {
            this.alertService.presentToast("Schedule date and time required.");
        }
        this.loading.dismiss();
    };
    FormPage.prototype.logout = function () {
        this.authService.logout();
        this.alertService.presentToast('Successfully logout');
        this.navCtrl.navigateRoot('/login');
    };
    FormPage = tslib_1.__decorate([
        Component({
            selector: 'app-form',
            templateUrl: './form.page.html',
            styleUrls: ['./form.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController,
            AuthService,
            NavController,
            Storage,
            AlertService,
            Router,
            LoadingService,
            ActivatedRoute,
            HttpClient,
            EnvService])
    ], FormPage);
    return FormPage;
}());
export { FormPage };
//# sourceMappingURL=form.page.js.map