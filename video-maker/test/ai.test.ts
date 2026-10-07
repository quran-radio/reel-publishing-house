import { ridgeway_boss } from "../src/ai";
import { expect, test } from 'vitest'

test('testing length of Ai generated response', async () => {
    const response = await ridgeway_boss()
    const content = response.toFormattedString()
    // prompt specifies max 30 words, so 40 is used as an upper limit
    expect(content.split(' ').length).toBeLessThanOrEqual(40)
})