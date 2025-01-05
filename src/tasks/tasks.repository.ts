import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Task, TaskStatus } from './tasks.interface';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuid } from 'uuid';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { User } from '@prisma/client';

@Injectable()
export class TasksRepository {
  constructor(private prisma: PrismaService) {}
  logger = new Logger('TasksRepository');

  async getTasks(filterConditions: GetTasksFilterDto, user: User) {
    const whereConditions = {
      userId: user.id,
    };
    if (filterConditions.status) {
      whereConditions['status'] = filterConditions.status;
    }
    if (filterConditions.search) {
      whereConditions['OR'] = [
        { title: { contains: filterConditions.search.toLowerCase() } },
        { description: { contains: filterConditions.search.toLowerCase() } },
      ];
    }
    try {
      return (await this.prisma.task.findMany({
        where: whereConditions,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      })) as Task[];
    } catch (err) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}".`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }
  async getTaskById(id: string, user: User) {
    const found = (await this.prisma.task.findUnique({
      where: { id, userId: user.id },
    })) as Task;

    return found;
  }
  async createTask(createTaskDto: CreateTaskDto, user: User) {
    const task = {
      id: uuid(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
      userId: user.id,
    };
    const createdTask = (await this.prisma.task.create({
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        userId: user.id,
      },
    })) as Task;
    return createdTask;
  }
  async deleteTask(id: string) {
    const task = await this.prisma.task.delete({
      where: { id },
    });
    return task;
  }
  async save(task: Task) {
    return (await this.prisma.task.update({
      where: { id: task.id },
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
      },
    })) as Task;
  }
}
