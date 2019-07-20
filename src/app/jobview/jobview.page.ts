import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Profile } from 'src/app/models/profile';
import { AlertService } from 'src/app/services/alert.service';
import { EnvService } from 'src/app/services/env.service';
import { Storage } from '@ionic/storage';
import { LoadingService } from 'src/app/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-jobview',
  templateUrl: './jobview.page.html',
  styleUrls: ['./jobview.page.scss'],
})
export class JobviewPage implements OnInit {

  user: User;  
  profile: Profile;	
  job:any;
  hero:any;
  heroExist:any = false;
  attributes:any;
  form:any;
  formExist:any = false;
  enableCancel:any = false;
  status:any = '';

  constructor(
  	private menu: MenuController, 
  	private authService: AuthService,
  	private navCtrl: NavController,
    private storage: Storage,
    private alertService: AlertService,
    public router : Router,
    public activatedRoute : ActivatedRoute,
    public loading: LoadingService,
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
      this.job = JSON.parse(res.job);
      this.attributes = JSON.parse(this.job.form_value);
      this.status = this.job.status;

      if(this.job.form !== null) {
        this.form = this.job.form;
        this.formExist = true;
      }else{
        this.formExist = false;
      }

      if(this.job.hero !== null) {
        this.hero = this.job.hero;
        this.heroExist = true;
      } else {
        this.heroExist = false;
      }

      if(this.job.status == 'Pending' || this.job.status == 'Completed') {
        this.enableCancel = false;
      } else {
        this.enableCancel = true;
      }
    });

    this.loading.dismiss();

  }

  tapBack() {
    this.loading.present();
    this.router.navigate(['/tabs/job'],{
      queryParams: {},
    }); 
    this.loading.dismiss();  
  }

  tapCancel() {
    this.loading.present();

    /*Cancel Jobs*/
    this.http.post(this.env.HERO_API + 'jobs/cancel',{id: this.job.id})
      .subscribe(data => {
      },error => { this.alertService.presentToast("Server no response");
    },() => { this.navCtrl.navigateRoot('/tabs/job'); });  

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
