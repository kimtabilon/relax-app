import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { RegisterPage } from '../register/register.page';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
  	private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private storage: Storage,
    public loading: LoadingService
  ) { }

  ngOnInit() {
  }

  login(form: NgForm) {
    this.loading.present();
    if(form.value.email != '' && form.value.password != '') 
    {
      this.authService.login(form.value.email, form.value.password).subscribe(
        data => {
          // console.log(data);
          this.loading.dismiss();
          this.storage.set('customer', data)
          this.alertService.presentToast("Logged In");
        },
        error => {
          console.log(error);
          this.loading.dismiss();
          this.alertService.presentToast("Wrong Email or Password");
          // this.alertService.presentToast(error.message);
        },
        () => {
          this.navCtrl.navigateRoot('/tabs/home');
        }
      );
    } else {
      this.loading.dismiss();
      this.alertService.presentToast("Empty Email or Password");
    }
      
  }

  ionViewWillEnter() {
    this.authService.getToken().then(() => {
      if(this.authService.isLoggedIn) {
        this.navCtrl.navigateRoot('/tabs/home');
      }
    });
  }

}
