import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Task, TaskStatus } from './tasks.interface';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuid } from 'uuid';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';

@Injectable()
export class TasksRepository {
  constructor(private prisma: PrismaService) {}

  async getTasks(filterConditions: GetTasksFilterDto) {
    const whereConditions = {};
    if (filterConditions.status) {
      whereConditions['status'] = filterConditions.status;
    }
    if (filterConditions.search) {
      whereConditions['OR'] = [
        { title: { contains: filterConditions.search.toLowerCase() } },
        { description: { contains: filterConditions.search.toLowerCase() } },
      ];
    }
    return (await this.prisma.task.findMany({
      where: whereConditions,
    })) as Task[];
  }
  async getTaskById(id: string) {
    const found = (await this.prisma.task.findUnique({
      where: { id },
    })) as Task;

    return found;
  }
  async createTask(createTaskDto: CreateTaskDto) {
    const task = {
      id: uuid(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
    };
    const createdTask = (await this.prisma.task.create({
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
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
