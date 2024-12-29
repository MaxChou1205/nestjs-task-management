import { IsEnum } from 'class-validator';
import { TaskStatus } from '../tasks.interface';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
