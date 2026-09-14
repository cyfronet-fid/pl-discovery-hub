import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, filter, of, switchMap, tap } from 'rxjs';
import { environment } from '@environment/environment';
import { UserDataResponse, UserProfile } from './user-profile.types';
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
    withProps<{
      user: UserProfile | null;
      roles: string[];
      providers: (string | null)[];
      userDataFetchedAt: number | null;
    }>({
      user: null,
      roles: [],
      providers: [],
      userDataFetchedAt: null,
    })
  );

  readonly user$: Observable<UserProfile> = this._store$.pipe(
    select((state) => state.user as UserProfile),
    filter((user) => user !== null)
  );

  readonly roles$: Observable<string[]> = this._store$.pipe(
    select((state) => state.roles)
  );

  readonly providers$: Observable<(string | null)[]> = this._store$.pipe(
    select((state) => state.providers)
  );

  readonly userData$: Observable<UserDataResponse> = this._store$.pipe(
    select((state) => ({
      roles: state.roles,
      providers: state.providers,
    }))
  );

  private _isUserDataFetched(): boolean {
    return this._store$.getValue().userDataFetchedAt !== null;
  }

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

  getUserData$(): Observable<UserDataResponse> {
    if (this._isUserDataFetched()) {
      return this.userData$;
    }

    return this._http
      .get<UserDataResponse>(
        `${environment.backendApiPath}/${environment.userRolesPath}`
      )
      .pipe(
        catchError(() => of({ roles: [], providers: [] })),
        tap((res) =>
          this._store$.update((state) => ({
            ...state,
            roles: res?.roles ?? [],
            providers: res?.providers ?? [],
            userDataFetchedAt: Date.now(),
          }))
        ),
        switchMap(() => this.userData$)
      );
  }
}
