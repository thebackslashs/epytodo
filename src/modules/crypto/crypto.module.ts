import { Module } from '@/core';
import CryptoService from './services/crypto.service';

@Module({
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
