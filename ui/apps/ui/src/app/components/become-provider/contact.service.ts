import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contactEndpoint = `${environment.backendApiPath}/${environment.contactApiPath}`

  constructor(private http: HttpClient) {}

  sendMessage(contactForm: { email: string; option: string, message: string, agree: boolean}): Observable<any> {
    const { agree, ...payload } = contactForm;
    console.log('Payload:', JSON.stringify(contactForm));
    console.log('Payload:', JSON.stringify(payload));
    return this.http.post(this.contactEndpoint, payload);
  }
}
