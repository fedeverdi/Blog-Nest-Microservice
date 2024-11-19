import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { Blog } from '../interfaces/blog.interface';
import { BlogDto } from '../dto/blog.dto';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockAppService = {
    create: jest.fn((blog: Blog) => Promise.resolve(blog)),
    findAll: jest.fn(() => Promise.resolve({ total: 0, blogs: [] })),
    findByUser: jest.fn(() => Promise.resolve({ total: 0, blogs: [] })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockAppService }],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should return status ok on handlePing', () => {
    expect(appController.handlePing()).toEqual({ status: 'ok' });
  });

  it('should create a blog', async () => {
    const newBlog: BlogDto = {
      titolo: 'Test Blog',
      descrizione: 'Description of test blog',
      user_id: '12345',
    };

    const result = await appController.createBlog(newBlog);
    expect(result).toEqual(newBlog);
    expect(mockAppService.create).toHaveBeenCalledWith(newBlog);
  });

  it('should get all blogs', async () => {
    const filters = { page: 1, limit: 10, search: '' };
    const result = await appController.getAllBlogs(filters);

    expect(result).toEqual({ total: 0, blogs: [] });
    expect(mockAppService.findAll).toHaveBeenCalledWith({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
    });
  });

  it('should get blogs for a user', async () => {
    const filters = { page: 1, limit: 10, search: '', user_id: '12345' };
    const result = await appController.getBlogsUser(filters);

    expect(result).toEqual({ total: 0, blogs: [] });
    expect(mockAppService.findByUser).toHaveBeenCalledWith(filters);
  });
});
