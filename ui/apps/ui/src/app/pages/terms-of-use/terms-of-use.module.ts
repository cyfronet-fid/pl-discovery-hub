import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TermsOfUseComponent } from './terms-of-use.component';
import { BackToSearchBarModule } from '@components/back-to-search-bar/back-to-search-bar.module';

@NgModule({
  declarations: [TermsOfUseComponent],
  imports: [
    CommonModule,
    BackToSearchBarModule,
    RouterModule.forChild([
      {
        path: '',
        component: TermsOfUseComponent,
      },
    ]),
  ],
})
export class TermsOfUseModule {}
