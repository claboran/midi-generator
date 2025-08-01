export type GeneratorConfig = {
  type: 'bassline' | 'stabs';
  fileName: string;
  params: {
    octave: number;
    pattern: string;
    noteSelection?: number[];
    subdiv?: string;
  };
};
export type ControlFile = {
  key: string;
  scale: string;
  bpm: number;
  variations: number;
  generators: GeneratorConfig[];
};
