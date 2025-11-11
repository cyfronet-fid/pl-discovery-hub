import { URL_PARAM_NAME } from '../../data/software/nav-config.data';
import { IExcludedFiltersConfig } from '../../repositories/types';

export const plExcludedSoftwareFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: [
    'best_access_right',
    'scientific_domains',
    'eosc_if',
    'country',
    'funder',
    'sdg',
    'license',
    'pids',
  ],
};
