import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { RouterModule } from '@angular/router';
import { SearchInputModule } from '../../components/search-input/search-input.module';
import { BecomeProviderModule } from '@components/become-provider/become-provider.module';

import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    NgbCarouselModule,
    RouterModule.forChild([
      {
        path: '',
        component: LandingPageComponent,
      },
    ]),
    SearchInputModule,
    BecomeProviderModule,
  ],
})
export class LandingPageModule {}
