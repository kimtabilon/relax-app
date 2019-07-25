import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  API_URL = 'http://relaxserviceprovider.herokuapp.com/api/';	
  // API_URL = 'http://127.0.0.1:8000/api/';	

  IMAGE_URL = 'http://www.mjsitechsolutions.com/heroimages/';	
  DEFAULT_IMG = 'http://www.mjsitechsolutions.com/heroimages/uploads/1563851119067.jpg';
  
  HERO_API = 'http://heroserviceprovider.herokuapp.com/api/';	
  // HERO_API = 'http://127.0.0.1:8000/api/';	
  
  APP_ID = 'relaxretffgsfdgh=';	
  // APP_ID = 'hero435dsfhjdfgrt=';

  constructor() { }

  
}
