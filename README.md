# MIDI Generator

A Node.js application that generates MIDI files with rhythmic variations based on configurable patterns. Built with NestJS and Scribbletune.

## Features

- Generate bassline patterns with configurable rhythmic variations
- Control musical parameters like key, scale, and tempo
- Command-line interface for easy integration into workflows
- Outputs standard MIDI files compatible with any DAW (Digital Audio Workstation)
- Randomized variations while maintaining musical coherence

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/midi-generator.git
cd midi-generator

# Install dependencies
npm install
```

## Usage

### Command Line Interface

The application provides a command-line interface to generate MIDI files:

```bash
# Development mode
npm run start -- generate -c <path-to-config-file> -o <output-directory>

# Production mode
npm run start:prod -- generate -c <path-to-config-file> -o <output-directory>
```

Example:
```bash
npm run start -- generate -c ./control-input/dsharp-minor-bassline.json -o ./midi-output
```

### Configuration Files

The generator uses JSON configuration files to define the musical parameters. These files should be placed in the `control-input` directory.

Example configuration file:
```json
{
  "key": "d#",
  "scale": "minor",
  "bpm": 126,
  "variations": 5,
  "generators": [
    {
      "type": "bassline",
      "fileName": "tech_bass",
      "params": {
        "octave": 2,
        "pattern": "x_x_x___x_x_x___"
      }
    }
  ]
}
```

#### Configuration Parameters

- `key`: Musical key (e.g., "c", "d#", "f")
- `scale`: Musical scale (e.g., "minor", "major", "dorian")
- `bpm`: Tempo in beats per minute
- `variations`: Number of variations to generate
- `generators`: Array of generator configurations
  - `type`: Type of generator (currently supports "bassline")
  - `fileName`: Base name for the output files
  - `params`: Generator-specific parameters
    - `octave`: The octave number
    - `pattern`: Rhythm pattern where "x" represents a note and "_" represents a rest

### Output

The generated MIDI files will be saved to the specified output directory (defaults to `./midi-output`). Each variation will be named according to the pattern:

```
<fileName>_<variation-number>.mid
```

For example, with the configuration above, the following files would be generated:
- tech_bass_1.mid
- tech_bass_2.mid
- tech_bass_3.mid
- tech_bass_4.mid
- tech_bass_5.mid

## Development

```bash
# Run in development mode with hot reload
npm run start:dev

# Run tests
npm run test

# Run tests with coverage
npm run test:cov
```

## How It Works

The MIDI Generator uses the [Scribbletune](https://scribbletune.com/) library to create MIDI clips based on the provided patterns. For each generator configuration:

1. The application reads the specified key and scale to determine the available notes
2. It uses the base pattern as a starting point
3. For each variation, it creates a modified version of the pattern by randomly altering some steps
4. It generates a MIDI clip using the pattern and writes it to a file

The randomization creates musically interesting variations while maintaining the core feel of the original pattern.

## License

This project is licensed under the MIT License - see the LICENSE file for details.