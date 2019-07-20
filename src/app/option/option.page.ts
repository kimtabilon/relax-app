import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Profile } from 'src/app/models/profile';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-option',
  templateUrl: './option.page.html',
  styleUrls: ['./option.page.scss'],
})
export class OptionPage implements OnInit {
  user: User;  
  profile: Profile;	
  options:any;
  title:any;
  backTitle:any;
  service:any;
  services:any;
  heroes:any;
  payType:any;
  
  constructor(
  	private menu: MenuController, 
  	private authService: AuthService,
  	private navCtrl: NavController,
    private storage: Storage,
    private alertService: AlertService,
    public router : Router,
    public activatedRoute : ActivatedRoute
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
        this.service = JSON.parse(res.service);
        this.heroes = this.service.heroes;
        this.payType = this.service.pay_type;
        this.options = this.service.options;
        this.title = this.service.name;
        this.services = JSON.parse(res.services);
        this.backTitle = res.backTitle;
    });

  }

  tapOption(option) {
    // console.log(service);
    
    if(option.form !== null) {
      this.router.navigate(['/tabs/form'],{
        queryParams: {
            option : JSON.stringify(option),
            heroes : JSON.stringify(this.heroes),
            payType: this.payType
        },
      });
    } else {
      // this.alertService.presentToast("No Form Available");
    }   
  }

  tapBack() {
    this.router.navigate(['/tabs/service'],{
      queryParams: {
          value : JSON.stringify({
            services : this.services,
            name: this.backTitle
          })
      },
    });   
  }

  logout() {
    this.authService.logout();
    this.alertService.presentToast('Successfully logout');  
    this.navCtrl.navigateRoot('/login');  
  }

}
