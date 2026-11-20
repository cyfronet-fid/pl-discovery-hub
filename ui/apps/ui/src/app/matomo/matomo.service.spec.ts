import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RedirectService } from '@collections/services/redirect.service';
import { ResultComponent } from '@components/results-with-pagination/result.component';
import { IAdapter, IResult } from '@collections/repositories/types';
import { allCollectionsAdapter } from '@collections/data/all/adapter.data';
import { bundlesAdapter } from '@collections/data/bundles/adapter.data';
import { dataSourcesAdapter } from '@collections/data/data-sources/adapter.data';
import { guidelinesAdapter } from '@collections/data/guidelines/adapter.data';
import { projectsAdapter } from '@collections/data/projects/adapter.data';
import { providersAdapter } from '@collections/data/providers/adapter.data';
import { publicationsAdapter } from '@collections/data/publications/adapter.data';
import { servicesAdapter } from '@collections/data/services/adapter.data';
import { UrlTitleModule } from '../layouts/url-title/url-title.module';

import { WINDOW } from '../app.providers';
import { MatomoService, provideMatomoTracking } from './matomo.service';
import { clickThroughName } from './click-through';

// string-strip-html and its dependencies ship ES modules only, which this
// Jest setup can't load. Result titles here are plain text anyway.
jest.mock('string-strip-html', () => ({
  stripHtml: (html: string) => ({ result: html.replace(/<[^>]*>/g, '') }),
}));

@Component({ standalone: true, template: '' })
class BlankComponent {}

type PaqEntry = unknown[];
const paq = (): PaqEntry[] =>
  (window as unknown as { _paq: PaqEntry[] })._paq ?? [];

const commands = (name: string) => paq().filter(([cmd]) => cmd === name);

interface Hit {
  args: unknown[];
  url?: unknown;
  title?: unknown;
  referrer?: unknown;
}
/**
 * Replays _paq the way Matomo's JS does: setCustomUrl, setDocumentTitle and
 * setReferrerUrl apply to every later hit.
 */
const hits = (name: string): Hit[] => {
  const context: Omit<Hit, 'args'> = {};
  const found: Hit[] = [];
  for (const [cmd, ...args] of paq()) {
    if (cmd === 'setCustomUrl') context.url = args[0];
    if (cmd === 'setDocumentTitle') context.title = args[0];
    if (cmd === 'setReferrerUrl') context.referrer = args[0];
    if (cmd === name) found.push({ args, ...context });
  }
  return found;
};

const MATOMO_ON = {
  matomo_url: 'https://matomo.example.org/',
  matomo_site_id: 3,
};
const MATOMO_OFF = { matomo_url: null, matomo_site_id: null };

