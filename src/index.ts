import 'dotenv/config';
import { Application } from '@/core/factory';
import AppModule from './app.module';

async function bootstrap(): Promise<void> {
  const app = new Application(AppModule);
  const port = process.env.PORT || 3000;

  app.listen(Number(port));
}

bootstrap();
