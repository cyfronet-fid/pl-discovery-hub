import { Component } from '@angular/core';
import { DEFAULT_COLLECTION_ID } from '@collections/data';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ess-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  allUrlPath = '/search/' + DEFAULT_COLLECTION_ID;

  paused = false;

  togglePaused(carousel: NgbCarousel) {
    this.paused = !this.paused;
    if (this.paused) carousel.pause();
    else carousel.cycle();
  }
}
