import { datasetsFilters } from '../../data/datasets/filters.data';
import { IFiltersConfig } from '../../repositories/types';

export const plDatasetsFilters: IFiltersConfig = {
  ...datasetsFilters,
  filters: [
    ...datasetsFilters.filters,
    {
      id: 'affiliation',
      filter: 'affiliation',
      label: 'Affiliation',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
      expandArrow: true,
    },
    {
      id: 'affiliation',
      filter: 'affiliation',
      label: 'Affiliation',
      type: 'tag',
      defaultCollapsed: false,
      tooltipText: '',
    },
  ],
};
