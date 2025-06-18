// filepath: /home/gbmacena/Projetos/ta-pronto/backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [PrismaModule, UsersModule, RecipesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
