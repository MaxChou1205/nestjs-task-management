import { TaskStatus } from '../tasks.interface';

export class GetTasksFilterDto {
  status?: TaskStatus;
  search?: string;
}
