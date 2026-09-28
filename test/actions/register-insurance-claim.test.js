const handler = require('../../actions/register-insurance-claim/index.js');

const validArgs = {
  claim_type: 'health reimbursement',
  policy_number: 'OG-24-1901-8402-00000001',
  incident_date: '2026-09-21',
  incident_location: 'Ruby Hall Clinic, Pune',
  incident_summary: 'Father hospitalised for treatment; claiming admission and treatment expenses.',
  claimant_contact: { phone: '+91-98200-00000', email: 'claimant@example.com' },
  documents_available: ['Discharge summary', 'Itemised hospital bills'],
};

describe('register_insurance_claim handler', () => {
  test('returns content block shape on happy path', async () => {
    const out = await handler(validArgs);
    expect(out).toHaveProperty('content');
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"start a health insurance claim for his treatment" registers a claim', async () => {
    const out = await handler(validArgs);
    expect(out.content[0].text.length).toBeGreaterThan(0);
    expect(out.structuredContent.confirmation_id).toEqual(expect.any(String));
    expect(out.structuredContent.status).toEqual(expect.any(String));
    expect(out.structuredContent.next_step_url).toMatch(/^https?:\/\//);
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler(validArgs);
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
  });

  test('adapts required documents to the claim pathway', async () => {
    const out = await handler(validArgs);
    expect(Array.isArray(out.structuredContent.required_documents)).toBe(true);
    expect(out.structuredContent.required_documents).toContain('Discharge summary');
    // documents_available should not appear in missing_documents
    expect(out.structuredContent.missing_documents).not.toContain('Discharge summary');
    expect(out.structuredContent.assistance_channel).toEqual(expect.any(String));
  });

  test('motor claim resolves a different document set and assistance channel', async () => {
    const out = await handler({
      ...validArgs,
      claim_type: 'motor accident',
      documents_available: [],
    });
    expect(out.structuredContent.required_documents).toContain('Driving licence');
    expect(out.structuredContent.assistance_channel).toMatch(/motor|roadside/i);
    // nothing supplied → everything required is still missing
    expect(out.structuredContent.missing_documents.length).toBe(out.structuredContent.required_documents.length);
  });

  test('returns error message when claim_type is missing', async () => {
    const out = await handler({ ...validArgs, claim_type: '' });
    expect(out.content[0].text).toMatch(/claim_type|provide/i);
    expect(out.structuredContent.confirmation_id).toBeNull();
  });

  test('returns error message when policy_number is missing', async () => {
    const out = await handler({ ...validArgs, policy_number: '' });
    expect(out.content[0].text).toMatch(/policy_number|provide/i);
    expect(out.structuredContent.confirmation_id).toBeNull();
  });

  test('returns error message when claimant_contact is missing', async () => {
    const out = await handler({ ...validArgs, claimant_contact: null });
    expect(out.content[0].text).toMatch(/contact|provide/i);
    expect(out.structuredContent.confirmation_id).toBeNull();
  });

  test('every return path shares the same structuredContent key shape', async () => {
    const ok = await handler(validArgs);
    const err = await handler({});
    expect(Object.keys(err.structuredContent).sort()).toEqual(Object.keys(ok.structuredContent).sort());
  });

  test('message states registration does not confirm approval', async () => {
    const out = await handler(validArgs);
    expect(out.structuredContent.message).toMatch(/does not confirm/i);
  });
});
