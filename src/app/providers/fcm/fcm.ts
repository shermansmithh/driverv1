import { Injectable } from '@angular/core';
// import { Firebase } from '@ionic-native/firebase';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Observable, of } from 'rxjs'; 
/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare var window
//key : AAAAAI_l738:APA91bFVMt4LDnfsDVxpUzvvwuyOhTUniIHq1jHZ2lA21DOXxTfAu-QZ_EEjXHygDeFbtGyn8f3Bni-viBW1_upQF1F8sUaGaL-3O7WZOj_SUMQeCxyUAyLUwPWtnuF3jyqz2Iy2J8uc
@Injectable()
export class FcmProvider {
  userId: any

  constructor(
    // public firebaseNative: Firebase,
    public afs: AngularFirestore,
    private platform: Platform
  ) {
    this.userId = firebase.auth().currentUser.uid;
  }

  // Get permission from the user
  async getToken() {

    let token;
    if (this.platform.is('android')) {

      token = await window.FirebasePlugin.getToken()

    }


    if (this.platform.is('ios')) {
      token = await window.FirebasePlugin.getToken()
      await window.FirebasePlugin.grantPermission();
    }

    return this.saveTokenToFirestore(token)
  }


  async getTokenDevice() {
    let token;
    token = await window.FirebasePlugin.getToken()

    return token
  }

  subribeUIDtoTopic(topic) {
    window.FirebasePlugin.subscribe(topic)
  }

  unsubribeUIDtoTopic(topic) {
    window.FirebasePlugin.unsubscribe(topic)
  }


  // Save the token to firestore
  private saveTokenToFirestore(token) {
    if (!token) return;

    const devicesRef = this.afs.collection('devices')

    const docData = {
      token,
      userId: this.userId
    }

    return devicesRef.doc(token).set(docData)
  }

  // Listen to incoming FCM messages
  listenToNotifications() {

    return new Observable(observer => {
      (window as any).FirebasePlugin.onMessageReceived((response) => {
        observer.next(response);
      });
    });
  }

}
