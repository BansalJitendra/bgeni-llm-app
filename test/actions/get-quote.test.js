const handler = require('../../actions/get-quote/index.js');

const validArgs = () => ({
  insurance_type: 'Health Guard',
  applicant_name: 'Asha Kumar',
  mobile_number: '9876543210',
  email_address: 'asha@example.com',
  risk_details: { members: ['self', 'spouse'], city: 'Pune' },
  coverage_preferences: { plan_structure: 'Family floater' },
  consent_to_contact: true,
});

describe('get_quote handler', () => {
  test('returns content block shape on happy path', async () => {
    const out = await handler(validArgs());
    expect(out).toHaveProperty('content');
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"Start my official Bajaj General quote for Health Guard family floater" returns a confirmation', async () => {
    const out = await handler(validArgs());
    expect(out.content[0].text.length).toBeGreaterThan(0);
    expect(out.structuredContent.confirmation_id).toEqual(expect.any(String));
    expect(out.structuredContent.status).toMatch(/received/i);
    expect(out.content[0].text).toMatch(/Health Guard/);
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler(validArgs());
    expect(typeof out.structuredContent).toBe('object');
    expect(out.structuredContent).not.toBeNull();
    expect(Array.isArray(out.structuredContent)).toBe(false);
  });

  test('returns error message when required insurance_type is missing', async () => {
    const args = validArgs();
    delete args.insurance_type;
    const out = await handler(args);
    expect(out.content[0].text).toMatch(/insurance_type|provide/i);
    expect(out.structuredContent.confirmation_id).toBeNull();
  });

  test('returns error message when risk_details is missing', async () => {
    const args = validArgs();
    delete args.risk_details;
    const out = await handler(args);
    expect(out.content[0].text).toMatch(/risk_details|provide/i);
  });

  test('requires consent_to_contact before starting a quote', async () => {
    const args = validArgs();
    args.consent_to_contact = false;
    const out = await handler(args);
    expect(out.content[0].text).toMatch(/consent/i);
    expect(out.structuredContent.confirmation_id).toBeNull();
  });

  test('all structuredContent keys are present on the error branch', async () => {
    const out = await handler({});
    const keys = ['confirmation_id', 'status', 'message', 'estimated_premium', 'currency', 'next_step_url'];
    keys.forEach((k) => expect(out.structuredContent).toHaveProperty(k));
  });

  test('resolves an insurance category to a matched plan reference', async () => {
    const args = validArgs();
    args.insurance_type = 'Motor Insurance';
    const out = await handler(args);
    expect(out.structuredContent.confirmation_id).toEqual(expect.any(String));
    expect(out.structuredContent.currency).toBe('INR');
  });

  test('handles being called with no arguments without throwing', async () => {
    const out = await handler();
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.structuredContent.confirmation_id).toBeNull();
  });
});
