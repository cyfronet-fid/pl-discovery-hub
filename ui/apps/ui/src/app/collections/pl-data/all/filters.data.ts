import { allCollectionsFilters } from '../../data/all/filters.data';
import { IFiltersConfig } from '../../repositories/types';

export const plAllCollectionsFilters: IFiltersConfig = {
  ...allCollectionsFilters,
  filters: [
    ...allCollectionsFilters.filters,
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
