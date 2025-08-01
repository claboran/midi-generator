import { Module } from '@nestjs/common';
import { GenerateCommand } from './cli/command/generate.command';
import { MidiGeneratorService } from './midi-generator/midi-generator.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GenerateCommand, MidiGeneratorService],
})
export class AppModule {}
