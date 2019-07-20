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

  user: User;  
  profile: Profile;	
  form:any;
  title:any;
  quote_enable:any;
  attributes:any;
  heroes:any;
  job:any;
  payType:any;
  payper:any = '';
  option:any;

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

  ionViewWillEnter() {
    this.loading.present();

    this.storage.get('customer').then((val) => {
      this.user = val.data;
      this.profile = val.data.profile;
    });

    this.activatedRoute.queryParams.subscribe((res)=>{
        this.heroes = res.heroes;
        this.payType = res.payType;
        this.option = JSON.parse(res.option)
        this.form = this.option.form;
        this.title = this.option.name;
        this.quote_enable = this.option.enable_quote;
        this.attributes = JSON.parse(this.form.attributes);
    });

    this.loading.dismiss();

  }

  tapBack() {
    this.router.navigate(['/tabs/home'],{
      queryParams: {},
    });   
  }

  tapNext() {
    this.loading.present();
    this.http.post(this.env.HERO_API + 'jobs/create',
      { app_key: this.env.APP_ID, customer_id: this.user.id, form_id: this.form.id, form_value: JSON.stringify(this.attributes), status: 'For Quotation'}
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
                  heroes : this.heroes,
                  payper : this.payper,
                  title : this.title
              },
            });
          }
        }
      );
    this.loading.dismiss();
  }

  logout() {
    this.authService.logout();
    this.alertService.presentToast('Successfully logout');  
    this.navCtrl.navigateRoot('/login');  
  }

}