describe('MatomoService', () => {
  let router: Router;
  let matomo: MatomoService;
  let redirect: RedirectService;

  beforeEach(() => {
    delete (window as unknown as { _paq?: PaqEntry[] })._paq;
    // The tracker script is inserted before the first script on the page
    document.head.appendChild(document.createElement('script'));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UrlTitleModule],
      // Only the result's links matter here, not its other parts
      declarations: [ResultComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: WINDOW, useValue: window },
        provideMatomoTracking(),
        provideRouter([
          { path: 'search/:collection', component: BlankComponent },
          { path: 'guidelines/:id', component: BlankComponent },
          { path: 'documentation', component: BlankComponent },
        ]),
      ],
    });
    router = TestBed.inject(Router);
    matomo = TestBed.inject(MatomoService);
    redirect = TestBed.inject(RedirectService);
  });

  afterEach(() => {
    document
      .querySelectorAll('script, a')
      .forEach((element) => element.remove());
  });

  /** Puts a link on the page and clicks it like a visitor would */
  const click = (
    href: string | null,
    { type = 'click', button = 0 }: { type?: string; button?: number } = {}
  ) => {
    const link = document.createElement('a');
    link.setAttribute('href', href ?? '');
    link.innerHTML = '<span>Open</span>';
    // jsdom can't navigate
    link.addEventListener('click', (event) => event.preventDefault());
    document.body.appendChild(link);
    link
      .querySelector('span')
      ?.dispatchEvent(
        new MouseEvent(type, { bubbles: true, cancelable: true, button })
      );
  };
  const resultLink = (type: string, eventName = '', recommendation = false) =>
    redirect.internalUrl(
      'https://marketplace.example.org/services/x',
      'resource-id',
      type,
      '',
      recommendation,
      eventName
    );

  /** Renders a search result the way the result list does */
  const renderResult = (
    result: Pick<IResult, 'id' | 'title' | 'type' | 'redirectUrl'>,
    clickThroughName: string
  ) => {
    const fixture = TestBed.createComponent(ResultComponent);
    Object.assign(fixture.componentInstance, {
      id: result.id,
      title: result.title,
      type: result.type,
      redirectUrl: result.redirectUrl,
      clickThroughName,
    });
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };
  /** Search results link straight to the result, not through /navigate */
  const links = (result: HTMLElement) => {
    const all = Array.from(result.querySelectorAll('a'));
    return {
      title: result.querySelector('ess-url-title a') as HTMLAnchorElement,
      learnMore: all.find((link) =>
        link.textContent?.includes('Learn more')
      ) as HTMLAnchorElement,
    };
  };
  const clickOn = (
    link: HTMLElement,
    { type = 'click', button = 0 }: { type?: string; button?: number } = {}
  ) => {
    // jsdom can't navigate
    link.addEventListener('click', (event) => event.preventDefault());
    link.dispatchEvent(
      new MouseEvent(type, { bubbles: true, cancelable: true, button })
    );
  };

  const matomoScripts = () =>
    Array.from(document.querySelectorAll('script')).filter((script) =>
      script.src.startsWith(MATOMO_ON.matomo_url)
    );

  describe('when /config has no Matomo settings', () => {
    it('initialises nothing and sends nothing', async () => {
      matomo.start(MATOMO_OFF);
      await router.navigateByUrl('/guidelines/g-1');
      await router.navigateByUrl('/search/dataset?q=*');
      matomo.trackSearch(
        { collection: 'dataset', q: '*', fq: [] },
        { numFound: 5 }
      );
      click(resultLink('service', 'eosc.cyf.abc'));

      expect(paq()).toEqual([]);
      expect(matomoScripts()).toEqual([]);
    });
  });

  it('needs no Matomo providers while Matomo is off, so other specs can use it', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const offMatomo = TestBed.inject(MatomoService);

    offMatomo.start(MATOMO_OFF);
    offMatomo.trackSearch(
      { collection: 'dataset', q: 'water', fq: [] },
      { numFound: 5 }
    );

    expect(paq()).toEqual([]);
  });

  describe('when /config has Matomo settings', () => {
    it('loads the tracker for the configured site', () => {
      matomo.start(MATOMO_ON);

      expect(commands('setTrackerUrl')).toEqual([
        ['setTrackerUrl', 'https://matomo.example.org/matomo.php'],
      ]);
      expect(commands('setSiteId')).toEqual([['setSiteId', '3']]);
      expect(matomoScripts().map((script) => script.src)).toEqual([
        'https://matomo.example.org/matomo.js',
      ]);
    });

    it('sends hits with sendBeacon, so click-throughs survive leaving the page', () => {
      matomo.start(MATOMO_ON);

      expect(commands('alwaysUseSendBeacon')).toHaveLength(1);
    });

    it('disables cookies before the first hit', async () => {
      matomo.start(MATOMO_ON);
      await router.navigateByUrl('/guidelines/g-1');

      const names = paq().map(([cmd]) => cmd);
      expect(names).toContain('disableCookies');
      expect(names).toContain('trackPageView');
      expect(names.indexOf('disableCookies')).toBeLessThan(
        names.indexOf('trackPageView')
      );
    });
  });

  describe('page views', () => {
    beforeEach(() => {
      document.title = 'Resource Discovery Hub';
      matomo.start(MATOMO_ON);
    });

    it('sends one page view per navigation, with its URL, title and referrer', async () => {
      await router.navigateByUrl('/guidelines/g-1');
      await router.navigateByUrl('/documentation?tab=2');

      expect(hits('trackPageView')).toEqual([
        {
          args: [],
          url: 'http://localhost/guidelines/g-1',
          title: 'Resource Discovery Hub',
        },
        {
          args: [],
          url: 'http://localhost/documentation?tab=2',
          title: 'Resource Discovery Hub',
          referrer: 'http://localhost/guidelines/g-1',
        },
      ]);
    });

    it('sends no page view for search pages, which are referred to without their query', async () => {
      await router.navigateByUrl('/search/publication?q=water&fq=x');
      await router.navigateByUrl('/search/publication?q=water&cursor=abc');
      await router.navigateByUrl('/guidelines/g-1');

      expect(hits('trackPageView')).toEqual([
        expect.objectContaining({
          url: 'http://localhost/guidelines/g-1',
          referrer: 'http://localhost/search/publication',
        }),
      ]);
    });
  });

  describe('site search', () => {
    const search = (params: {
      collection: string;
      q: string;
      fq?: string[];
      cursor?: string;
      sort?: string[];
    }) => ({ fq: [], cursor: '*', sort: [], ...params });

    beforeEach(() => matomo.start(MATOMO_ON));

    it('sends the keyword, the collection and the result count from the search page URL', async () => {
      await router.navigateByUrl('/search/publication?q=water&fq=year:2020');

      matomo.trackSearch(
        search({ collection: 'publication', q: 'water', fq: ['year:2020'] }),
        { numFound: 42 }
      );

      expect(hits('trackSiteSearch')).toEqual([
        expect.objectContaining({
          args: ['water', 'publication', 42],
          url: 'http://localhost/search/publication',
        }),
      ]);
    });

    it('sends an empty search (q=*) with no keyword', () => {
      matomo.trackSearch(search({ collection: 'dataset', q: '*' }), {
        numFound: 1200,
      });

      expect(commands('trackSiteSearch')).toEqual([
        ['trackSiteSearch', '', 'dataset', 1200],
      ]);
    });

    it('sends nothing when only the cursor or the sort changes', () => {
      const first = search({ collection: 'software', q: 'solver' });
      const nextPage = { ...first, cursor: 'AoE/next' };
      const resorted = { ...first, sort: ['title asc'] };
      matomo.trackSearch(first, { numFound: 10 });
      matomo.trackSearch(nextPage, { numFound: 10 });
      matomo.trackSearch(resorted, { numFound: 10 });

      expect(commands('trackSiteSearch')).toHaveLength(1);
    });

    it.each([
      ['q', { q: 'pde solver' }],
      ['the collection', { collection: 'all_collection' }],
      ['the filters', { fq: ['language:English'] }],
    ])('sends a new search when %s changes', (_, change) => {
      const first = search({ collection: 'software', q: 'solver' });
      matomo.trackSearch(first, { numFound: 10 });
      matomo.trackSearch({ ...first, ...change }, { numFound: 4 });

      expect(commands('trackSiteSearch')).toHaveLength(2);
    });

    it('sends the same search again after the visitor has been on another page', async () => {
      const water = search({ collection: 'publication', q: 'water' });
      await router.navigateByUrl('/search/publication?q=water');
      matomo.trackSearch(water, { numFound: 42 });
      await router.navigateByUrl('/guidelines/g-1');
      await router.navigateByUrl('/search/publication?q=water');
      matomo.trackSearch(water, { numFound: 42 });

      expect(commands('trackSiteSearch')).toHaveLength(2);
    });

    it('sends nothing for a failed search, so a retry still counts', () => {
      const failing = search({ collection: 'software', q: 'solver' });
      matomo.trackSearch(failing, { numFound: 0, isError: true });
      expect(commands('trackSiteSearch')).toEqual([]);

      matomo.trackSearch(failing, { numFound: 10 });
      expect(commands('trackSiteSearch')).toEqual([
        ['trackSiteSearch', 'solver', 'software', 10],
      ]);
    });
  });

  describe('click-throughs', () => {
    beforeEach(() => matomo.start(MATOMO_ON));

    it('sends a ClickThrough event named after the result', () => {
      click(resultLink('service', 'eosc.cyf.abc'));

      expect(commands('trackEvent')).toEqual([
        ['trackEvent', 'Service', 'ClickThrough', 'eosc.cyf.abc'],
      ]);
    });

    it('sends a ClickThrough event on a middle click', () => {
      click(resultLink('service', 'eosc.cyf.abc'), {
        type: 'auxclick',
        button: 1,
      });

      expect(commands('trackEvent')).toEqual([
        ['trackEvent', 'Service', 'ClickThrough', 'eosc.cyf.abc'],
      ]);
    });

    it('sends the same event for a recommendation, without the flag', () => {
      click(resultLink('service', 'eosc.cyf.abc', true));

      expect(commands('trackEvent')).toEqual([
        ['trackEvent', 'Service', 'ClickThrough', 'eosc.cyf.abc'],
      ]);
    });

    it('sends the event without a name when the result has none', () => {
      click(resultLink('service', ''));

      expect(commands('trackEvent')).toEqual([
        ['trackEvent', 'Service', 'ClickThrough'],
      ]);
    });

    it('sends nothing for other links', () => {
      click('https://marketplace.example.org/services/x');
      click('/search/service?q=*');
      click('api/web/search-results?resource_type=service');

      expect(commands('trackEvent')).toEqual([]);
    });

    it('sends nothing on a right click, which only opens the context menu', () => {
      click(resultLink('service', 'eosc.cyf.abc'), {
        type: 'auxclick',
        button: 2,
      });

      expect(commands('trackEvent')).toEqual([]);
    });

    it.each([
      ['service', 'Service'],
      ['data source', 'DataSource'],
      ['data-source', 'DataSource'],
      ['provider', 'Provider'],
      ['catalogue', 'Catalogue'],
      ['bundle', 'Bundle'],
      ['publication', 'Publication'],
      ['dataset', 'Dataset'],
      ['software', 'Software'],
      ['other', 'OtherResearchProduct'],
      ['training', 'Training'],
      ['guideline', 'Guideline'],
      ['project', 'Project'],
      ['organisation', 'Organisation'],
    ])('files a %s click-through under %s', (resourceType, category) => {
      click(resultLink(resourceType, 'name'));

      expect(commands('trackEvent')).toEqual([
        ['trackEvent', category, 'ClickThrough', 'name'],
      ]);
    });
  });

  describe('click-throughs on search results', () => {
    beforeEach(() => matomo.start(MATOMO_ON));

    const water = (type: string) => ({
      id: 'resource-id',
      title: 'Water quality',
      type: { label: type, value: type },
      redirectUrl: 'https://marketplace.example.org/services/water',
    });

    it.each(['title', 'learnMore'] as const)(
      'sends a ClickThrough event when the %s link is clicked',
      (which) => {
        const result = renderResult(water('service'), 'eosc.cyf.water');
        expect(links(result)[which].getAttribute('href')).toBe(
          'https://marketplace.example.org/services/water'
        );

        clickOn(links(result)[which]);

        expect(commands('trackEvent')).toEqual([
          ['trackEvent', 'Service', 'ClickThrough', 'eosc.cyf.water'],
        ]);
      }
    );

    it('sends a ClickThrough event on a middle click', () => {
      clickOn(links(renderResult(water('data-source'), 'eosc.cyf.ds')).title, {
        type: 'auxclick',
        button: 1,
      });

      expect(commands('trackEvent')).toEqual([
        ['trackEvent', 'DataSource', 'ClickThrough', 'eosc.cyf.ds'],
      ]);
    });

    it('sends the event without a name when the result has none', () => {
      clickOn(links(renderResult(water('service'), '')).title);

      expect(commands('trackEvent')).toEqual([
        ['trackEvent', 'Service', 'ClickThrough'],
      ]);
    });
  });

  describe('click-through names', () => {
    beforeEach(() => matomo.start(MATOMO_ON));

    /** Clicks a result in the result list, which links straight to it */
    const clickSearchResult = (result: IResult) =>
      clickOn(links(renderResult(result, clickThroughName(result))).title);
    /** Clicks a search suggestion, which links through /navigate */
    const clickSuggestion = (result: IResult) =>
      click(
        redirect.internalUrl(
          result.redirectUrl,
          result.id,
          result.type.value,
          '',
          false,
          clickThroughName(result)
        )
      );

    // Marketplace resources are named by PID, not by their slug or their
    // shifted ESS id
    const service = {
      id: '1234',
      pid: 'cyf.svc',
      slug: 'water-service',
      type: 'service',
    };
    const dataSource = {
      id: '10001234',
      pid: 'cyf.ds',
      slug: 'cyf-data',
      type: 'data source',
    };
    const provider = { id: '100012', pid: 'cyf', type: 'provider' };
    // Bundle ids are random, so bundles are named by service id and iid
    const bundle = { id: '1000077', service_id: 77, iid: [3], type: 'bundle' };
    const publication = { id: '50|doi_::ab12', type: 'publication' };
    const guideline = { id: 'ig-1', type: 'interoperability guideline' };
    const project = { id: '40|corda__h2020::123', type: 'project' };

    const cases: [string, IAdapter, object, string, string][] = [
      ['a service', servicesAdapter, service, 'Service', 'cyf.svc'],
      [
        'a data source in services',
        servicesAdapter,
        dataSource,
        'DataSource',
        'cyf.ds',
      ],
      ['a data source', dataSourcesAdapter, dataSource, 'DataSource', 'cyf.ds'],
      ['a provider', providersAdapter, provider, 'Provider', 'cyf'],
      ['a bundle', bundlesAdapter, bundle, 'Bundle', '77:3'],
      [
        'a publication',
        publicationsAdapter,
        publication,
        'Publication',
        '50|doi_::ab12',
      ],
      ['a guideline', guidelinesAdapter, guideline, 'Guideline', 'ig-1'],
      [
        'a project',
        projectsAdapter,
        project,
        'Project',
        '40|corda__h2020::123',
      ],
      [
        'a service in "all"',
        allCollectionsAdapter,
        service,
        'Service',
        'cyf.svc',
      ],
      [
        'a data source in "all"',
        allCollectionsAdapter,
        dataSource,
        'DataSource',
        'cyf.ds',
      ],
      [
        'a provider in "all"',
        allCollectionsAdapter,
        provider,
        'Provider',
        'cyf',
      ],
      ['a bundle in "all"', allCollectionsAdapter, bundle, 'Bundle', '77:3'],
      [
        'a publication in "all"',
        allCollectionsAdapter,
        publication,
        'Publication',
        '50|doi_::ab12',
      ],
      [
        'a guideline in "all"',
        allCollectionsAdapter,
        guideline,
        'Guideline',
        'ig-1',
      ],
    ];

    // Project cards format dates with moment, whose default import this Jest
    // setup can't load; projects are named the same way in suggestions
    const searchResultCases = cases.filter(([label]) => label !== 'a project');

    it.each(searchResultCases)(
      'names %s search result by a stable key',
      (_, adapter, doc, category, name) => {
        clickSearchResult(adapter.adapter(doc as { id: string }));

        expect(commands('trackEvent')).toEqual([
          ['trackEvent', category, 'ClickThrough', name],
        ]);
      }
    );

    it.each(cases)(
      'names %s suggestion by a stable key',
      (_, adapter, doc, category, name) => {
        clickSuggestion(adapter.adapter(doc as { id: string }));

        expect(commands('trackEvent')).toEqual([
          ['trackEvent', category, 'ClickThrough', name],
        ]);
      }
    );

    it('sends no name for a service without a PID', () => {
      clickSearchResult(servicesAdapter.adapter({ ...service, pid: '' }));

      expect(commands('trackEvent')).toEqual([
        ['trackEvent', 'Service', 'ClickThrough'],
      ]);
    });
  });
});
