import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { EnvService } from './env.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isLoggedIn = false;
  token:any;
  customerId = '';

  constructor(
  	private http: HttpClient,
    private storage: Storage,
    private env: EnvService,
    private navCtrl: NavController,
    private alertService: AlertService,
    public alertController: AlertController,
  ) { }

  login(email: String, password: String) {
    return this.http.post(this.env.API_URL + 'customer/login',
      {email: email, password: password}
    ).pipe(
      tap(token => {
        this.storage.set('token', token)
        .then(
          () => {
            // console.log('Token Stored');
          },
          error => console.error('Error storing item', error)
        );
        this.token = token;
        this.isLoggedIn = true;
        return token;
      }),
    );

    /*return this.http.get(this.env.API_URL + 'customers/1').subscribe((response) => {
	    console.log(response);
	});*/
  }

  register(
  		first_name: String, 
  		middle_name: String, 
  		last_name: String, 
  		 
  		street: String, 
      barangay: String, 
      city: String, 
  		province: String, 
  		country: String, 
  		zip: String, 

  		birthmonth: String, 
  		birthday: String, 
  		birthyear: String, 
      gender: String, 
  		
  		phone_number: String, 

  		email: String,
  		password: String, 
  		password_confirm: String
  		) {
    return this.http.post(this.env.API_URL + 'customer/register',
      {
      	first_name: first_name, 
      	middle_name: middle_name, 
      	last_name: last_name, 
      	 
      	street: street, 
      	barangay: barangay, 
        city: city, 
      	province: province, 
      	country: country, 
      	zip: zip, 

      	birthmonth: birthmonth, 
      	birthday: birthday, 
      	birthyear: birthyear, 
        gender: gender, 
      	phone_number: phone_number, 

      	email: email,
      	password: password,
      	password_confirm: password_confirm
      }
    )
  }

  logout() {
    this.storage.remove("token");
    this.storage.remove("customer");
    this.isLoggedIn = false;
    delete this.token;
    return '';
  }

  getToken() {
    return this.storage.get('token').then(
      data => {
        this.token = data;
        if(this.token != null) {
          this.isLoggedIn=true;
        } else {
          this.isLoggedIn=false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn=false;
      }
    );
  }
}
