import { describe, expect, test } from 'bun:test'
import {
  anatomyTree,
  assertAnatomyMapping,
  groupIds,
  hiddenFromVisibility,
  normalizeVisibility,
  sceneIdsForNode,
  visibilityFromHidden,
} from './anatomy-adapter'
import { structures } from './anatomy'

describe('anatomy tree adapter', () => {
  test('groups every structure exactly once under interface group rows', () => {
    expect(groupIds).toEqual([
      'group-cord-and-brainstem',
      'group-spinal-nerves',
      'group-cervical-vertebrae',
      'group-thoracic-vertebrae',
      'group-lumbar-vertebrae-and-sacrum',
      'group-intervertebral-discs',
      'group-vessels',
    ])
    expect(anatomyTree.flatMap((group) => group.children!.map(({ id }) => id)).sort()).toEqual(
      structures.map(({ id }) => id).sort(),
    )
  })

  test('marks group rows as non-selectable and colours leaves like their meshes', () => {
    for (const group of anatomyTree) {
      expect(group.selectable).toBe(false)
      expect(group.color).toBeUndefined()
      for (const leaf of group.children!) {
        expect(leaf.selectable).toBeUndefined()
        expect(leaf.color).toBe(structures.find(({ id }) => id === leaf.id)!.color)
      }
    }
  })

  test('maps group rows to their scene leaves and leaves to themselves', () => {
    expect(sceneIdsForNode('group-cord-and-brainstem')).toEqual([
      'spinal-cord',
      'medulla-oblongata',
    ])
    expect(sceneIdsForNode('sacrum')).toEqual(['sacrum'])
    expect(sceneIdsForNode('unknown')).toEqual([])
    expect(sceneIdsForNode(null)).toEqual([])
  })

  test('treats missing visibility entries as visible', () => {
    const visibility = normalizeVisibility({ sacrum: false })
    expect(visibility.sacrum).toBe(false)
    expect(visibility['spinal-cord']).toBe(true)
    expect(Object.keys(visibility)).toHaveLength(structures.length)
  })

  test('round-trips the hidden set through the tree visibility map', () => {
    const hidden = new Set(['spinal-cord', 'vertebra-l1'])
    const visibility = visibilityFromHidden(hidden)
    expect(visibility).toEqual({ 'spinal-cord': false, 'vertebra-l1': false })
    expect(hiddenFromVisibility(visibility)).toEqual(hidden)
    expect(hiddenFromVisibility({ sacrum: true })).toEqual(new Set())
  })

  test('rejects missing, unknown, and duplicate leaves', () => {
    expect(() => assertAnatomyMapping()).not.toThrow()
    const [first, ...rest] = anatomyTree
    expect(() => assertAnatomyMapping(rest)).toThrow(/missing=spinal-cord/)
    expect(() => assertAnatomyMapping([...anatomyTree, { id: 'coccyx', label: 'Coccyx' }])).toThrow(
      /unknown=coccyx/,
    )
    expect(() =>
      assertAnatomyMapping([...anatomyTree, { id: 'g', label: 'Again', children: [first] }]),
    ).toThrow(/duplicates=spinal-cord/)
  })
})
