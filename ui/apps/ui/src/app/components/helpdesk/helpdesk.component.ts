import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'ess-helpdesk',
  templateUrl: './helpdesk.component.html',
})
export class HelpdeskComponent implements OnInit {
  targetID = this._configService.get().helpdesk_target_id;

  constructor(private _configService: ConfigService) {}

  ngOnInit() {
    this._makeHelpdeskForm();
  }

  private _makeHelpdeskForm() {
    jQuery('#zammad-helpdesk-form').ZammadForm({
      agreementMessage: `  Accept <a target="_blank" href="/privacy-policy">EOSC Privacy Policy</a> & <a target="_blank" href="/terms-of-use">Terms of use</a>`,
      messageTitle: 'Helpdesk',
      messageSubmit: 'Submit',
      messageThankYou:
        "Thank you for your inquiry (#%s)! We'll contact you as soon as possible.",
      showTitle: true,
      modal: true,
      attachmentSupport: false,
      targetGroupID: this.targetID,
      attributes: [
        {
          display: 'Name',
          name: 'name',
          tag: 'input',
          type: 'text',
          id: 'zammad-form-name',
          placeholder: '',
          defaultValue: '',
        },
        {
          display: 'Email',
          name: 'email',
          tag: 'input',
          type: 'email',
          id: 'zammad-form-email',
          required: true,
          placeholder: '',
          defaultValue: '',
        },
        {
          display: 'Subject (optional)',
          name: 'subject',
          tag: 'input',
          type: 'text',
          id: 'zammad-form-subject',
          required: false,
          placeholder: '',
          defaultValue: '',
        },
        {
          display: 'Message',
          name: 'body',
          tag: 'textarea',
          id: 'zammad-form-body',
          required: true,
          placeholder: '',
          defaultValue: '',
          rows: 7,
        },
      ],
    });
  }
}
