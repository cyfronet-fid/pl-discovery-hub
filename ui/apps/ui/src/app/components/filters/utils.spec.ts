import { IFilterNode } from '@collections/repositories/types';
import { describe, expect, it } from '@jest/globals';

import { flatNodesToTree } from './utils';

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
});
