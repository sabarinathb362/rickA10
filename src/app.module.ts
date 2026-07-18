import { McpApp, Module } from '@nitrostack/core';
import { RickGotchiModule } from './modules/meme/rickgotchi.module.js';

@McpApp({
  module: AppModule,
  server: {
    name: 'rickgotchi-mcp',
    version: '1.0.0'
  }
})
@Module({
  name: 'app',
  imports: [RickGotchiModule],
})
export class AppModule {}
