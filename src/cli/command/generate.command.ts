import { Command, CommandRunner, Option } from 'nest-commander';
import { Logger } from '@nestjs/common';
import * as path from 'path';
import { GeneratorCommandOptions } from '../generator-command-options.model';
import { MidiGeneratorService } from '../../midi-generator/midi-generator.service';

@Command({
  name: 'generate',
  description: 'Generate MIDI clips based on a JSON control file.',
})
export class GenerateCommand extends CommandRunner {
  private readonly logger = new Logger(GenerateCommand.name);

  constructor(private readonly midiGenerator: MidiGeneratorService) {
    super();
  }

  protected validateOptions(options?: GeneratorCommandOptions): void {
    if (!options) {
      throw new Error('Command options are required but were not provided');
    }

    if (!options.config) {
      throw new Error('Config path is required but was not provided');
    }

    if (!options.output) {
      throw new Error('Output directory is required but was not provided');
    }
  }

  async run(
    passedParams: string[],
    options?: GeneratorCommandOptions,
  ): Promise<void> {
    this.validateOptions(options);

    this.logger.log('🚀 Starting MIDI generation...');
    const outputPath = path.resolve(options!.output);
    await this.midiGenerator.processConfigFile(options!.config, outputPath)
    this.logger.log(`✅ MIDI files successfully generated in: ${outputPath}`);
    return Promise.resolve();
  }

  @Option({
    flags: '-c, --config <config>',
    description: 'Path to the JSON control file.',
  })
  parseConfig(val: string): string {
    return val;
  }

  @Option({
    flags: '-o, --output <output>',
    description: 'Output directory for the MIDI files.',
  })
  parseOutput(val: string): string {
    return val;
  }
}
