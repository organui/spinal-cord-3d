import { describe, expect, test } from 'bun:test'
import { emphasis, structures } from '../src/anatomy'

describe('selection emphasis', () => {
  test('keeps every structure normal without a selection', () => {
    expect(structures.every((s) => emphasis(s.id, null) === 'normal')).toBe(true)
  })

  test('keeps the selection solid and ghosts everything else', () => {
    const states = structures.map((s) => emphasis(s.id, 'spinal-cord'))
    expect(states.filter((s) => s === 'selected')).toHaveLength(1)
    expect(emphasis('spinal-cord', 'spinal-cord')).toBe('selected')
    expect(emphasis('vertebra-t6', 'spinal-cord')).toBe('ghosted')
  })
})

describe('source ownership', () => {
  test('assigns every source element to exactly one structure', () => {
    const elements = structures.flatMap((s) => s.elements)
    expect(new Set(elements).size).toBe(elements.length)
  })
})

describe('spinal column', () => {
  test('lists every vertebra from the atlas to L5 and one disc below each from C2', () => {
    const vertebrae = structures.filter((s) => s.id.startsWith('vertebra-'))
    const discs = structures.filter((s) => s.group === 'Intervertebral discs')
    expect(vertebrae).toHaveLength(24)
    expect(discs).toHaveLength(23)
    expect(discs.at(-1)!.name).toBe('L5–S1 disc')
  })
})
