import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;

  constructor(public loadingController: LoadingController) { }

  async present() {
    this.isLoading = true;
    return await this.loadingController.create({
      duration: 5000,
      spinner: 'crescent',
      cssClass:'custom-loader-class',
      // message: 'Please wait...',
    }).then(a => {
      a.present().then(() => {
        // console.log('presented');
        if (!this.isLoading) {
          // a.dismiss().then(() => console.log('abort presenting'));
          a.dismiss();
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    // return await this.loadingController.dismiss().then(() => console.log('dismissed'));
    return await this.loadingController.dismiss();
  }
}