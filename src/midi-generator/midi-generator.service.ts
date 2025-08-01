import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ControlFile, GeneratorConfig } from './generator.model';
import * as scribble from 'scribbletune';
import { ClipParams } from 'scribbletune';
import { isControlFile } from './service-guards';

@Injectable()
export class MidiGeneratorService {
  private readonly logger = new Logger(MidiGeneratorService.name);

  public async processConfigFile(configPath: string, outputDir: string) {
    // 1. Read and parse the JSON control file
    const fileContent = await fs.readFile(configPath, 'utf-8');
    const parsedJson = JSON.parse(fileContent) as unknown;

    // Validate that the parsed JSON conforms to the ControlFile type
    if (!isControlFile(parsedJson)) {
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

    // 2. CREATE THE NOTE PALETTE
    // Use the noteSelection from the config, or default to just the root note if not provided.
    const scaleDegrees = generatorConfig.params.noteSelection || [1];
    const notePalette = scaleDegrees.map((degree) => notes[degree - 1]); // Subtract 1 for 0-based index

    this.logger.log(`Using note palette: [${notePalette.join(', ')}]`);

    // Get the base pattern from the config
    const basePattern = generatorConfig.params.pattern;

    Array.from(
      { length: globalConfig.variations },
      (_, idx) => idx + 1,
    ).forEach((i) => {
      // Create a variation of the pattern
      const variedPattern = this.createRhythmicVariation(basePattern);

      const clipParams: ClipParams = {
        notes: notePalette, // Pass the array of selected notes
        pattern: variedPattern,
        subdiv: generatorConfig.params.subdiv ?? '16n',
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
