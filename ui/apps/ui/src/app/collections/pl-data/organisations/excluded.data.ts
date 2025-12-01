import { URL_PARAM_NAME } from '../../data/organisations/nav-config.data';
import { IExcludedFiltersConfig } from '../../repositories/types';

export const plExcludedOrganisationsFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: ['node', 'scientific_domains', 'keywords', 'legal_status'],
};
