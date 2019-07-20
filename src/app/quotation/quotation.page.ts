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
  selector: 'app-quotation',
  templateUrl: './quotation.page.html',
  styleUrls: ['./quotation.page.scss'],
})
export class QuotationPage implements OnInit {
  user: User;  
  profile: Profile;	
  title:any;
  job:any;
  quotations:any;
  
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
        this.job = JSON.parse(res.job);
        this.quotations = this.job.quotations;
        this.title = this.job.form.option.name;
    });

  }

  tapHero(quote) {
    this.http.post(this.env.HERO_API + 'jobs/modify',
      {job_id: this.job.id, hero_id: quote.hero.id, amount: quote.amount}
    ).subscribe(
        data => {
          // this.job = data;
        },
        error => {
          this.alertService.presentToast("Server not responding!"); 
        },
        () => {
          // this.alertService.presentToast("Please wait for confirmation!"); 
          this.router.navigate(['/tabs/job'],{
            queryParams: {},
          });
        }
      );
  }

  tapBack() {
    this.router.navigate(['/tabs/inbox'],{
      queryParams: {},
    });   
  }

  logout() {
    this.authService.logout();
    this.alertService.presentToast('Successfully logout');  
    this.navCtrl.navigateRoot('/login');  
  }

}
