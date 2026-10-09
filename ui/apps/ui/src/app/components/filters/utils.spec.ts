import { IFilterNode } from '@collections/repositories/types';
import { describe, expect, it, jest } from '@jest/globals';

import { flatNodesToTree } from './utils';

jest.mock('@collections/filters-serializers/utils', () => ({
  queryChanger: jest.fn(),
}));

describe('flatNodesToTree', () => {
  const zeroCountNode = (filter: string): IFilterNode => ({
    id: 'value',
    name: 'Value',
    value: 'value',
    filter,
    count: '0',
    isSelected: false,
    level: 0,
  });

  it('keeps zero-count node values and removes them for other filters', () => {
    expect(flatNodesToTree([zeroCountNode('node')])).toHaveLength(1);
    expect(flatNodesToTree([zeroCountNode('category')])).toEqual([]);
  });

  it('places EOSC PL first and sorts the remaining nodes alphabetically', () => {
    const node = (value: string): IFilterNode => ({
      ...zeroCountNode('node'),
      id: value,
      name: value,
      value,
    });

    expect(
      flatNodesToTree([node('LifeWatch'), node('EOSC PL'), node('CESSDA')]).map(
        ({ value }) => value
      )
    ).toEqual(['EOSC PL', 'CESSDA', 'LifeWatch']);
  });
});
