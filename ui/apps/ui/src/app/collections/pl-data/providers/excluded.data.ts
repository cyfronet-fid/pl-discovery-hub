import { URL_PARAM_NAME } from '../../data/providers/nav-config.data';
import { IExcludedFiltersConfig } from '../../repositories/types';

export const plExcludedProvidersFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: [
    'scientific_domains',
    'areas_of_activity',
    'node',
    'meril_scientific_domains',
    'keywords',
  ],
};
