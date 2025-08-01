import { ControlFile, GeneratorConfig } from './generator.model';

/**
 * Type guard to validate if the parsed JSON conforms to the ControlFile type
 */
export function isControlFile(obj: unknown): obj is ControlFile {
  if (!obj || typeof obj !== 'object') return false;

  const candidate = obj as Record<string, unknown>;

  return (
    typeof candidate.key === 'string' &&
    typeof candidate.scale === 'string' &&
    typeof candidate.bpm === 'number' &&
    typeof candidate.variations === 'number' &&
    Array.isArray(candidate.generators) &&
    candidate.generators.every((gen) => isGeneratorConfig(gen))
  );
}

/**
 * Type guard to validate if an object conforms to the GeneratorConfig type
 */
export function isGeneratorConfig(obj: unknown): obj is GeneratorConfig {
  if (!obj || typeof obj !== 'object') return false;

  const candidate = obj as Record<string, unknown>;
  const params = candidate.params as Record<string, unknown> | undefined;

  return (
    (candidate.type === 'bassline' || candidate.type === 'stabs') &&
    typeof candidate.fileName === 'string' &&
    params !== undefined &&
    typeof params === 'object' &&
    typeof params.octave === 'number' &&
    typeof params.pattern === 'string'
  );
}