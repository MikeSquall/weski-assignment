import { describe, it, expect } from 'vitest';
import { wsSearchMessageSchema } from '../schemas/search';

describe('wsSearchMessageSchema', () => {
  const valid = {
    type: 'search',
    payload: { skiSite: 4, fromDate: '12/01/2025', toDate: '12/12/2025', groupSize: 2 },
  };

  it('accepts a valid search message', () => {
    const result = wsSearchMessageSchema.parse(valid);
    expect(result.type).toBe('search');
    expect(result.payload.skiSite).toBe(4);
    expect(result.payload.groupSize).toBe(2);
  });

  it('rejects ski site outside 1-5', () => {
    expect(() =>
      wsSearchMessageSchema.parse({ ...valid, payload: { ...valid.payload, skiSite: 99 } })
    ).toThrow();
  });

  it('rejects group size below 1', () => {
    expect(() =>
      wsSearchMessageSchema.parse({ ...valid, payload: { ...valid.payload, groupSize: 0 } })
    ).toThrow();
  });

  it('rejects group size above 10', () => {
    expect(() =>
      wsSearchMessageSchema.parse({ ...valid, payload: { ...valid.payload, groupSize: 11 } })
    ).toThrow();
  });

  it('rejects wrong message type', () => {
    expect(() => wsSearchMessageSchema.parse({ ...valid, type: 'other' })).toThrow();
  });

  it('rejects empty fromDate', () => {
    expect(() =>
      wsSearchMessageSchema.parse({ ...valid, payload: { ...valid.payload, fromDate: '' } })
    ).toThrow();
  });
});
