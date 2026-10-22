/** Smooth 3D gradient noise (Perlin's improved noise): hashed lattice gradients blended with a quintic fade. */

export type Noise3 = (x: number, y: number, z: number) => number;

const TABLE_SIZE = 256;
const LATTICE_MASK = TABLE_SIZE - 1;
const HASH_MASK = TABLE_SIZE * 2 - 1;
/** Raw output mostly stays within about ±0.7; this spreads it to roughly ±1. */
const OUTPUT_SCALE = 1.4;

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (t: number, a: number, b: number) => a + t * (b - a);

/** Dot product with one of the 12 cube-edge gradients, picked by the low 4 bits of the hash. */
function grad(hash: number, x: number, y: number, z: number): number {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

/** A 512-entry permutation (256 shuffled, repeated) so lattice lookups never need wrapping. */
function permutation(random: () => number): Uint8Array {
  const table = Array.from({ length: TABLE_SIZE }, (_, i) => i);
  for (let i = TABLE_SIZE - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [table[i], table[j]] = [table[j] ?? 0, table[i] ?? 0];
  }
  return Uint8Array.from([...table, ...table]);
}

/** Noise seeded from `random`: the same generator gives the same field. Zero at every lattice point. */
export function createNoise3(random: () => number): Noise3 {
  const perm = permutation(random);
  const hash = (i: number) => perm[i & HASH_MASK] ?? 0;
  return (x, y, z) => {
    const fx = Math.floor(x);
    const fy = Math.floor(y);
    const fz = Math.floor(z);
    const [X, Y, Z] = [fx & LATTICE_MASK, fy & LATTICE_MASK, fz & LATTICE_MASK];
    const [dx, dy, dz] = [x - fx, y - fy, z - fz];
    const [u, v, w] = [fade(dx), fade(dy), fade(dz)];
    const a = hash(X) + Y;
    const b = hash(X + 1) + Y;
    const [aa, ab, ba, bb] = [hash(a) + Z, hash(a + 1) + Z, hash(b) + Z, hash(b + 1) + Z];
    const near = lerp(v,
      lerp(u, grad(hash(aa), dx, dy, dz), grad(hash(ba), dx - 1, dy, dz)),
      lerp(u, grad(hash(ab), dx, dy - 1, dz), grad(hash(bb), dx - 1, dy - 1, dz)));
    const far = lerp(v,
      lerp(u, grad(hash(aa + 1), dx, dy, dz - 1), grad(hash(ba + 1), dx - 1, dy, dz - 1)),
      lerp(u, grad(hash(ab + 1), dx, dy - 1, dz - 1), grad(hash(bb + 1), dx - 1, dy - 1, dz - 1)));
    return lerp(w, near, far) * OUTPUT_SCALE;
  };
}
