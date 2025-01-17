import { Test } from '@nestjs/testing';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  getTaskById: jest.fn(),
  createTask: jest.fn(),
  deleteTask: jest.fn(),
  save: jest.fn(),
});

const mockUser = {
  id: 'id',
  username: 'test',
  password: 'test',
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TasksRepository>(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls taskRepository.getTasks and returns the result', async () => {
      const result = ['test'];
      taskRepository.getTasks.mockReturnValue(result);
      const tasks = await tasksService.getTasks({}, mockUser);
      expect(tasks).toEqual(result);
    });
  });
});
