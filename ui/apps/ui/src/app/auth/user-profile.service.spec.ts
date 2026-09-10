/// <reference types="jest" />

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserProfileService } from './user-profile.service';
import { UserRolesResponse } from './user-profile.types';
import { environment } from '@environment/environment';

describe('UserProfileService', () => {
  let service: UserProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserProfileService],
    });

    service = TestBed.inject(UserProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getUserRole$', () => {
    it('should fetch user roles and providers successfully and update the store', () => {
      const mockRolesResponse = {
        uid: 'testuser@access.eosc.pl',
        roles: ['admin', 'coordinator'],
        providers: [null, 'pncel'],
      };

      let receivedResponse: UserRolesResponse | undefined;
      let storeRoles: string[] | undefined;
      let storeProviders: (string | null)[] | undefined;

      service.getUserRole$().subscribe((res: UserRolesResponse) => {
        receivedResponse = res;

        service.roles$.subscribe((rolesFromStore: string[]) => {
          storeRoles = rolesFromStore;
        });

        service.providers$.subscribe(
          (providersFromStore: (string | null)[]) => {
            storeProviders = providersFromStore;
          }
        );
      });

      const req = httpMock.expectOne(
        `${environment.backendApiPath}/${environment.userRolesPath}`
      );

      expect(req.request.method).toBe('GET');

      req.flush(mockRolesResponse);

      expect(receivedResponse).toEqual(mockRolesResponse);
      expect(storeRoles).toEqual(['admin', 'coordinator']);
      expect(storeProviders).toEqual([null, 'pncel']);
    });

    it.each([
      [401, 'Unauthorized'],
      [404, 'Not Found'],
      [500, 'Internal Server Error'],
    ])(
      'should return empty roles and providers for %i (%s)',
      (status: number, statusText: string) => {
        let receivedResponse: UserRolesResponse | undefined;

        service.getUserRole$().subscribe((res) => {
          receivedResponse = res;
        });

        const req = httpMock.expectOne(
          `${environment.backendApiPath}/${environment.userRolesPath}`
        );

        expect(req.request.method).toBe('GET');

        req.flush('Error', {
          status,
          statusText,
        });

        expect(receivedResponse).toEqual({ roles: [], providers: [] });
      }
    );
  });
});
