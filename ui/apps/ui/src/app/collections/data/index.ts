import {
  IAdapter,
  ICollectionNavConfig,
  ICollectionSearchMetadata,
  IExcludedFiltersConfig,
  IFiltersConfig,
} from '../repositories/types';
import { guidelinesNavConfig } from './guidelines/nav-config.data';
import { providersNavConfig } from '@collections/data/providers/nav-config.data';
import {
  URL_PARAM_NAME as ALL_COLLECTIONS_URL_PARAM_NAME,
  allCollectionsNavConfig,
} from './all/nav-config.data';
import { publicationsNavConfig } from './publications/nav-config.data';
import { datasetsNavConfig } from './datasets/nav-config.data';
import { softwareNavConfig } from './software/nav-config.data';
import { dataSourcesNavConfig } from './data-sources/nav-config.data';
import { servicesNavConfig } from '@collections/data/services/nav-config.data';

import { guidelinesAdapter } from './guidelines/adapter.data';
import { allCollectionsAdapter } from './all/adapter.data';
import { publicationsAdapter } from './publications/adapter.data';
import { datasetsAdapter } from './datasets/adapter.data';
import { softwareAdapter } from './software/adapter.data';
import { dataSourcesAdapter } from './data-sources/adapter.data';
import { providersAdapter } from '@collections/data/providers/adapter.data';
import { servicesAdapter } from '@collections/data/services/adapter.data';

import { plDatasetsAdapter } from '../pl-data/datasets/adapter.data';
import { plAllCollectionsAdapter } from '../pl-data/all/adapter.data';
import { plProvidersAdapter } from '../pl-data/providers/adapter.data';
import { plServicesAdapter } from '../pl-data/services/adapter.data';
import { plDataSourcesAdapter } from '../pl-data/data-sources/adapter.data';

import { guidelinesSearchMetadata } from './guidelines/search-metadata.data';
import { providersSearchMetadata } from './providers/search-metadata.data';
import { allCollectionsSearchMetadata } from './all/search-metadata.data';
import { publicationsSearchMetadata } from './publications/search-metadata.data';
import { datasetsSearchMetadata } from './datasets/search-metadata.data';
import { softwareSearchMetadata } from './software/search-metadata.data';
import { dataSourcesSearchMetadata } from './data-sources/search-metadata.data';
import { servicesSearchMetadata } from '@collections/data/services/search-metadata.data';

import { allCollectionsFilters } from './all/filters.data';
import { publicationsFilters } from './publications/filters.data';
import { datasetsFilters } from './datasets/filters.data';
import { softwareFilters } from './software/filters.data';
import { dataSourcesFilters } from './data-sources/filters.data';
import { guidelinesFilters } from './guidelines/filters.data';
import { servicesFilters } from '@collections/data/services/filters.data';
import { providersFilters } from '@collections/data/providers/filters.data';

import { plDatasetsFilters } from '../pl-data/datasets/filters.data';
import { plAllCollectionsFilters } from '@collections/pl-data/all/filters.data';

import { excludedPublicationsFilters } from '@collections/data/publications/excluded.data';
import { excludedDatasetsFilters } from '@collections/data/datasets/excluded.data';
import { excludedAllCollectionsFilters } from '@collections/data/all/excluded.data';
import { excludedSoftwareFilters } from '@collections/data/software/excluded.data';
import { excludedServicesFilters } from '@collections/data/services/excluded.data';
import { excludedDataSourcesFilters } from '@collections/data/data-sources/excluded.data';
import { excludedGuidelinesFilters } from '@collections/data/guidelines/excluded.data';
import { excludedProvidersFilters } from '@collections/data/providers/excluded.data';

import { plExcludedDatasetsFilters } from '@collections/pl-data/datasets/excluded.data';
import { plExcludedAllCollectionsFilters } from '@collections/pl-data/all/excluded.data';
import { plExcludedProvidersFilters } from '@collections/pl-data/providers/excluded.data';
import { plExcludedSoftwareFilters } from '@collections/pl-data/software/excluded.data';

