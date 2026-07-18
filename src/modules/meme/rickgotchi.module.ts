import { Module } from '@nitrostack/core';
import { RickGotchiTools } from './rickgotchi.tools.js';

@Module({
  name: 'rickgotchi',
  controllers: [RickGotchiTools],
})
export class RickGotchiModule {}
