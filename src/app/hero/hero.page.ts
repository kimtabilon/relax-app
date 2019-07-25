import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Profile } from 'src/app/models/profile';
import { AlertService } from 'src/app/services/alert.service';
import { EnvService } from 'src/app/services/env.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.page.html',
  styleUrls: ['./hero.page.scss'],
})
export class HeroPage implements OnInit {
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

  payper:any;
  amount:any;
  title:any = 'Please wait...';
  heroes:any = [];

  job_id:any;
  form_id:any;
  option_id:any;
  service_id:any;
  category_id:any;
  schedule_date:any;
  
  constructor(
  	private menu: MenuController, 
  	private authService: AuthService,
  	private navCtrl: NavController,
    private storage: Storage,
    private alertService: AlertService,
    public router : Router,
    public activatedRoute : ActivatedRoute,
    private http: HttpClient,
    public loading: LoadingService,
    private env: EnvService
  ) {
  	this.menu.enable(true);	
  }

  ngOnInit() {
  }

  doRefresh(event) {
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
      this.job_id = res.job_id;
      this.form_id = res.form_id;
      this.option_id = res.option_id;
      this.service_id = res.service_id;
      this.category_id = res.category_id;
      this.schedule_date = res.schedule_date;

      this.payper = res.payper*1;

      this.http.post(this.env.HERO_API + 'services/heroes',{app_key: this.env.APP_ID, id: this.service_id, schedule_date: this.schedule_date })
        .subscribe(data => {
          let response:any = data;
          this.heroes = response.data.heroes;
          this.title = response.data.name;
          console.log(data);
        },error => { console.log(error);  
      });
    });
    this.loading.dismiss();
  }

  tapHero(hero) {
    this.loading.present();
    this.amount = (hero.pivot.pay_per*1)*(this.payper);

    this.http.post(this.env.HERO_API + 'jobs/modify',
      {job_id: this.job_id, hero_id: hero.id, amount: this.amount}
    ).subscribe(
        data => {
          // this.job = data;
        },
        error => {
          this.alertService.presentToast("Server not responding!"); 
        },
        () => {
          // this.alertService.presentToast("Please wait for confirmation!"); 
          this.router.navigate(['/tabs/summary'],{
            queryParams: {
              service : JSON.stringify({ 
                name: this.title,
                amount: this.amount,
                provider: hero.profile.first_name + ' ' + hero.profile.last_name,
                status: 'For Confirmation'
              })
            },
          });
        }
      );

    this.loading.dismiss();
  }

  tapBack() {
    this.loading.present();
    this.router.navigate(['/tabs/home'],{
      queryParams: {},
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
