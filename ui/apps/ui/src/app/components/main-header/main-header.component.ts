import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserProfileService } from '../../auth/user-profile.service';
import { EoscCommonWindow } from './types';
import { environment } from '@environment/environment';
import { map, of, switchMap } from 'rxjs';

declare let window: EoscCommonWindow;

@UntilDestroy()
@Component({
  selector: 'ess-main-header',
  template: `
    <div
      [id]="id"
      [attr.data-login-url]="backendUrl + '/auth/request'"
      [attr.data-logout-url]="backendUrl + '/auth/logout'"
      [attr.show-eosc-links]="'true'"
      [attr.user-roles]="JSON.stringify(userRoles)"
      #h5er
    ></div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MainHeaderComponent implements OnInit {
  id = 'eosc-common-main-header';
  backendUrl = `${environment.backendApiPath}`;
  userRoles: string[] = [];

  constructor(
    private _userProfileService: UserProfileService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._userProfileService.user$
      .pipe(
        switchMap((profile) => {
          if (profile && profile.username) {
            return this._userProfileService
              .getUserRole$()
              .pipe(
                switchMap(() =>
                  this._userProfileService.roles$.pipe(
                    map((roles) => ({ profile, roles }))
                  )
                )
              );
          } else {
            return of({ profile, roles: [] });
          }
        }),
        untilDestroyed(this)
      )
      .subscribe(({ profile, roles }) => {
        this.userRoles = roles;
        this._cdr.detectChanges();
        if (
          window.eosccommon &&
          typeof window.eosccommon.renderMainHeader === 'function'
        ) {
          window.eosccommon.renderMainHeader(`#${this.id}`, profile);
        }
      });
  }

  protected readonly JSON = JSON;
}
