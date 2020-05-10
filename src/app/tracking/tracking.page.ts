import { Component, OnInit } from '@angular/core';
import { POSITION_INTERVAL, TRIP_STATUS_GOING,TRIP_STATUS_FINISHED, SOS } from 'src/environments/environment.prod';
import { DriverService } from '../services/driver.service';
import { MenuController } from '@ionic/angular';
import { TripService } from '../services/trip.service';
import { PlaceService } from '../services/place.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage implements OnInit {



  driver: any;
  map: any;
  trip: any = {};
  driverTracking: any;
  marker: any;
  tripStatus: any;
  sos: any;
  alertCnt: any = 0;
  rate: any = 5;
  finish : boolean = false

  constructor(
    private driverService: DriverService,
    private tripService: TripService,
    private placeService: PlaceService,
    private router: Router,
    
    private menuCtrl: MenuController
  ) {
    this.sos = SOS;
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true);
    let tripId = this.tripService.getId();

    this.tripService.getTrip(tripId).valueChanges().subscribe((snapshot: any) => {
      if (snapshot != null) {
        console.log(this.trip)
        this.trip = snapshot;
        console.log(this.trip);

        this.driverService.getDriver(this.trip.driverId).valueChanges().pipe(take(1)).subscribe(snap => {
          console.log(snap);

          this.driver = snap;
          this.watchTrip(tripId);
          // init map
          this.loadMap();
        })
      }
    });

  }

  ionViewWillLeave() {
    clearInterval(this.driverTracking);
  }

  watchTrip(tripId) {
    this.tripService.getTrip(tripId).valueChanges().subscribe((snapshot: any) => {
      this.tripStatus = snapshot.status;
      if (this.tripStatus == TRIP_STATUS_FINISHED) {
       this.finish == true
      }
    });
  }
  showRateCard() {
    let final = this.trip.fee - (this.trip.fee * (parseInt(this.trip.discount) / 100));
    this.trip.final = final;

    this.router.navigate(['rating'], {
      queryParams: {
        trip: JSON.stringify(this.trip),
        driver: JSON.stringify(this.driver)
      }
    });
  }


  loadMap() {

    console.log("load Map calling");
    let latLng = new google.maps.LatLng(this.trip.origin.location.lat, this.trip.origin.location.lng);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false
    }

    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      icon: {
        url: 'assets/img/map-suv.png'
      }
    });

    this.trackDriver();
  }

  // make array with range is n
  range(n) {
    return new Array(Math.round(n));
  }

  trackDriver() {
    // this.showDriverOnMap();

    this.driverTracking = setInterval(() => {
      this.marker.setMap(null);
      this.showDriverOnMap();
    }, POSITION_INTERVAL);

    console.log(POSITION_INTERVAL);
  }

  cancelTrip() {
    this.tripService.cancelTrip(this.trip.key).then(data => {
      console.log(data);
      this.router.navigateByUrl('/home');
    })
  }

  // show user on map
  showDriverOnMap() {
    // get user's position
    this.driverService.getDriverPosition(
      this.placeService.getLocality(),
      this.driver.type,
      this.driver.uid
    ).valueChanges().pipe(take(1)).subscribe((snapshot: any) => {
      // create or update
      console.log(snapshot);
      let latLng = new google.maps.LatLng(snapshot.lat, snapshot.lng);

      if (this.tripStatus == TRIP_STATUS_GOING) {
        console.log(this.tripStatus);
        this.map.setCenter(latLng);
      }

    

      // show vehicle to map
      this.marker = new google.maps.Marker({
        map: this.map,
        position: latLng,
        icon: {
          url: 'assets/img/map-suv.png',
          size: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(16, 16),
          scaledSize: new google.maps.Size(32, 32)
        },
      });
    });
  }
}
