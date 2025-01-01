import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.interface';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TasksRepository) {}

  getTasks(filterConditions: GetTasksFilterDto) {
    return this.taskRepository.getTasks(filterConditions);
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

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = await this.taskRepository.createTask(createTaskDto);
    return createdTask;
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.getTaskById(id);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.taskRepository.getTaskById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    await this.taskRepository.deleteTask(id);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    const updatedTask = await this.taskRepository.save(task);
    return updatedTask;
  }
}
