import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BecomeProviderComponent } from './become-provider.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BecomeProviderComponent],
  imports: [CommonModule, NgbDropdownModule, FormsModule, ReactiveFormsModule],
  exports: [BecomeProviderComponent],
})
export class BecomeProviderModule {}
