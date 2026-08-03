import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, filter, of, tap } from 'rxjs';
import { environment } from '@environment/environment';
import { UserProfile } from './user-profile.types';
import { createStore, select, withProps } from '@ngneat/elf';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(private _http: HttpClient) {}

  readonly _store$ = createStore(
    {
      name: 'user-profile',
    },
    withProps<{ user: UserProfile | null; roles: string[] }>({
      user: null,
      roles: [],
    })
  );

  readonly user$: Observable<UserProfile> = this._store$.pipe(
    select((state) => state.user as UserProfile),
    filter((user) => user !== null)
  );

  readonly roles$: Observable<string[]> = this._store$.pipe(
    select((state) => state.roles)
  );

  get$(): Observable<UserProfile> {
    return this._http
      .get<{ username: string; aai_id: string }>(
        `${environment.backendApiPath}/${environment.userApiPath}`
      )
      .pipe(
        catchError(() => of({ username: '', aai_id: '' })),
        tap((user) =>
          this._store$.update((state) => ({
            ...state,
            user,
          }))
        )
      );
  }

  getUserRole$(): Observable<string[]> {
    return this._http
      .get<string[]>(
        `${environment.backendApiPath}/${environment.userRolesPath}`
      )
      .pipe(
        catchError(() => of([])),
        tap((roles) =>
          this._store$.update((state) => ({
            ...state,
            roles,
          }))
        )
      );
  }
}
