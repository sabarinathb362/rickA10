import 'dotenv/config';
import { McpApplicationFactory } from '@nitrostack/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  // Bootstrap the application with the root module
  const app = await McpApplicationFactory.create(AppModule);
  await app.start();
}

bootstrap().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
