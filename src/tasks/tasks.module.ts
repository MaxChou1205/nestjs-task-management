import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from '@/prisma.service';
import { TasksRepository } from './tasks.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, TasksRepository],
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
})
export class TasksModule {}
