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

@Component({
  selector: 'app-hero',
  templateUrl: './hero.page.html',
  styleUrls: ['./hero.page.scss'],
})
export class HeroPage implements OnInit {
  user: User;  
  profile: Profile;	
  heroes:any;
  job_id:any;
  title:any;
  payper:any;
  amount:any;
  
  constructor(
  	private menu: MenuController, 
  	private authService: AuthService,
  	private navCtrl: NavController,
    private storage: Storage,
    private alertService: AlertService,
    public router : Router,
    public activatedRoute : ActivatedRoute,
    private http: HttpClient,
    private env: EnvService
  ) {
  	this.menu.enable(true);	
  }

  ngOnInit() {
  }

  ionViewWillEnter() {

    this.storage.get('customer').then((val) => {
      this.user = val.data;
      this.profile = val.data.profile;
    });

    this.activatedRoute.queryParams.subscribe((res)=>{
        this.title = res.title;
        this.payper = res.payper*1;
        this.heroes = JSON.parse(res.heroes);
        this.job_id = JSON.parse(res.job_id);
    });

  }

  tapHero(hero) {
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
  }

  tapBack() {
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
