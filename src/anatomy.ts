export type Group =
  | 'Cord and brainstem'
  | 'Spinal nerves'
  | 'Cervical vertebrae'
  | 'Thoracic vertebrae'
  | 'Lumbar vertebrae and sacrum'
  | 'Intervertebral discs'
  | 'Vessels'

export type Structure = {
  id: string
  fma: string
  name: string
  sourceName: string
  group: Group
  // Official 4.3 IS-A concepts this structure draws its source meshes from.
  concepts: string[]
  // FJ element files; each element belongs to exactly one structure.
  elements: string[]
  color: string
  description: string
  note: string
}

export const anatomySource =
  'https://training.seer.cancer.gov/anatomy/nervous/organization/spinalcord.html'

// Adjacent bones and discs alternate between two tones so neighbours stay
// distinguishable when the whole column is shown.
const boneTones: Record<string, [string, string]> = {
  C: ['#d8c7a2', '#c8b48a'],
  T: ['#d4c09a', '#c3ad83'],
  L: ['#d0bb93', '#bfa77c'],
}
const discTones = ['#7fa6bf', '#9bbdd2']
const nerveTones = ['#e2a63c', '#efc25e']

type Vertebra = [label: string, name: string, fma: string, element: string]
const vertebrae: Vertebra[] = [
  ['C1', 'Atlas', 'FMA12519', 'FJ3176'],
  ['C2', 'Axis', 'FMA12520', 'FJ3177'],
  ['C3', 'Third cervical vertebra', 'FMA12521', 'FJ3161'],
  ['C4', 'Fourth cervical vertebra', 'FMA12522', 'FJ3164'],
  ['C5', 'Fifth cervical vertebra', 'FMA12523', 'FJ3167'],
  ['C6', 'Sixth cervical vertebra', 'FMA12524', 'FJ3170'],
  ['C7', 'Seventh cervical vertebra', 'FMA12525', 'FJ3172'],
  ['T1', 'First thoracic vertebra', 'FMA9165', 'FJ3158'],
  ['T2', 'Second thoracic vertebra', 'FMA9187', 'FJ3160'],
  ['T3', 'Third thoracic vertebra', 'FMA9209', 'FJ3163'],
  ['T4', 'Fourth thoracic vertebra', 'FMA9248', 'FJ3166'],
  ['T5', 'Fifth thoracic vertebra', 'FMA9922', 'FJ3169'],
  ['T6', 'Sixth thoracic vertebra', 'FMA9945', 'FJ3171'],
  ['T7', 'Seventh thoracic vertebra', 'FMA9968', 'FJ3173'],
  ['T8', 'Eighth thoracic vertebra', 'FMA9991', 'FJ3174'],
  ['T9', 'Ninth thoracic vertebra', 'FMA10014', 'FJ3175'],
  ['T10', 'Tenth thoracic vertebra', 'FMA10037', 'FJ3154'],
  ['T11', 'Eleventh thoracic vertebra', 'FMA10059', 'FJ3155'],
  ['T12', 'Twelfth thoracic vertebra', 'FMA10081', 'FJ3156'],
  ['L1', 'First lumbar vertebra', 'FMA13072', 'FJ3157'],
  ['L2', 'Second lumbar vertebra', 'FMA13073', 'FJ3159'],
  ['L3', 'Third lumbar vertebra', 'FMA13074', 'FJ3162'],
  ['L4', 'Fourth lumbar vertebra', 'FMA13075', 'FJ3165'],
  ['L5', 'Fifth lumbar vertebra', 'FMA13076', 'FJ3168'],
]

const regionText = {
  C: {
    group: 'Cervical vertebrae' as const,
    description:
      'A neck vertebra. Its small body carries the head, and openings in its transverse processes let the vertebral artery pass.',
  },
  T: {
    group: 'Thoracic vertebrae' as const,
    description:
      'A vertebra of the upper back. Ribs attach to its sides, and its long spinous process slopes downward.',
  },
  L: {
    group: 'Lumbar vertebrae and sacrum' as const,
    description:
      'A vertebra of the lower back. Its large body carries most of the weight of the upper body.',
  },
}

const special: Record<string, string> = {
  C1: 'The first vertebra. It is a ring with no body and holds up the skull; the head nods on it.',
  C2: 'The second vertebra. Its upward peg, the dens, lets the atlas and head turn from side to side.',
  C7: 'The lowest neck vertebra. Its long spinous process is the bump you can feel at the base of the neck.',
}

