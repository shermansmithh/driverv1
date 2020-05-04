import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  loader: any;
  constructor(private toastCtrl: ToastController,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  showToast(message) {
    this.toastCtrl.create({ message: message, duration: 3000 }).then(res => res.present());
  }

  showAlert(message) {
    this.alertCtrl.create({
      message: message,
      buttons: ['ok']
    }).then(res => res.present());
  }

  showLoader(message) {
    this.loadCtrl.create({ message: message }).then(res => {
      this.loader = res.present();
      setTimeout(() => this.loadCtrl.dismiss(), 10000);
    });
  }

  hideLoader() {
    this.loadCtrl.dismiss();
  }
}
