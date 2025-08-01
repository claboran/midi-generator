import { isControlFile, isGeneratorConfig } from './service-guards';
import { ControlFile, GeneratorConfig } from './generator.model';

describe('Service Guards', () => {
  describe('isGeneratorConfig', () => {
    it('should return true for valid GeneratorConfig objects', () => {
      const validConfig: GeneratorConfig = {
        type: 'bassline',
        fileName: 'test-bassline',
        params: {
          octave: 3,
          pattern: 'x_x_',
        },
      };

      expect(isGeneratorConfig(validConfig)).toBe(true);
    });

    it('should return true for stabs type', () => {
      const stabsConfig: GeneratorConfig = {
        type: 'stabs',
        fileName: 'test-stabs',
        params: {
          octave: 4,
          pattern: 'x___x___',
        },
      };

      expect(isGeneratorConfig(stabsConfig)).toBe(true);
    });

    it('should return false for null or undefined', () => {
      expect(isGeneratorConfig(null)).toBe(false);
      expect(isGeneratorConfig(undefined)).toBe(false);
    });

    it('should return false for non-object values', () => {
      expect(isGeneratorConfig('string')).toBe(false);
      expect(isGeneratorConfig(123)).toBe(false);
      expect(isGeneratorConfig(true)).toBe(false);
      expect(isGeneratorConfig([])).toBe(false);
    });

    it('should return false for objects with invalid type', () => {
      const invalidTypeConfig = {
        type: 'invalid-type',
        fileName: 'test',
        params: {
          octave: 3,
          pattern: 'x_x_',
        },
      };

      expect(isGeneratorConfig(invalidTypeConfig)).toBe(false);
    });

    it('should return false for objects with missing properties', () => {
      const missingFileName = {
        type: 'bassline',
        params: {
          octave: 3,
          pattern: 'x_x_',
        },
      };

      const missingParams = {
        type: 'bassline',
        fileName: 'test',
      };

      expect(isGeneratorConfig(missingFileName)).toBe(false);
      expect(isGeneratorConfig(missingParams)).toBe(false);
    });

    it('should return false for objects with invalid params', () => {
      const invalidOctave = {
        type: 'bassline',
        fileName: 'test',
        params: {
          octave: 'not-a-number',
          pattern: 'x_x_',
        },
      };

      const invalidPattern = {
        type: 'bassline',
        fileName: 'test',
        params: {
          octave: 3,
          pattern: 123,
        },
      };

      const missingParamProperties = {
        type: 'bassline',
        fileName: 'test',
        params: {},
      };

      expect(isGeneratorConfig(invalidOctave)).toBe(false);
      expect(isGeneratorConfig(invalidPattern)).toBe(false);
      expect(isGeneratorConfig(missingParamProperties)).toBe(false);
    });
  });

  describe('isControlFile', () => {
    it('should return true for valid ControlFile objects', () => {
      const validControlFile: ControlFile = {
        key: 'C',
        scale: 'minor',
        bpm: 120,
        variations: 4,
        generators: [
          {
            type: 'bassline',
            fileName: 'test-bassline',
            params: {
              octave: 3,
              pattern: 'x_x_',
            },
          },
        ],
      };

      expect(isControlFile(validControlFile)).toBe(true);
    });

    it('should return false for null or undefined', () => {
      expect(isControlFile(null)).toBe(false);
      expect(isControlFile(undefined)).toBe(false);
    });

    it('should return false for non-object values', () => {
      expect(isControlFile('string')).toBe(false);
      expect(isControlFile(123)).toBe(false);
      expect(isControlFile(true)).toBe(false);
      expect(isControlFile([])).toBe(false);
    });

    it('should return false for objects with missing properties', () => {
      const missingKey = {
        scale: 'minor',
        bpm: 120,
        variations: 4,
        generators: [],
      };

      const missingScale = {
        key: 'C',
        bpm: 120,
        variations: 4,
        generators: [],
      };

      const missingBpm = {
        key: 'C',
        scale: 'minor',
        variations: 4,
        generators: [],
      };

      const missingVariations = {
        key: 'C',
        scale: 'minor',
        bpm: 120,
        generators: [],
      };

      const missingGenerators = {
        key: 'C',
        scale: 'minor',
        bpm: 120,
        variations: 4,
      };

      expect(isControlFile(missingKey)).toBe(false);
      expect(isControlFile(missingScale)).toBe(false);
      expect(isControlFile(missingBpm)).toBe(false);
      expect(isControlFile(missingVariations)).toBe(false);
      expect(isControlFile(missingGenerators)).toBe(false);
    });

    it('should return false for objects with invalid property types', () => {
      const invalidKey = {
        key: 123,
        scale: 'minor',
        bpm: 120,
        variations: 4,
        generators: [],
      };

      const invalidScale = {
        key: 'C',
        scale: 123,
        bpm: 120,
        variations: 4,
        generators: [],
      };

      const invalidBpm = {
        key: 'C',
        scale: 'minor',
        bpm: 'not-a-number',
        variations: 4,
        generators: [],
      };

      const invalidVariations = {
        key: 'C',
        scale: 'minor',
        bpm: 120,
        variations: 'not-a-number',
        generators: [],
      };

      const invalidGenerators = {
        key: 'C',
        scale: 'minor',
        bpm: 120,
        variations: 4,
        generators: 'not-an-array',
      };

      expect(isControlFile(invalidKey)).toBe(false);
      expect(isControlFile(invalidScale)).toBe(false);
      expect(isControlFile(invalidBpm)).toBe(false);
      expect(isControlFile(invalidVariations)).toBe(false);
      expect(isControlFile(invalidGenerators)).toBe(false);
    });

    it('should return false if generators contains invalid generator configs', () => {
      const invalidGeneratorConfig = {
        key: 'C',
        scale: 'minor',
        bpm: 120,
        variations: 4,
        generators: [
          {
            type: 'invalid-type',
            fileName: 'test',
            params: {
              octave: 3,
              pattern: 'x_x_',
            },
          },
        ],
      };

      expect(isControlFile(invalidGeneratorConfig)).toBe(false);
    });
  });
});