const vertebraStructures: Structure[] = vertebrae.map(([label, name, fma, element], index) => {
  const region = label[0] as 'C' | 'T' | 'L'
  return {
    id: `vertebra-${label.toLowerCase()}`,
    fma,
    name: label === 'C1' || label === 'C2' ? `${name} (${label})` : `${label} vertebra`,
    sourceName: name.toLowerCase(),
    group: regionText[region].group,
    concepts: [fma],
    elements: [element],
    color: boneTones[region][index % 2],
    description: special[label] ?? regionText[region].description,
    note: 'Shown as one bone surface. The spinal cord runs through the vertebral canal behind its body.',
  }
})

// Each disc lies below the vertebra it is named after in the source.
type Disc = [upper: string, lower: string, sourceName: string, fma: string, element: string]
const discs: Disc[] = [
  ['C2', 'C3', 'intervertebral disk of axis', 'FMA25058', 'FJ3202'],
  ['C3', 'C4', 'intervertebral disk of third cervical vertebra', 'FMA13896', 'FJ3213'],
  ['C4', 'C5', 'intervertebral disk of fourth cervical vertebra', 'FMA13897', 'FJ3218'],
  ['C5', 'C6', 'intervertebral disk of fifth cervical vertebra', 'FMA13898', 'FJ3219'],
  ['C6', 'C7', 'intervertebral disk of sixth cervical vertebra', 'FMA13899', 'FJ3220'],
  ['C7', 'T1', 'intervertebral disk of seventh cervical vertebra', 'FMA13900', 'FJ3221'],
  ['T1', 'T2', 'intervertebral disk of first thoracic vertebra', 'FMA10458', 'FJ3222'],
  ['T2', 'T3', 'intervertebral disk of second thoracic vertebra', 'FMA13495', 'FJ3223'],
  ['T3', 'T4', 'intervertebral disk of third thoracic vertebra', 'FMA13500', 'FJ3224'],
  ['T4', 'T5', 'intervertebral disk of fourth thoracic vertebra', 'FMA13501', 'FJ3203'],
  ['T5', 'T6', 'intervertebral disk of fifth thoracic vertebra', 'FMA13502', 'FJ3204'],
  ['T6', 'T7', 'intervertebral disk of sixth thoracic vertebra', 'FMA13503', 'FJ3205'],
  ['T7', 'T8', 'intervertebral disk of seventh thoracic vertebra', 'FMA13504', 'FJ3206'],
  ['T8', 'T9', 'intervertebral disk of eighth thoracic vertebra', 'FMA13505', 'FJ3207'],
  ['T9', 'T10', 'intervertebral disk of ninth thoracic vertebra', 'FMA13506', 'FJ3208'],
  ['T10', 'T11', 'intervertebral disk of tenth thoracic vertebra', 'FMA13507', 'FJ3209'],
  ['T11', 'T12', 'intervertebral disk of eleventh thoracic vertebra', 'FMA13508', 'FJ3210'],
  ['T12', 'L1', 'intervertebral disk of twelfth thoracic vertebra', 'FMA13509', 'FJ3211'],
  ['L1', 'L2', 'intervertebral disk of first lumbar vertebra', 'FMA16033', 'FJ3212'],
  ['L2', 'L3', 'intervertebral disk of second lumbar vertebra', 'FMA16034', 'FJ3214'],
  ['L3', 'L4', 'intervertebral disk of third lumbar vertebra', 'FMA16035', 'FJ3215'],
  ['L4', 'L5', 'intervertebral disk of fourth lumbar vertebra', 'FMA16036', 'FJ3216'],
  ['L5', 'S1', 'intervertebral disk of fifth lumbar vertebra', 'FMA16037', 'FJ3217'],
]

const discStructures: Structure[] = discs.map(([upper, lower, sourceName, fma, element], i) => ({
  id: `disc-${upper.toLowerCase()}-${lower.toLowerCase()}`,
  fma,
  name: `${upper}–${lower} disc`,
  sourceName,
  group: 'Intervertebral discs',
  concepts: [fma],
  elements: [element],
  color: discTones[i % 2],
  description:
    lower === 'S1'
      ? 'The lowest disc, between the last lumbar vertebra and the sacrum. It carries the greatest load of any disc.'
      : `A cushion of fibrocartilage between the ${upper} and ${lower} vertebral bodies. It absorbs shock and lets the spine bend.`,
  note: 'The tough outer ring and the soft core are one surface in the source.',
}))

