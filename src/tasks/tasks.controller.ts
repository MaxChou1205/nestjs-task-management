import { Body, Controller, Get, Post } from '@nestjs/common';
import { TasksService } from '@/tasks/tasks.service';
import { Task } from './tasks.interface';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Post()
  createTask(@Body() body: { title: string; description: string }): Task {
    const { title, description } = body;

    return this.tasksService.createTask(title, description);
  }
}
