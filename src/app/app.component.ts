import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TripService } from './services/trip.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  user: any = {};
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Ride History',
      url: '/history',
      icon: 'time'
    },
    {
      title: 'Payments',
      url: '/payments',
      icon: 'card'
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'contact'
    },

  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private tripService: TripService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      this.afAuth.authState.subscribe(authData => this.user = authData);
      this.afAuth.authState.pipe(take(1)).subscribe(authData => {
        if (authData) {
          this.tripService.getTrips().valueChanges().subscribe((trips: any) => {
            trips.forEach(trip => {
              if (trip.status === 'waiting' || trip.status === 'accepted' || trip.status === 'going') {
                this.tripService.setId(trip.key)
                this.router.navigateByUrl('tracking');
              }
              else if (trip.status === 'finished') {
                this.router.navigateByUrl('/home');
              }
            })
          })
          this.router.navigateByUrl('/home');
        } else {
          this.router.navigateByUrl('/login');
        }
      });
    });
  }
}
