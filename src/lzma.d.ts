declare module "lzma" {
  export type LzmaMode = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  // synchronous
  export function compress(
    input: string | Uint8Array,
    mode: LzmaMode
  ): Uint8Array;

  // asynchronous
  export function compress(
    input: string | Uint8Array,
    mode: LzmaMode,
    onFinish: (result: Uint8Array | null, error: Error | null) => void,
    onProgress: (percent: number) => void
  ): void;

  // synchronous
  export function decompress(input: Uint16Array): string | Uint8Array;

  // asynchronous
  export function decompress(
    input: Uint16Array,
    onFinish: (result: string | Uint8Array | null, error: Error | null) => void,
    onProgress: (percent: number) => void
  ): void;
}