import { validateCollections } from '@collections/data/validators';

export const DEFAULT_COLLECTION_ID = ALL_COLLECTIONS_URL_PARAM_NAME;
export const ADAPTERS: IAdapter[] = [
  allCollectionsAdapter,
  datasetsAdapter,
  publicationsAdapter,
  softwareAdapter,
  servicesAdapter,
  dataSourcesAdapter,
  providersAdapter,
  guidelinesAdapter,
];

export const PL_ADAPTERS: IAdapter[] = [
  plAllCollectionsAdapter,
  plDatasetsAdapter,
  publicationsAdapter,
  softwareAdapter,
  plServicesAdapter,
  plDataSourcesAdapter,
  plProvidersAdapter,
  guidelinesAdapter,
];

export const FILTERS: IFiltersConfig[] = [
  allCollectionsFilters,
  datasetsFilters,
  publicationsFilters,
  softwareFilters,
  servicesFilters,
  dataSourcesFilters,
  providersFilters,
  guidelinesFilters,
];

export const PL_FILTERS: IFiltersConfig[] = [
  plAllCollectionsFilters,
  plDatasetsFilters,
  publicationsFilters,
  softwareFilters,
  servicesFilters,
  dataSourcesFilters,
  providersFilters,
  guidelinesFilters,
];

// Excluded filters according to adjustments in
// https://github.com/cyfronet-fid/eosc-search-service/issues/597
export const EXCLUDED_FILTERS: IExcludedFiltersConfig[] = [
  excludedAllCollectionsFilters,
  excludedDatasetsFilters,
  excludedPublicationsFilters,
  excludedSoftwareFilters,
  excludedServicesFilters,
  excludedDataSourcesFilters,
  excludedProvidersFilters,
  excludedGuidelinesFilters,
];

export const PL_EXCLUDED_FILTERS: IExcludedFiltersConfig[] = [
  plExcludedAllCollectionsFilters,
  plExcludedDatasetsFilters,
  excludedPublicationsFilters,
  plExcludedSoftwareFilters,
  excludedServicesFilters,
  excludedDataSourcesFilters,
  plExcludedProvidersFilters,
  excludedGuidelinesFilters,
];

export const NAV_CONFIGS: ICollectionNavConfig[] = [
  allCollectionsNavConfig,
  datasetsNavConfig,
  publicationsNavConfig,
  softwareNavConfig,
  servicesNavConfig,
  dataSourcesNavConfig,
  providersNavConfig,
  guidelinesNavConfig,
];

export const PL_NAV_CONFIGS: ICollectionNavConfig[] = [
  allCollectionsNavConfig,
  datasetsNavConfig,
  publicationsNavConfig,
  softwareNavConfig,
  servicesNavConfig,
  dataSourcesNavConfig,
  providersNavConfig,
  guidelinesNavConfig,
];

export const SEARCH_METADATA: ICollectionSearchMetadata[] = [
  allCollectionsSearchMetadata,
  datasetsSearchMetadata,
  publicationsSearchMetadata,
  softwareSearchMetadata,
  servicesSearchMetadata,
  dataSourcesSearchMetadata,
  providersSearchMetadata,
  guidelinesSearchMetadata,
];

export const PL_SEARCH_METADATA: ICollectionSearchMetadata[] = [
  allCollectionsSearchMetadata,
  datasetsSearchMetadata,
  publicationsSearchMetadata,
  softwareSearchMetadata,
  servicesSearchMetadata,
  dataSourcesSearchMetadata,
  providersSearchMetadata,
  guidelinesSearchMetadata,
];

validateCollections(
  ADAPTERS,
  FILTERS,
  EXCLUDED_FILTERS,
  NAV_CONFIGS,
  SEARCH_METADATA
);

validateCollections(
  PL_ADAPTERS,
  PL_FILTERS,
  PL_EXCLUDED_FILTERS,
  PL_NAV_CONFIGS,
  PL_SEARCH_METADATA
);
