import { datasetsAdapter } from '../../data/datasets/adapter.data';
import { IOpenAIREResult } from '../../data/openair.model';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';

export const plDatasetsAdapter = {
  ...datasetsAdapter,
  adapter: (openAIREResult: Partial<IOpenAIREResult> & { id: string }) => {
    const result = datasetsAdapter.adapter(openAIREResult);
    return {
      ...result,
      redirectUrl: openAIREResult?.url?.[0] || '', // Override the redirectUrl
      tags: [
        ...result.tags,
        {
          label: 'Affiliation',
          values: toValueWithLabel(toArray(openAIREResult?.affiliation)),
          filter: 'affiliation',
        },
      ],
    };
  },
};
