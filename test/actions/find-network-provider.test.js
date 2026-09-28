const handler = require('../../actions/find-network-provider/index.js');

describe('find_network_provider handler', () => {
  test('content is an array of text blocks', async () => {
    const out = await handler({ provider_type: 'network hospital' });
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"Find Bajaj General network hospitals in Pune" returns providers', async () => {
    const out = await handler({ provider_type: 'network hospital', city: 'Pune' });
    expect(out.content[0].text.length).toBeGreaterThan(0);
    expect(out.structuredContent).toHaveProperty('providers');
    expect(Array.isArray(out.structuredContent.providers)).toBe(true);
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler({ provider_type: 'network hospital' });
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
  });

  test('returns error message when required provider_type is missing', async () => {
    const out = await handler({});
    expect(out.content[0].text).toMatch(/provider_type|provide/i);
    expect(out.structuredContent.providers).toEqual([]);
  });

  test('providers carry latitude/longitude for the map surface', async () => {
    const out = await handler({ provider_type: 'network hospital' });
    out.structuredContent.providers.forEach((p) => {
      expect(p).toHaveProperty('latitude');
      expect(p).toHaveProperty('longitude');
    });
  });

  test('a non-matching provider_name yields an empty providers array', async () => {
    const out = await handler({ provider_type: 'network hospital', provider_name: 'no-such-hospital-xyz' });
    expect(out.structuredContent.providers).toEqual([]);
    expect(out.content[0].text).toMatch(/no network providers found/i);
  });
});
