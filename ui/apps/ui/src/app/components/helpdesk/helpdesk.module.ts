import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpdeskComponent } from './helpdesk.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HelpdeskComponent],
  imports: [CommonModule, NgbDropdownModule, FormsModule],
  exports: [HelpdeskComponent],
})
export class HelpdeskModule {}
