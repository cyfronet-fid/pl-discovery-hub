/// <reference types="jest" />

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserProfileService } from './user-profile.service';
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
    it('should fetch user roles successfully and update the store', () => {
      const mockRoles = ['admin', 'coordinator'];

      let receivedRoles: string[] | undefined;
      let storeRoles: string[] | undefined;

      service.getUserRole$().subscribe((roles: string[]) => {
        receivedRoles = roles;

        service.roles$.subscribe((rolesFromStore: string[]) => {
          storeRoles = rolesFromStore;
        });
      });

      const req = httpMock.expectOne(
        `${environment.backendApiPath}/${environment.userRolesPath}`
      );

      expect(req.request.method).toBe('GET');

      req.flush(mockRoles);

      expect(receivedRoles).toEqual(mockRoles);
      expect(storeRoles).toEqual(mockRoles);
    });

    it.each([
      [401, 'Unauthorized'],
      [404, 'Not Found'],
      [500, 'Internal Server Error'],
    ])(
      'should return empty roles for %i (%s)',
      (status: number, statusText: string) => {
        let receivedRoles: string[] | undefined;

        service.getUserRole$().subscribe((roles) => {
          receivedRoles = roles;
        });

        const req = httpMock.expectOne(
          `${environment.backendApiPath}/${environment.userRolesPath}`
        );

        expect(req.request.method).toBe('GET');

        req.flush('Error', {
          status,
          statusText,
        });

        expect(receivedRoles).toEqual([]);
      }
    );
  });
});
