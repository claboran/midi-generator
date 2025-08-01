import { Module } from '@nestjs/common';
import { GenerateCommand } from './cli/command/generate.command';

@Module({
  imports: [],
  controllers: [],
  providers: [GenerateCommand],
})
export class AppModule {}
