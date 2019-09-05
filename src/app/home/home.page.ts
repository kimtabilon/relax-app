import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Profile } from 'src/app/models/profile';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GetService } from 'src/app/services/get.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/services/env.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user:any = {
    email: '',
    password: '',
    status: ''
  };  
  profile:any = {
    first_name: '',
    middle_name: '',
    last_name: '',
    birthday: '',
    gender: '',
    photo: ''
  };  
  photo:any = '';	
  categories:any = [];
  title:any = 'Please wait...';

  constructor(
  	private menu: MenuController, 
  	private authService: AuthService,
  	private navCtrl: NavController,
    private storage: Storage,
    private alertService: AlertService,
    public loading: LoadingService,
    public getService: GetService,
    public router : Router,
    private http: HttpClient,
    private env: EnvService
  ) { 
  	this.menu.enable(true);	
  }

  ngOnInit() {
  }

  doRefresh(event) {
    this.ionViewWillEnter();    
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  ionViewWillEnter() {
    this.loading.present(); 

    this.http.post(this.env.HERO_API + 'check/server',{}).subscribe(data => { },error => { this.alertService.presentToast("Server not found. Check your internet connection."); });
    this.http.post(this.env.API_URL + 'check/server',{}).subscribe(data => { },error => { this.alertService.presentToast("Server not found. Check your internet connection."); });  

    
    this.storage.get('customer').then((val) => {
      // console.log(val.data);
      this.user = val.data;
      this.profile = val.data.profile;

      this.http.post(this.env.HERO_API + 'customer/login',{email: this.user.email, password:  this.user.password})
      .subscribe(data => {
          let response:any = data;
          this.storage.set('customer', response);
          this.user = response.data;
      },error => { 
        this.logout();
        console.log(error); 
      });

      if(this.profile.photo!==null) {
        this.photo = this.env.IMAGE_URL + 'uploads/' + this.profile.photo;
      } else {
        this.photo = this.env.DEFAULT_IMG;
      }
      this.authService.validateApp(this.user.email,this.user.password);
    });

    this.http.post(this.env.HERO_API + 'categories/all',{key: this.env.APP_ID})
      .subscribe(data => {
          let response:any = data;
          if(response !== null) {
            this.categories = response.data;
            this.title = "Services"; 
            if(this.categories.length == 1) {
              this.router.navigate(['/tabs/service'],{
                queryParams: {
                    category_id : this.categories[0].id
                },
              });
            }
          }

          this.loading.dismiss();
            
      },error => {
        console.log(error);
        this.loading.dismiss();
      });
  }

  tapCategory(category) {
    this.loading.present(); 
    if(category.services.length) {
      this.router.navigate(['/tabs/service'],{
        queryParams: {
            category_id : category.id
        },
      });
    } else {
      this.alertService.presentToast("No Service Available");
    }
    this.loading.dismiss();  
  }

  logout() {
    this.loading.present(); 
    this.authService.logout();
    this.alertService.presentToast('Successfully logout');  
    this.navCtrl.navigateRoot('/login');  
    this.loading.dismiss();
  }

}
