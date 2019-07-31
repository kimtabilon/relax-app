import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
var EnvService = /** @class */ (function () {
    // APP_ID = 'hero435dsfhjdfgrt=';
    function EnvService() {
        // API_URL = 'http://heroserviceprovider.herokuapp.com/api/';	
        this.API_URL = 'http://relaxserviceprovider.herokuapp.com/api/';
        // API_URL = 'http://127.0.0.1:8000/api/';	
        this.IMAGE_URL = 'http://www.mjsitechsolutions.com/heroimages/';
        this.DEFAULT_IMG = 'http://www.mjsitechsolutions.com/heroimages/uploads/1563851119067.jpg';
        this.HERO_API = 'http://heroserviceprovider.herokuapp.com/api/';
        // HERO_API = 'http://127.0.0.1:8000/api/';	
        this.APP_ID = 'relaxretffgsfdgh=';
    }
    EnvService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], EnvService);
    return EnvService;
}());
export { EnvService };
//# sourceMappingURL=env.service.js.map