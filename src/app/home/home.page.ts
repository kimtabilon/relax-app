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

  user: User;  
  profile: Profile;	
  categories:any;

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

  ionViewWillEnter() {
    this.loading.present(); 

    this.authService.validateApp();
    
    this.storage.get('customer').then((val) => {
      // console.log(val.data);
      this.user = val.data;
      this.profile = val.data.profile;
    });

    this.getService.all();


    this.http.post(this.env.HERO_API + 'categories/all',{key: this.env.APP_ID})
      .subscribe(data => {
          this.categories = data;
          this.categories = this.categories.data;
          // console.log(this.categories);
      },error => {  });
    this.loading.dismiss();
  }

  tapCategory(category) {
    // console.log(category.services);
    if(category.services.length) {
      this.router.navigate(['/tabs/service'],{
        queryParams: {
            value : JSON.stringify(category)
        },
      });
    } else {
      this.alertService.presentToast("No Service Available");
    }
      
  }

  logout() {
    this.authService.logout();
    this.alertService.presentToast('Successfully logout');  
    this.navCtrl.navigateRoot('/login');  
  }

}
