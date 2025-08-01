import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ControlFile, GeneratorConfig } from './generator.model';
import * as scribble from 'scribbletune';
import { ClipParams } from 'scribbletune';

@Injectable()
export class MidiGeneratorService {
  private readonly logger = new Logger(MidiGeneratorService.name);

  /**
   * Type guard to validate if the parsed JSON conforms to the ControlFile type
   */
  private isControlFile(obj: unknown): obj is ControlFile {
    if (!obj || typeof obj !== 'object') return false;

    const candidate = obj as Record<string, unknown>;

    return (
      typeof candidate.key === 'string' &&
      typeof candidate.scale === 'string' &&
      typeof candidate.bpm === 'number' &&
      typeof candidate.variations === 'number' &&
      Array.isArray(candidate.generators) &&
      candidate.generators.every((gen) => this.isGeneratorConfig(gen))
    );
  }

  /**
   * Type guard to validate if an object conforms to the GeneratorConfig type
   */
  private isGeneratorConfig(obj: unknown): obj is GeneratorConfig {
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

  public async processConfigFile(configPath: string, outputDir: string) {
    // 1. Read and parse the JSON control file
    const fileContent = await fs.readFile(configPath, 'utf-8');
    const parsedJson = JSON.parse(fileContent) as unknown;

    // Validate that the parsed JSON conforms to the ControlFile type
    if (!this.isControlFile(parsedJson)) {
      throw new Error('Invalid control file format');
    }

    const config: ControlFile = parsedJson;

    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    // 2. Process each generator defined in the file
    config.generators.forEach((generatorConfig) => {
      if (generatorConfig.type === 'bassline') {
        this.generateBasslineVariations(generatorConfig, config, outputDir);
      }
      // Future 'stabs' generator and others would be called here
    });
  }

  private generateBasslineVariations(
    generatorConfig: GeneratorConfig,
    globalConfig: ControlFile,
    outputDir: string,
  ): void {
    this.logger.log(
      `Generating ${generatorConfig.type}: ${generatorConfig.fileName}`,
    );

    // Get the notes for the specified key and scale
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const notes = scribble.scale(
      `${globalConfig.key}${generatorConfig.params.octave} ${globalConfig.scale}`,
    ) as string[];

    // Get the base pattern from the config
    const basePattern = generatorConfig.params.pattern;

    Array.from(
      { length: globalConfig.variations },
      (_, idx) => idx + 1,
    ).forEach((i) => {
      // Create a variation of the pattern
      const variedPattern = this.createRhythmicVariation(basePattern);

      const clipParams: ClipParams = {
        notes: [notes[0]], // For this prototype, let's just use the root note
        pattern: variedPattern,
        subdiv: '8n', // Default to 8th notes for now
      };

      const clip = scribble.clip(clipParams);

      // Construct the file path
      const filePath = path.join(
        outputDir,
        `${generatorConfig.fileName}_${i}.mid`,
      );

      // Write the MIDI file
      // Type assertion to handle the return value of scribble.midi
      scribble.midi(clip, filePath, globalConfig.bpm);
    });
  }

  /**
   * This is where the "magic" happens. This function introduces randomness.
   * A simple first implementation for creating variations.
   */
  private createRhythmicVariation(pattern: string): string {
    const patternChars = pattern.split('');
    const variationChance = 0.25; // 25% chance to alter a step

    const variedPattern = patternChars.reduce((acc, char) => {
      if (Math.random() < variationChance) {
        if (char === 'x') {
          acc.push('_');
        } else if (char === '_') {
          acc.push('x');
        } else {
          acc.push(char);
        }
      } else {
        acc.push(char);
      }
      return acc;
    }, [] as string[]);
    return variedPattern.join('');
  }
}
