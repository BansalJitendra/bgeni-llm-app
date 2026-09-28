const handler = require('../../actions/compare-health-insurance-plans/index.js')

describe('compare_health_insurance_plans handler', () => {
    test('content is an array of text blocks', async () => {
        const out = await handler({ first_plan_name: 'Health Guard', second_plan_name: 'My Family Complete' })
        expect(out).toHaveProperty('content')
        expect(Array.isArray(out.content)).toBe(true)
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) })
    })

    test('"Compare Health Guard against My Family Complete" returns exactly two aligned plans', async () => {
        const out = await handler({
            first_plan_name: 'Health Guard',
            second_plan_name: 'My Family Complete',
            customer_context: 'a family of four in Pune',
        })
        expect(out.content[0].text.length).toBeGreaterThan(0)
        expect(Array.isArray(out.structuredContent.plans)).toBe(true)
        expect(out.structuredContent.plans).toHaveLength(2)
        expect(out.structuredContent.plans[0].name).toBe('Health Guard')
        expect(out.structuredContent.plans[1].name).toBe('My Family Complete')
        expect(out.structuredContent.comparison_title).toMatch(/Health Guard.*My Family Complete/)
    })

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({ first_plan_name: 'Health Guard', second_plan_name: 'My Family Complete' })
        expect(typeof out.structuredContent).toBe('object')
        expect(Array.isArray(out.structuredContent)).toBe(false)
    })

    test('surfaces material differences in key_differences', async () => {
        const out = await handler({ first_plan_name: 'Health Guard', second_plan_name: 'My Family Complete' })
        expect(Array.isArray(out.structuredContent.key_differences)).toBe(true)
        expect(out.structuredContent.key_differences.length).toBeGreaterThan(0)
    })

    test('returns error message when a required arg is missing', async () => {
        const out = await handler({ first_plan_name: 'Health Guard' })
        expect(out.content[0].text).toMatch(/first_plan_name|second_plan_name|provide/i)
        expect(out.structuredContent.plans).toEqual([])
    })

    test('unknown plan name yields a not-found message and empty plans', async () => {
        const out = await handler({ first_plan_name: 'Health Guard', second_plan_name: 'Nonexistent Plan XYZ' })
        expect(out.content[0].text).toMatch(/could not find|check the plan/i)
        expect(out.structuredContent.plans).toEqual([])
    })

    test('every return path carries the same structuredContent key shape', async () => {
        const ok = await handler({ first_plan_name: 'Health Guard', second_plan_name: 'My Family Complete' })
        const missing = await handler({})
        const notFound = await handler({ first_plan_name: 'Nope', second_plan_name: 'Health Guard' })
        for (const out of [ok, missing, notFound]) {
            expect(Object.keys(out.structuredContent).sort()).toEqual(
                ['comparison_title', 'key_differences', 'next_step', 'plans'],
            )
        }
    })

    test('partial/case-insensitive plan name still resolves', async () => {
        const out = await handler({ first_plan_name: 'health guard', second_plan_name: 'my family complete' })
        expect(out.structuredContent.plans).toHaveLength(2)
    })
})
