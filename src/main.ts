import { AppModule } from './app.module';
import { CommandFactory } from 'nest-commander';

async function bootstrap() {
  await CommandFactory.run(AppModule, ['log', 'warn', 'error', 'fatal']);
}
void bootstrap();
