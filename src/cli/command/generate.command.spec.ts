import { Test } from '@nestjs/testing';
import { GenerateCommand } from './generate.command';
import { GeneratorCommandOptions } from '../generator-command-options.model';
import { MidiGeneratorService } from '../../midi-generator/midi-generator.service';

/**
 * PATTERN: Type-safe testing of protected/private methods
 *
 * Instead of using `any` type casting to access private methods (which bypasses type safety),
 * we use a test helper class that extends the class under test and exposes protected methods
 * as public methods. This maintains type safety while allowing us to test protected methods.
 *
 * Steps:
 * 1. Change private methods to protected in the class under test
 * 2. Create a test helper class that extends the class under test
 * 3. Expose protected methods as public methods in the test helper class
 * 4. Use the test helper class in tests to access protected methods
 * 5. Spy directly on protected methods when needed
 */
class TestableGenerateCommand extends GenerateCommand {
  // Expose protected methods for testing
  public testValidateOptions(options?: GeneratorCommandOptions): void {
    return this.validateOptions(options);
  }
}

describe('GenerateCommand', () => {
  let command: GenerateCommand;
  let testableCommand: TestableGenerateCommand;

  beforeEach(async () => {
    // Create a mock for MidiGeneratorService
    const mockMidiGeneratorService = {
      processConfigFile: jest.fn().mockResolvedValue(undefined),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        GenerateCommand,
        {
          provide: TestableGenerateCommand,
          useClass: TestableGenerateCommand,
        },
        {
          provide: MidiGeneratorService,
          useValue: mockMidiGeneratorService,
        },
      ],
    }).compile();

    command = moduleRef.get<GenerateCommand>(GenerateCommand);
    testableCommand = moduleRef.get<TestableGenerateCommand>(
      TestableGenerateCommand,
    );
  });

  describe('parseConfig', () => {
    it('should return the config path', () => {
      const configPath = 'path/to/config.json';
      expect(command.parseConfig(configPath)).toBe(configPath);
    });
  });

  describe('parseOutput', () => {
    it('should return the output path', () => {
      const outputPath = 'path/to/output';
      expect(command.parseOutput(outputPath)).toBe(outputPath);
    });
  });

  describe('validateOptions', () => {
    it('should throw an error if options are not provided', () => {
      expect(() => testableCommand.testValidateOptions(undefined)).toThrow(
        'Command options are required but were not provided',
      );
    });

    it('should throw an error if config is not provided', () => {
      expect(() =>
        testableCommand.testValidateOptions({ output: 'path/to/output' }),
      ).toThrow('Config path is required but was not provided');
    });

    it('should throw an error if output is not provided', () => {
      expect(() =>
        testableCommand.testValidateOptions({ config: 'path/to/config.json' }),
      ).toThrow('Output directory is required but was not provided');
    });

    it('should not throw an error if both config and output are provided', () => {
      expect(() =>
        testableCommand.testValidateOptions({
          config: 'path/to/config.json',
          output: 'path/to/output',
        }),
      ).not.toThrow();
    });
  });

  describe('run', () => {
    it('should validate options and resolve', async () => {
      const options: GeneratorCommandOptions = {
        config: 'path/to/config.json',
        output: 'path/to/output',
      };

      // Spy on the protected method directly
      const validateSpy = jest.spyOn(testableCommand, 'validateOptions');
      // Use a more type-safe approach for logger spy
      const loggerSpy = jest.spyOn(testableCommand['logger'], 'log');

      await testableCommand.run([], options);

      expect(validateSpy).toHaveBeenCalledWith(options);
      expect(loggerSpy).toHaveBeenCalledWith('🚀 Starting MIDI generation...');
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅ MIDI files successfully generated in:'),
      );
    });
  });
});
