/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { MainHeaderComponent } from './main-header.component';
import { UserProfileService } from '../../auth/user-profile.service';
import { UserProfile } from '../../auth/user-profile.types';
import { EoscCommonWindow } from './types';

declare let window: EoscCommonWindow;

describe('MainHeaderComponent', () => {
  let component: MainHeaderComponent;
  let fixture: ComponentFixture<MainHeaderComponent>;

  let mockUserProfileService: Partial<UserProfileService>;

  let userSubject: BehaviorSubject<UserProfile>;
  let rolesSubject: BehaviorSubject<string[]>;

  let renderMainHeaderSpy: jest.Mock<void, [string, object?]>;
  let getUserRoleSpy: jest.Mock<Observable<string[]>, []>;

  beforeEach(async () => {
    userSubject = new BehaviorSubject<UserProfile>({
      username: '',
      aai_id: '',
    });

    rolesSubject = new BehaviorSubject<string[]>([]);

    renderMainHeaderSpy = jest.fn<void, [string, object?]>();

    getUserRoleSpy = jest.fn<Observable<string[]>, []>(() => {
      const roles = rolesSubject.value;

      return of(roles).pipe(
        tap((fetchedRoles) => {
          rolesSubject.next(fetchedRoles);
        })
      );
    });

    mockUserProfileService = {
      user$: userSubject.asObservable(),
      roles$: rolesSubject.asObservable(),
      getUserRole$: getUserRoleSpy,
    };

    window.eosccommon = {
      renderMainHeader: renderMainHeaderSpy,
      renderMainFooter: jest.fn(),
      renderEuInformation: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [MainHeaderComponent],
      providers: [
        {
          provide: UserProfileService,
          useValue: mockUserProfileService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainHeaderComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticated user', () => {
    it('should render header with regular user defaults when no Marketplace roles are returned', () => {
      const mockUser: UserProfile = {
        username: 'testuser',
        aai_id: '1234',
      };

      rolesSubject.next([]);
      fixture.detectChanges();

      userSubject.next(mockUser);
      fixture.detectChanges();

      expect(getUserRoleSpy).toHaveBeenCalledTimes(1);

      expect(component.userRoles).toEqual([]);

      expect(renderMainHeaderSpy).toHaveBeenCalledWith(
        '#eosc-common-main-header',
        mockUser
      );

      const el: HTMLElement = fixture.nativeElement.querySelector(
        '#eosc-common-main-header'
      );

      expect(el).not.toBeNull();
      expect(el.getAttribute('user-roles')).toBe('[]');
    });

    it.each([['admin'], ['coordinator'], ['executive']])(
      'should pass provider role "%s" to the common header',
      (providerRole) => {
        const mockUser: UserProfile = {
          username: 'provideruser',
          aai_id: '456',
        };

        const providerRoles = [providerRole];

        rolesSubject.next(providerRoles);

        fixture.detectChanges();
        userSubject.next(mockUser);
        fixture.detectChanges();

        expect(getUserRoleSpy).toHaveBeenCalledTimes(1);

        expect(component.userRoles).toEqual(providerRoles);

        const el: HTMLElement = fixture.nativeElement.querySelector(
          '#eosc-common-main-header'
        );

        expect(el).not.toBeNull();
        expect(el.getAttribute('user-roles')).toBe(
          JSON.stringify(providerRoles)
        );

        expect(renderMainHeaderSpy).toHaveBeenCalledWith(
          '#eosc-common-main-header',
          mockUser
        );
      }
    );

    it('should pass multiple provider roles to the common header', () => {
      const mockUser: UserProfile = {
        username: 'adminuser',
        aai_id: '456',
      };

      const providerRoles = ['admin', 'coordinator', 'executive'];

      rolesSubject.next(providerRoles);

      fixture.detectChanges();
      userSubject.next(mockUser);
      fixture.detectChanges();

      expect(component.userRoles).toEqual(providerRoles);

      const el: HTMLElement = fixture.nativeElement.querySelector(
        '#eosc-common-main-header'
      );

      expect(el.getAttribute('user-roles')).toBe(JSON.stringify(providerRoles));

      expect(renderMainHeaderSpy).toHaveBeenCalledWith(
        '#eosc-common-main-header',
        mockUser
      );
    });

    it('should pass other non-provider roles to the common header', () => {
      const mockUser: UserProfile = {
        username: 'otheruser',
        aai_id: '789',
      };

      const otherRoles = ['researcher'];

      rolesSubject.next(otherRoles);

      fixture.detectChanges();
      userSubject.next(mockUser);
      fixture.detectChanges();

      expect(getUserRoleSpy).toHaveBeenCalledTimes(1);

      expect(component.userRoles).toEqual(otherRoles);

      const el: HTMLElement = fixture.nativeElement.querySelector(
        '#eosc-common-main-header'
      );

      expect(el).not.toBeNull();
      expect(el.getAttribute('user-roles')).toBe(JSON.stringify(otherRoles));

      expect(renderMainHeaderSpy).toHaveBeenCalledWith(
        '#eosc-common-main-header',
        mockUser
      );
    });
  });

  describe('roles and common header integration', () => {
    it('should fetch roles for an authenticated user', () => {
      const mockUser: UserProfile = {
        username: 'testuser',
        aai_id: '1234',
      };

      fixture.detectChanges();

      expect(getUserRoleSpy).not.toHaveBeenCalled();

      userSubject.next(mockUser);
      fixture.detectChanges();

      expect(getUserRoleSpy).toHaveBeenCalledTimes(1);
    });

    it('should expose fetched roles through the user-roles attribute', () => {
      const mockUser: UserProfile = {
        username: 'testuser',
        aai_id: '1234',
      };

      const roles = ['admin', 'coordinator'];

      rolesSubject.next(roles);

      fixture.detectChanges();
      userSubject.next(mockUser);
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement.querySelector(
        '#eosc-common-main-header'
      );

      expect(el.getAttribute('user-roles')).toBe(JSON.stringify(roles));
    });

    it('should pass the expected user profile to renderMainHeader', () => {
      const mockUser: UserProfile = {
        username: 'testuser',
        aai_id: '1234',
      };

      fixture.detectChanges();
      userSubject.next(mockUser);
      fixture.detectChanges();

      expect(renderMainHeaderSpy).toHaveBeenCalledWith(
        '#eosc-common-main-header',
        mockUser
      );
    });
  });

  describe('role changes', () => {
    it('should re-render the header when roles change without changing the user profile', () => {
      const mockUser: UserProfile = {
        username: 'testuser',
        aai_id: '1234',
      };

      rolesSubject.next([]);

      fixture.detectChanges();
      userSubject.next(mockUser);
      fixture.detectChanges();

      const initialCallCount = renderMainHeaderSpy.mock.calls.length;

      expect(component.userRoles).toEqual([]);
      expect(getUserRoleSpy).toHaveBeenCalledTimes(1);

      rolesSubject.next(['executive']);
      fixture.detectChanges();

      expect(component.userRoles).toEqual(['executive']);

      expect(renderMainHeaderSpy.mock.calls.length).toBe(initialCallCount + 1);

      expect(renderMainHeaderSpy).toHaveBeenLastCalledWith(
        '#eosc-common-main-header',
        mockUser
      );

      expect(getUserRoleSpy).toHaveBeenCalledTimes(1);

      const el: HTMLElement = fixture.nativeElement.querySelector(
        '#eosc-common-main-header'
      );

      expect(el.getAttribute('user-roles')).toBe('["executive"]');
    });

    it('should update from regular user roles to provider roles', () => {
      const mockUser: UserProfile = {
        username: 'testuser',
        aai_id: '1234',
      };

      rolesSubject.next([]);

      fixture.detectChanges();
      userSubject.next(mockUser);
      fixture.detectChanges();

      expect(component.userRoles).toEqual([]);

      rolesSubject.next(['admin']);
      fixture.detectChanges();

      expect(component.userRoles).toEqual(['admin']);

      expect(renderMainHeaderSpy).toHaveBeenLastCalledWith(
        '#eosc-common-main-header',
        mockUser
      );

      expect(getUserRoleSpy).toHaveBeenCalledTimes(1);

      const el: HTMLElement = fixture.nativeElement.querySelector(
        '#eosc-common-main-header'
      );

      expect(el.getAttribute('user-roles')).toBe('["admin"]');
    });

    it('should update from provider roles to regular user roles', () => {
      const mockUser: UserProfile = {
        username: 'testuser',
        aai_id: '1234',
      };

      rolesSubject.next(['admin']);

      fixture.detectChanges();
      userSubject.next(mockUser);
      fixture.detectChanges();

      expect(component.userRoles).toEqual(['admin']);

      rolesSubject.next([]);
      fixture.detectChanges();

      expect(component.userRoles).toEqual([]);

      expect(renderMainHeaderSpy).toHaveBeenLastCalledWith(
        '#eosc-common-main-header',
        mockUser
      );

      expect(getUserRoleSpy).toHaveBeenCalledTimes(1);

      const el: HTMLElement = fixture.nativeElement.querySelector(
        '#eosc-common-main-header'
      );

      expect(el.getAttribute('user-roles')).toBe('[]');
    });
  });

  describe('safe defaults', () => {
    it('should render the header with empty roles when no Marketplace roles are available', () => {
      const mockUser: UserProfile = {
        username: 'testuser',
        aai_id: '1234',
      };

      rolesSubject.next([]);

      fixture.detectChanges();
      userSubject.next(mockUser);
      fixture.detectChanges();

      expect(component.userRoles).toEqual([]);

      expect(renderMainHeaderSpy).toHaveBeenCalledWith(
        '#eosc-common-main-header',
        mockUser
      );

      const el: HTMLElement = fixture.nativeElement.querySelector(
        '#eosc-common-main-header'
      );

      expect(el.getAttribute('user-roles')).toBe('[]');
    });
  });
});
