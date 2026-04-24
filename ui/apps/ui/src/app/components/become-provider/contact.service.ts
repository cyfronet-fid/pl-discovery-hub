import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IBecomeProvider } from '@components/become-provider/types';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contactEndpoint = `${environment.backendApiPath}/${environment.contactApiPath}`;

  constructor(private http: HttpClient) {}

  sendMessage(contactForm: {
    email: string;
    option: string;
    message: string;
    agree: boolean;
  }): Observable<IBecomeProvider> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { agree, ...payload } = contactForm;
    return this.http.post<IBecomeProvider>(this.contactEndpoint, payload);
  }
}