// Only the left-side spinal nerves from C1 to T2 exist as meshes in BodyParts3D 4.3.
type Nerve = [label: string, sourceName: string, fma: string, element: string]
const nerves: Nerve[] = [
  ['C1', 'left first cervical nerve', 'FMA6442', 'FJ4260'],
  ['C2', 'trunk of left second cervical nerve', 'FMA7003', 'FJ4261'],
  ['C3', 'trunk of left third cervical nerve', 'FMA7005', 'FJ4262'],
  ['C4', 'trunk of left fourth cervical nerve', 'FMA7007', 'FJ4263'],
  ['C5', 'trunk of left fifth cervical nerve', 'FMA24105', 'FJ4264'],
  ['C6', 'trunk of left sixth cervical nerve', 'FMA7011', 'FJ4265'],
  ['C7', 'trunk of left seventh cervical nerve', 'FMA7013', 'FJ4266'],
  ['C8', 'trunk of left eighth cervical nerve', 'FMA7015', 'FJ4267'],
  ['T1', 'trunk of left first thoracic nerve', 'FMA7023', 'FJ4245'],
  ['T2', 'trunk of left second thoracic nerve', 'FMA7025', 'FJ4248'],
]

const nerveText: Record<string, string> = {
  C1: 'Leaves the spinal cord between the skull and the atlas. It mostly supplies small muscles at the top of the neck.',
  C4: 'Leaves between the third and fourth cervical vertebrae. With C3 and C5 it forms the phrenic nerve, which works the diaphragm.',
  C8: 'There are eight cervical nerves but only seven cervical vertebrae, so C8 leaves below C7, above T1.',
}

const nerveStructures: Structure[] = nerves.map(([label, sourceName, fma, element], i) => ({
  id: `nerve-${label.toLowerCase()}`,
  fma,
  name: `${label} spinal nerve (left)`,
  sourceName,
  group: 'Spinal nerves',
  concepts: [fma],
  elements: [element],
  color: nerveTones[i % 2],
  description:
    nerveText[label] ??
    (label.startsWith('C')
      ? `Leaves the spinal canal through the opening above the ${label} vertebra and carries signals to and from the neck, shoulder and arm.`
      : `Leaves the spinal canal below the ${label} vertebra. Its branches run along the ribs and also join the nerves of the arm.`),
  note: 'Only the left side is modelled in the source. The right-side nerves and all nerves below T2 are not available.',
}))

