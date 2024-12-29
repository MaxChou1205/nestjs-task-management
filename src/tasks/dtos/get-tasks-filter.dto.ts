import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../tasks.interface';

export class GetTasksFilterDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
