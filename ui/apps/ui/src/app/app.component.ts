import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'ess-root',
  template: `
    <ess-main-header></ess-main-header>
    <router-outlet></router-outlet>
    <ess-helpdesk></ess-helpdesk>
  `,
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  private scrollRetryTimeout?: ReturnType<typeof setTimeout>;
  private navigationId = 0;

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationStart || event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.navigationId++;
          this.cancelScrollRetry();
          return;
        }

        const fragment = this.router.parseUrl(this.router.url).fragment;

        if (fragment) {
          this.scrollToFragment(fragment, 0, this.navigationId);
        }
      });
  }

  private cancelScrollRetry(): void {
    if (this.scrollRetryTimeout) {
      clearTimeout(this.scrollRetryTimeout);
      this.scrollRetryTimeout = undefined;
    }
  }

  private scrollToFragment(
    fragment: string,
    attempts = 0,
    navigationId: number
  ): void {
    if (navigationId !== this.navigationId) {
      return;
    }

    const element = document.getElementById(fragment);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }

    if (attempts < 30) {
      this.scrollRetryTimeout = setTimeout(() => {
        this.scrollRetryTimeout = undefined;
        this.scrollToFragment(fragment, attempts + 1, navigationId);
      }, 100);
    }
  }
}
