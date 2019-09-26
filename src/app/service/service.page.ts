import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { EnvService } from 'src/app/services/env.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {

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
  category:any = [];
  category_id:any;
  services:any = [];
  title:any = 'Please wait...';
  photo:any = '';

  constructor(
  	private menu: MenuController, 
  	private authService: AuthService,
  	private navCtrl: NavController,
    private storage: Storage,
    private alertService: AlertService,
    public loading: LoadingService,
    public router : Router,
    private env: EnvService,
    private http: HttpClient,
    public activatedRoute : ActivatedRoute
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
    
    this.storage.get('customer').then((val) => {
      this.user = val.data;
      this.profile = val.data.profile;

      if(this.profile.photo!==null) {
        this.photo = this.env.IMAGE_URL + 'uploads/' + this.profile.photo;
      } else {
        this.photo = this.env.DEFAULT_IMG;
      }
    });

    this.activatedRoute.queryParams.subscribe((res)=>{
      this.category_id = res.category_id;

      this.http.post(this.env.HERO_API + 'categories/byID',{app_key: this.env.APP_ID, id: this.category_id })
        .subscribe(data => {
          let response:any = data;
          if(response !== null) {
            this.category = response.data;
            this.services = this.category.services;
            this.title = this.category.name;  
          }
          
        },error => { console.log(error);  
      });
    });

    this.loading.dismiss();
  }

  tapService(service) {
    // console.log(this.services);
    if(service.options.length) {
      this.router.navigate(['/tabs/option'],{
        queryParams: {
            service_id : service.id,
            category_id : this.category_id
        },
      });
    } else {
      // this.alertService.presentToast("No Service or Heroes Available");
    }  
  }

  tapBack() {
    // console.log(service);
    this.services = [];
    this.router.navigate(['/tabs/home'],{
      queryParams: {},
    });
  }

  logout() {
    this.authService.logout();
    this.alertService.presentToast('Successfully logout');  
    this.navCtrl.navigateRoot('/login');  
  }

}
