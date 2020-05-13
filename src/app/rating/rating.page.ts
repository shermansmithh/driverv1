import { Component, OnInit } from '@angular/core';
import { TripService } from '../services/trip.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {
  trip: any = {};
  driver: any = {};
  rating: any = 5;

  constructor(
    private tripService: TripService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(data => {
      
      this.driver = JSON.parse(data.driver);
      this.trip = JSON.parse(data.trip);
    })
  }

  ngOnInit() {
  }

  onRateChange(event) {
    console.log(event)
    this.rating = event;
  }

  rateTrip() {
    console.log(this.rating);
    this.tripService.rateTrip(this.trip.key, this.rating).then(() => {
      this.router.navigateByUrl('/home');
    });
  }
}
