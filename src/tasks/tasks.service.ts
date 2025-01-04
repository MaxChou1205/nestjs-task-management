import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.interface';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { User } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TasksRepository) {}

  getTasks(filterConditions: GetTasksFilterDto, user: User) {
    return this.taskRepository.getTasks(filterConditions, user);
  }

  // getTasksWithFilters(filterConditions: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterConditions;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       return task.title.includes(search) || task.description.includes(search);
  //     });
  //   }
  //   return tasks;
  // }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const createdTask = await this.taskRepository.createTask(
      createTaskDto,
      user,
    );
    return createdTask;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.getTaskById(id, user);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const task = await this.taskRepository.getTaskById(id, user);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    await this.taskRepository.deleteTask(id);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    const updatedTask = await this.taskRepository.save(task);
    return updatedTask;
  }
}
