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
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

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

  customer_info:any = {
    name: '',
    address: '',
    contact: ''
  }

  schedule_date:any = '';
  schedule_time:any = '';

  form:any = [];
  title:any = 'Please wait...';
  quote_enable:any;
  attributes:any = [];
  heroes:any = [];
  job:any = [];
  payType:any;
  payper:any = 1;
  option:any = [];
  photo:any = '';

  option_id:any;
  service_id:any;
  category_id:any;

  current_date:any = '';
  next_year:any = '';

  constructor(
    private menu: MenuController, 
    private authService: AuthService,
    private navCtrl: NavController,
    private storage: Storage,
    private alertService: AlertService,
    public router : Router,
    public loading: LoadingService,
    public activatedRoute : ActivatedRoute,
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
    this.schedule_date = '';
    this.schedule_time = '';
    let curday = function(sp){
      let today:any = new Date();
      let dd:any = today.getDate();
      let mm:any = today.getMonth()+1; //As January is 0.
      let yyyy:any = today.getFullYear();

      if(dd<10) dd='0'+dd;
      if(mm<10) mm='0'+mm;
      return (yyyy+sp+mm+sp+dd);
    };

    let nextYear = function(sp){
      let today:any = new Date();
      let dd:any = today.getDate();
      let mm:any = today.getMonth()+1; //As January is 0.
      let yyyy:any = today.getFullYear()+1;

      if(dd<10) dd='0'+dd;
      if(mm<10) mm='0'+mm;
      return (yyyy+sp+mm+sp+dd);
    };
    this.current_date = curday('-');
    this.next_year = nextYear('-');

    this.storage.get('customer').then((val) => {
      this.user = val.data;
      this.profile = val.data.profile;

      if(this.profile.photo!==null) {
        this.photo = this.env.IMAGE_URL + 'uploads/' + this.profile.photo;
      } else {
        this.photo = this.env.DEFAULT_IMG;
      }

      let address:any = this.profile.addresses[0];
      let contact:any = this.profile.contacts[0];
      let profile:any = this.profile;
      let customer_address:any = '';
      let customer_contact:any = '';
      let customer_name:any = '';

      if(address.street) { customer_address += address.street + ', '; }
      if(address.city) { customer_address += address.city + ', '; }
      if(address.province) { customer_address += address.province + ', '; }
      if(address.country) { customer_address += address.country + ' '; }
      if(address.zip) { customer_address += address.zip; }

      if(contact.dial_code) { customer_contact += contact.dial_code + ' '; }
      if(contact.number) { customer_contact += contact.number; }

      if(profile.first_name) { customer_name += profile.first_name + ' '; }
      if(profile.middle_name) { customer_name += profile.middle_name + ' '; }
      if(profile.last_name) { customer_name += profile.last_name; }

      this.customer_info = {
        name: customer_name,
        address: customer_address,
        contact: customer_contact
      }

    });

    this.activatedRoute.queryParams.subscribe((res)=>{
      this.option_id = res.option_id;
      this.service_id = res.service_id;
      this.category_id = res.category_id;
      this.payType = res.payType;

      this.http.post(this.env.HERO_API + 'options/byID',{app_key: this.env.APP_ID, id: this.option_id })
        .subscribe(data => {
          let response:any = data;
          if(response!==null) {
            this.option = response.data;
            this.form = this.option.form;
            this.title = this.option.name;
            this.quote_enable = this.option.enable_quote;
            this.attributes = JSON.parse(this.form.attributes);  
          }
          
        },error => { console.log(error);  
      });
    });

    this.loading.dismiss();

  }

  tapBack() {
    this.router.navigate(['/tabs/option'],{
      queryParams: {
        category_id : this.category_id,
        service_id : this.service_id
      },
    });   
  }

  tapNext() {
    this.loading.present();
    if(this.schedule_date != '' && this.schedule_time!='') {
      this.http.post(this.env.HERO_API + 'services/heroes',{app_key: this.env.APP_ID, id: this.service_id, schedule_date: this.schedule_date })
        .subscribe(data => {
          let response:any = data;
          this.heroes = response.data.heroes;
          if(this.heroes.length) {
             this.http.post(this.env.HERO_API + 'jobs/create',
                { app_key: this.env.APP_ID, 
                  customer_id: this.user.id, 
                  form_id: this.form.id, 
                  form_value: JSON.stringify(this.attributes), 
                  customer_info: JSON.stringify(this.customer_info), 
                  schedule_date: this.schedule_date, 
                  schedule_time: this.schedule_time, 
                  status: 'For Quotation'
                }
              ).subscribe(
                  data => {
                    this.job = data;
                  },
                  error => {
                    console.log(error);
                    this.alertService.presentToast("Server not responding!"); 
                  },
                  () => {
                    if(this.quote_enable=='Yes') {
                      // this.alertService.presentToast("Please wait for quotation!"); 
                      this.router.navigate(['/tabs/summary'],{
                        queryParams: {
                          service : JSON.stringify({ 
                            name: this.title,
                            amount: '0',
                            provider: '',
                            status: 'For Quotation'
                          })
                        },
                      });
                    } else {
                      if(this.payper == null) {
                        this.payper = 1;
                      }
                      this.router.navigate(['/tabs/hero'],{
                        queryParams: {
                            job_id : this.job.data.id,
                            category_id : this.category_id,
                            service_id : this.service_id,
                            option_id : this.option_id,
                            form_id : this.form.id,
                            payper : this.payper,
                            schedule_date: this.schedule_date
                        },
                      });
                    }
                  }
                );
          } else {
            this.alertService.presentToast("No heroes found. Change schedule date."); 
          }
        },error => { 
          console.log(error);  
      });
    } else {
      this.alertService.presentToast("Required Schedule Date & Time."); 
    }
    
    this.loading.dismiss();
  }

  logout() {
    this.authService.logout();
    this.alertService.presentToast('Successfully logout');  
    this.navCtrl.navigateRoot('/login');  
  }

}