export const structures: Structure[] = [
  {
    id: 'spinal-cord',
    fma: 'FMA242005',
    name: 'Spinal cord',
    sourceName: 'neural tissue of spinal cord',
    group: 'Cord and brainstem',
    concepts: ['FMA242005'],
    elements: ['FJ4426'],
    color: '#f1c75b',
    description:
      'A column of nerve tissue that carries signals between the brain and the body. It runs inside the vertebral canal from the skull to about the first lumbar vertebra.',
    note: 'Its surface is shown without the protective membranes (meninges) or the fluid around it.',
  },
  {
    id: 'medulla-oblongata',
    fma: 'FMA62004',
    name: 'Medulla oblongata',
    sourceName: 'medulla oblongata',
    group: 'Cord and brainstem',
    concepts: ['FMA62004'],
    elements: ['FJ1769', 'FJ1831'],
    color: '#d99f6c',
    description:
      'The lowest part of the brainstem. It continues into the spinal cord at the opening in the base of the skull.',
    note: 'Included to show where the cord begins. The source models it as left and right halves, shown here as one structure.',
  },
  ...nerveStructures,
  {
    id: 'brachial-plexus',
    fma: 'FMA65364',
    name: 'Brachial plexus (left)',
    sourceName: 'trunks and cords of left brachial nerve plexus',
    group: 'Spinal nerves',
    concepts: ['FMA65362', 'FMA65366', 'FMA65364', 'FMA45239', 'FMA45241', 'FMA45243'],
    elements: ['FJ4290', 'FJ4276', 'FJ4273', 'FJ4274', 'FJ4275', 'FJ4280'],
    color: '#cf8a3a',
    description:
      'A network formed by the C5 to T1 nerves. Its trunks and cords regroup the fibres into the nerves of the shoulder and arm.',
    note: 'Six source meshes (superior, middle and inferior trunks; lateral, medial and posterior cords) are grouped as one selectable set. The arm nerves beyond the cords are omitted.',
  },
  {
    id: 'cauda-equina',
    fma: 'FMA52590',
    name: 'Cauda equina',
    sourceName: 'cauda equina',
    group: 'Spinal nerves',
    concepts: ['FMA52590'],
    elements: ['FJ4425'],
    color: '#e9d48e',
    description:
      'The bundle of nerve roots below the end of the cord. Its name means horse’s tail. The roots run down the canal to leave at the lumbar and sacral levels.',
    note: 'The roots are modelled as one bundle, so individual lumbar and sacral roots cannot be selected.',
  },
  ...vertebraStructures,
  {
    id: 'sacrum',
    fma: 'FMA16202',
    name: 'Sacrum',
    sourceName: 'sacrum',
    group: 'Lumbar vertebrae and sacrum',
    concepts: ['FMA16202'],
    elements: ['FJ3393'],
    color: '#c7b28a',
    description:
      'Five vertebrae fused into one triangular bone at the back of the pelvis. The lowest nerve roots leave through its openings.',
    note: 'The coccyx (tailbone) has no mesh in the source and is omitted.',
  },
  ...discStructures,
  {
    id: 'vertebral-arteries',
    fma: 'FMA76261',
    name: 'Vertebral arteries',
    sourceName: 'trunks of right and left vertebral arteries',
    group: 'Vessels',
    concepts: ['FMA76261', 'FMA76262'],
    elements: ['FJ1725', 'FJ1725M'],
    color: '#b8564c',
    description:
      'Two arteries that climb through openings in the cervical vertebrae and enter the skull, where they help supply the brainstem and the top of the spinal cord.',
    note: 'Both sides are grouped as one selectable set. The left vessel is the source’s mirrored copy of the right.',
  },
]

export const groups: readonly Group[] = [
  'Cord and brainstem',
  'Spinal nerves',
  'Cervical vertebrae',
  'Thoracic vertebrae',
  'Lumbar vertebrae and sacrum',
  'Intervertebral discs',
  'Vessels',
]
export const byId = Object.fromEntries(structures.map((s) => [s.id, s]))
export type View = 'Anterior' | 'Left lateral' | 'Posterior'
export const defaultView: View = 'Left lateral'
export const tour: { id: string; title: string; text: string; view: View; isolate?: boolean }[] = [
  {
    id: 'spinal-cord',
    title: 'A cable inside the spine',
    text: 'The spinal cord runs inside the vertebral canal. The column is ghosted here so you can see the cord through it, from the base of the skull down to the lower back.',
    view: 'Left lateral',
  },
  {
    id: 'cauda-equina',
    title: 'Where the cord ends',
    text: 'The cord stops at about the first lumbar vertebra. Below it, the nerve roots for the legs and pelvis continue down the canal as the cauda equina.',
    view: 'Left lateral',
  },
  {
    id: 'nerve-c5',
    title: 'Nerves leave between the bones',
    text: 'Each spinal nerve leaves through a gap between two vertebrae. The C5 nerve, shown here, heads out toward the shoulder and arm.',
    view: 'Anterior',
  },
  {
    id: 'brachial-plexus',
    title: 'Rewired for the arm',
    text: 'The C5 to T1 nerves merge and split again in the brachial plexus, which sorts their fibres into the nerves of the arm.',
    view: 'Anterior',
  },
  {
    id: 'disc-l4-l5',
    title: 'Cushions between the bones',
    text: 'Intervertebral discs sit between the vertebral bodies. The lower lumbar discs carry the most weight and are where most disc problems occur.',
    view: 'Left lateral',
  },
]

export type Emphasis = 'normal' | 'selected' | 'ghosted'
// With nothing selected every structure keeps its own color. A selection
// keeps its structure solid and ghosts the rest so it stays visible even
// when it sits inside other geometry (the cord inside the vertebral canal).
export function emphasis(id: string, selected: string | null): Emphasis {
  if (!selected) return 'normal'
  return id === selected ? 'selected' : 'ghosted'
}
