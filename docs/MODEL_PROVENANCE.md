# Model provenance and preparation

## Source and license

The runtime model uses **BodyParts3D / Anatomography 4.3** (object set 4.3, ontology tree FMA3.0), retrieved **2026-10-16**. All selected OBJ headers report compatibility version 4.3.

The original service explicitly permits modification and redistribution of contour data and rendered images under **[CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en)** ([legal text](https://creativecommons.org/licenses/by-sa/2.1/jp/legalcode)). An inert [snapshot of that notice](model-source/original-license.html.txt), copied from the lungs explorer's provenance record, is included. This license governs `public/models/spinal-cord.glb`, the manifest's model data and the model screenshots, separately from the MIT application code. This follows the same choice as [lungs-3d](https://github.com/organui/lungs-3d) and [pancreas-3d](https://github.com/organui/pancreas-3d), which also use 4.3 data from a mirror: the LSDB archive's CC BY 4.0 grant covers its 4.0 release and is not extended to these 4.3 meshes.

Credit: **BodyParts3D / Anatomography, © The Database Center for Life Science (DBCLS).** Adapted by OrganUI. No endorsement is implied.

## Retrieval and pinning

The network policy of the sandbox this was built in blocked both `dbarchive.biosciencedbc.jp` and `lifesciencedb.jp`, so the official archives could not be downloaded. Geometry comes from the public [olivercase/body_parts_3d_api](https://github.com/olivercase/body_parts_3d_api) mirror, pinned at commit `fd527e6f4daf732fd814314d9257df5877b844bc` (the same commit the lungs and pancreas explorers pin).

Each OBJ is checked three ways:

1. Its SHA-256 and size match the oid and size in its pinned Git LFS pointer (recorded per file in [model-inputs.json](../scripts/model-inputs.json)).
2. Its embedded `File ID` and `Concept ID` headers match.
3. That concept maps to that FJ element in the official 4.3 IS-A table, [`FMA2Obj-4.3.tsv`](model-source/FMA2Obj-4.3.tsv) (SHA-256 `c3d16c89…935d4f`). The table is the unchanged official download preserved by lungs-3d; `prepare-model.ts` refuses to run if its hash changes.

The BodyParts3D 3.0 STL mirror used by other explorers (Kevin-Mattheus-Moerman/BodyParts3D) was also checked. It has the spinal cord and the vertebrae but no cauda equina or spinal nerves, so 4.3 was used for everything to keep one source and one frame.

## Selected structures

| Structure | Source concept(s) | Elements |
| --- | --- | --- |
| Spinal cord | FMA242005 neural tissue of spinal cord | FJ4426 |
| Medulla oblongata | FMA62004 | FJ1769, FJ1831 (left and right halves) |
| C1–C8, T1, T2 spinal nerves (left) | FMA6442 first cervical nerve; trunks FMA7003, FMA7005, FMA7007, FMA24105, FMA7011, FMA7013, FMA7015, FMA7023, FMA7025 | FJ4260–FJ4267, FJ4245, FJ4248 |
| Brachial plexus (left) | FMA65362, FMA65366, FMA65364 trunks; FMA45239, FMA45241, FMA45243 cords | FJ4290, FJ4276, FJ4273, FJ4274, FJ4275, FJ4280 |
| Cauda equina | FMA52590 | FJ4425 |
| Atlas, axis, C3–C7 | FMA12519–FMA12525 | FJ3176, FJ3177, FJ3161, FJ3164, FJ3167, FJ3170, FJ3172 |
| T1–T12 | FMA9165, FMA9187, FMA9209, FMA9248, FMA9922, FMA9945, FMA9968, FMA9991, FMA10014, FMA10037, FMA10059, FMA10081 | FJ3158, FJ3160, FJ3163, FJ3166, FJ3169, FJ3171, FJ3173–FJ3175, FJ3154–FJ3156 |
| L1–L5 | FMA13072–FMA13076 | FJ3157, FJ3159, FJ3162, FJ3165, FJ3168 |
| Sacrum | FMA16202 | FJ3393 |
| 23 intervertebral discs, C2–C3 to L5–S1 | FMA25058, FMA13896–FMA13900, FMA10458, FMA13495, FMA13500–FMA13509, FMA16033–FMA16037 | FJ3202–FJ3224 |
| Vertebral arteries | FMA76261 right, FMA76262 left trunk | FJ1725, FJ1725M |

70 elements, 63 structures, 170,184 triangles, 5.1 MB GLB. Each element belongs to exactly one structure; the script refuses duplicates and unused inputs. Per-element hashes, sizes and counts are in the [manifest](../public/models/manifest.json) and [selected-mappings.tsv](model-source/selected-mappings.tsv).

Decisions:

- **Disc names.** The source names each disc after the vertebra above it ("intervertebral disk of axis" lies between C2 and C3). The explorer labels them by both neighbours, for example `C2–C3 disc` and `L5–S1 disc`.
- **Left nerves only.** BodyParts3D 4.3 models spinal nerves only on the left and only from C1 to T2 (plus the left brachial plexus and intercostal branches). No right-side, lower thoracic, lumbar or sacral spinal nerves exist in the source. The lumbar and sacral roots are represented by the single cauda equina mesh.
- **Medulla.** Included so the cord's upper end has context. Its two halves are one structure.
- **Vertebral arteries.** FJ1725M is the source's mirrored copy of the right artery (the `M` suffix); both are grouped as one structure.
- Omitted: the central canal (FJ1737) and anterior spinal arteries (FJ1657, FJ1657M), which in 4.3 cover only a few centimetres at the top of the cord and sit inside or against it; the meninges (the 4.3 dura mesh covers only the cerebral hemispheres); the coccyx (no mesh); intercostal branches; ribs, skull and muscles.

## Transformation and orientation

Vertices are recentred on the selection's source bounding box and uniformly scaled by `0.008` (the column is about 0.7 m tall); axes change from source `[x, y, z]` to display `[x, z, -y]` (source +x patient left, −y anterior, +z superior). Anterior view looks along display −Z, posterior along +Z, and the left lateral view looks from the patient's left along −X, so the modelled nerves face the camera. No anatomical reshaping or decimation is performed.

## Reproduce

```sh
bun run prepare:model   # downloads missing OBJs into .asset-cache/objs, verifies, writes the GLB and manifest
bun run verify:model    # checks the GLB hash, structure IDs, element lists and geometry
```
