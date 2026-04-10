import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from './contact.service';

@Component({
  selector: 'ess-become-provider',
  styleUrls: ['./become-provider.component.scss'],
  templateUrl: './become-provider.component.html',
})
export class BecomeProviderComponent implements OnInit {
  contactForm!: FormGroup;
  lastSubmittedData: any = null;
  isResendingBlocked: boolean = false;
  isLoading: boolean = false;
  submissionError: string | null = null;

  constructor(private fb: FormBuilder, private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      message: [''],
      option: ['', Validators.required],
      agree: [false, [Validators.requiredTrue]],
    });

    this.contactForm.valueChanges.subscribe(() => {
      this.checkForResending();
    });
  }

  get formControls() {
    return this.contactForm.controls;
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const currentData = this.contactForm.value;

      // Block resending the same message
      if (this.isResendingBlocked) {
        alert('This message has already been sent.');
        return;
      }

      // Show loading state
      this.isLoading = true;
      this.submissionError = null;

      this.contactService.sendMessage(currentData).subscribe({
        next: (response) => {
          this.lastSubmittedData = currentData;
          this.isResendingBlocked = true;
          this.isLoading = false;
          alert('Thanks for contacting us! Your message has been submitted.');
        },
        error: (err) => {
          this.isLoading = false;
          this.submissionError = 'Failed to send the message. Please try again later.';
          console.error('Error sending contact message:', err);
        }
      });
    }
    else{
      this.contactForm.markAllAsTouched();
      return;
    }
  }

  checkForResending(): void {
    const currentData = this.contactForm.value;
    this.isResendingBlocked =
      this.lastSubmittedData &&
      JSON.stringify(this.lastSubmittedData) === JSON.stringify(currentData);
  }

  @Output() closed = new EventEmitter();

  closePopup() {
    this.closed.emit();
  }
}
