import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  API_URL = 'http://relaxserviceprovider.herokuapp.com/api/';	
  // API_URL = 'http://127.0.0.1:8000/api/';	

  IMAGE_URL = 'http://www.mjsitechsolutions.com/heroimages/';	
  DEFAULT_IMG = '../../assets/img/blank-profile.png';
  
  HERO_ADMIN = 'http://relaxserviceprovider.herokuapp.com/';
  HERO_API = 'http://relaxserviceprovider.herokuapp.com/api/';	
  
  // HERO_ADMIN = 'http://127.0.0.1:8000/';	
  // HERO_API = 'http://127.0.0.1:8000/api/';  
  
  APP_ID = 'relaxretffgsfdgh=';

  constructor() {
  }

  
}
