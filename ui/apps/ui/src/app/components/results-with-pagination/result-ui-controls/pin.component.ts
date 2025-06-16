import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfigService } from '../../../services/config.service';
import { CustomRoute } from '@collections/services/custom-route.service';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import { RedirectService } from '@collections/services/redirect.service';
import { DEFAULT_SCOPE } from '@collections/services/custom-route.service';

@Component({
  selector: 'ess-pin',
  template: `
    <a style="display: flex;" [attr.href]="pinUrl" target="_blank">
      <span class="pin-icon"></span>
      <span class="pin-icon-text">Pin to the Marketplace Project</span>
    </a>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-top: 4px;
      }

      .pin-icon {
        width: 18px;
        height: 18px;
        background-repeat: no-repeat;
        background-image: url('../../../../assets/pin-icon.svg');
        background-position: 0 1px;
      }

      .pin-icon-text {
        color: #040f81;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 18px;
        margin-right: 10px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PinComponent implements OnChanges, OnInit, OnDestroy {
  @Input() resourceId!: string;
  @Input() resourceType!: string;

  public pinUrl = '';
  private scope: string = DEFAULT_SCOPE;
  private destroy$ = new Subject<void>();

  constructor(
    private _configService: ConfigService,
    private _customRoute: CustomRoute,
    private _searchMetadataRepository: SearchMetadataRepository,
    private _redirectService: RedirectService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get initial scope from query params
    this.scope =
      this._route.snapshot.queryParamMap.get('scope') || DEFAULT_SCOPE;

    // Listen for scope changes in query params
    this._route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const newScope = params.get('scope') || DEFAULT_SCOPE;
        if (this.scope !== newScope) {
          this.scope = newScope;
          this.updatePinUrl();
        }
      });

    // Initial URL generation
    this.updatePinUrl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resourceId'] || changes['resourceType']) {
      this.updatePinUrl();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updatePinUrl(): void {
    if (this.resourceId && this.resourceType) {
      const type =
        this.resourceType === 'other' ? 'other_rp' : this.resourceType;
      this.pinUrl = `${
        this._configService.get().pl_marketplace_url
      }/research_products/new?resource_id=${encodeURIComponent(
        this.resourceId
      )}&resource_type=${encodeURIComponent(type)}&scope=${encodeURIComponent(
        this.scope
      )}`;
    }
  }
}
