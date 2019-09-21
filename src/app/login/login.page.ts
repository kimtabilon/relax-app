import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { RegisterPage } from '../register/register.page';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../services/env.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Market } from '@ionic-native/market/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  login_btn:any = 'LOGIN';

  constructor(
  	private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private storage: Storage,
    public loading: LoadingService,
    private http: HttpClient,
    private env: EnvService,
    private appVersion: AppVersion,
    private market: Market,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    
  }

  async alertUpdate(version) {
    const alert = await this.alertController.create({
      header: 'New Update Available',
      message: 'Version '+version,
      buttons: [
        {
          text: 'Update',
          handler: () => {

            this.appVersion.getPackageName().then(value => {
              this.market.open(value);
            }).catch(err => {
              // alert(err);
            });

          }
        }
      ]
    });

    await alert.present();
  }

  login(form: NgForm) {
    this.loading.present();

    if(form.value.email != '' && form.value.password != '') 
    {
      this.login_btn = 'Please wait...';
      this.authService.login(form.value.email, form.value.password).subscribe(
        data => {
          // console.log(data);
          this.loading.dismiss();
          this.storage.set('customer', data)
          // this.alertService.presentToast("Logged In");
          this.login_btn = 'LOGIN';
        },
        error => {
          console.log(error);
          this.loading.dismiss();
          this.alertService.presentToast("Wrong Email/Password or Inactive account.");
          this.login_btn = 'LOGIN';
          // this.alertService.presentToast(error.message);
        },
        () => {
          this.navCtrl.navigateRoot('/tabs/home');
        }
      );
    } else {
      this.loading.dismiss();
      this.alertService.presentToast("Empty Email/Password");
    }
      
  }

  ionViewWillEnter() {
    this.authService.getToken().then(() => {
      if(this.authService.isLoggedIn) {
        this.navCtrl.navigateRoot('/tabs/home');
      }
    });

    this.http.post(this.env.HERO_API + 'app/validate',
      {key: this.env.APP_ID}
    ).subscribe(
        data => {
          let response:any = data;
          let app:any = response.data;

          this.appVersion.getVersionNumber().then(value => {
            if(value != app.build) {
              this.alertUpdate(app.build);
            }
            
          }).catch(err => {
            // alert(err);
          });
           
          this.storage.set('app', response);

        },
        error => {
          this.alertService.presentToast("Invalid App Key"); 
        },
        () => {
          // this.navCtrl.navigateRoot('/tabs/service');
        }
      );
  }

}
