import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Profile } from 'src/app/models/profile';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { EnvService } from 'src/app/services/env.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-option',
  templateUrl: './option.page.html',
  styleUrls: ['./option.page.scss'],
})
export class OptionPage implements OnInit {
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
  options:any;
  title:any = 'Please wait...';
  service:any = [];
  services:any = [];
  heroes:any = [];
  payType:any;
  
  photo:any = '';

  service_id:any;
  category_id:any;
  
  constructor(
  	private menu: MenuController, 
  	private authService: AuthService,
  	private navCtrl: NavController,
    private storage: Storage,
    private alertService: AlertService,
    public router : Router,
    public loading: LoadingService,
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
      this.service_id = res.service_id;
      this.category_id = res.category_id;

      this.http.post(this.env.HERO_API + 'services/byID',{app_key: this.env.APP_ID, id: this.service_id })
        .subscribe(data => {
          this.service = data;
          this.service = this.service.data;
          this.options = this.service.options;
          this.title = this.service.name;
          this.payType = this.service.pay_type;
        },error => { console.log(error);  
      });

    });
    this.loading.dismiss();
  }

  tapOption(option) {
    this.loading.present();
    if(option.form !== null) {
      this.router.navigate(['/tabs/form'],{
        queryParams: {
            option_id : option.id,
            service_id : this.service_id,
            category_id : this.category_id,
            payType: this.payType
        },
      });
    } else {
      // this.alertService.presentToast("No Form Available");
    }   
    this.loading.dismiss();
  }

  tapBack() {
    this.loading.present();
    this.router.navigate(['/tabs/service'],{
      queryParams: {
          category_id : this.category_id
      },
    });  
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
