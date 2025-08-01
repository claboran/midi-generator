export type GeneratorConfig = {
  type: 'bassline' | 'stabs';
  fileName: string;
  params: {
    octave: number;
    pattern: string;
    // We can add more specific params later
  };
};
export type ControlFile = {
  key: string;
  scale: string;
  bpm: number;
  variations: number;
  generators: GeneratorConfig[];
};
