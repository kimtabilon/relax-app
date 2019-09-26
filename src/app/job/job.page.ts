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
  selector: 'app-job',
  templateUrl: './job.page.html',
  styleUrls: ['./job.page.scss'],
})
export class JobPage implements OnInit {

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
  jobs:any = [];
  jobpage:any = true;
  myjobstitle:any = 'Please wait..';
  completedtitle:any = 'Completed';
  photo:any = '';

  constructor(
    private http: HttpClient,
  	private menu: MenuController, 
  	private authService: AuthService,
  	private navCtrl: NavController,
    private storage: Storage,
    private alertService: AlertService,
    public loading: LoadingService,
    public getService: GetService,
    public router : Router,
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

    this.jobpage = true;

    this.storage.get('customer').then((val) => {
      this.user = val.data;
      this.profile = val.data.profile;  

      if(this.profile.photo!==null) {
        this.photo = this.env.IMAGE_URL + 'uploads/' + this.profile.photo;
      } else {
        this.photo = this.env.DEFAULT_IMG;
      }  

      /*Get My Jobs*/
      this.http.post(this.env.HERO_API + 'customer/jobs',{customer_id: this.user.id, app_key: this.env.APP_ID})
        .subscribe(data => {
            let response:any = data;
            if(response !== null) {
              this.jobs = response.data;
            } else {
              this.jobs = [];
            }
            this.myjobstitle = 'My Jobs';
            this.loading.dismiss();
        },error => { 
          this.myjobstitle = 'My Jobs'; 
          this.loading.dismiss();
          console.log(error);
        });

    });
  }

  tapJob(job) { 
    this.loading.present();
    this.router.navigate(['/tabs/jobview'],{
        queryParams: {
            job_id : job.id
        },
      });
    this.loading.dismiss();
      
  }

  tapCompleted() {
    this.loading.present();
    this.jobpage = false;
    this.completedtitle = 'Please wait...'
    /*Get My Jobs*/
    this.http.post(this.env.HERO_API + 'customer/jobcompleted',{customer_id: this.user.id, app_key: this.env.APP_ID})
      .subscribe(data => {
          let response:any = data;
          if(response !== null) {
            this.jobs = response.data;
          } else {
            this.jobs = [];
          }
          this.completedtitle = 'Completed';
      },error => { this.completedtitle = 'Completed'; });
    this.loading.dismiss();  
  } 

  tapMyJobs() {
    this.loading.present();
    this.jobpage = true;
    this.myjobstitle = 'Please wait...';
    /*Get My Jobs*/
    this.http.post(this.env.HERO_API + 'customer/jobs',{customer_id: this.user.id, app_key: this.env.APP_ID})
      .subscribe(data => {
          let response:any = data;
          if(response !== null) {
            this.jobs = response.data;
          } else {
            this.jobs = [];
          }
          this.myjobstitle = 'My Jobs';
      },error => { this.myjobstitle = 'My Jobs'; });
    this.loading.dismiss();
  } 

  logout() {
    this.loading.present();
    this.authService.logout();
    this.navCtrl.navigateRoot('/login');  
    this.loading.dismiss();
  }

}
