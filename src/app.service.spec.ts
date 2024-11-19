import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { getModelToken } from '@nestjs/mongoose';
import { Blog } from './interfaces/blog.interface';

describe('AppService', () => {
  let appService: AppService;

  const mockSave = jest.fn();
  const mockBlogModel = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: mockSave,
  }));

  const mockMethods = {
    countDocuments: jest.fn().mockResolvedValue(0),
    find: jest.fn(() => ({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([]),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getModelToken('Blog'),
          useValue: Object.assign(mockBlogModel, mockMethods),
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  it('should create a blog', async () => {
    const newBlog = {
      titolo: 'Test Blog',
      descrizione: 'Description of test blog',
      user_id: '12345',
    };

    mockSave.mockResolvedValueOnce(newBlog);

    const result = await appService.create(newBlog as Blog);
    expect(result).toEqual(newBlog);
    expect(mockSave).toHaveBeenCalled();
  });

  it('should find all blogs', async () => {
    const filters = { page: 1, limit: 10, search: '' };

    const result = await appService.findAll(filters);

    expect(result).toEqual({
      total: 0,
      page: filters.page,
      limit: filters.limit,
      blogs: [],
    });
    expect(mockMethods.countDocuments).toHaveBeenCalledWith({});
    expect(mockMethods.find).toHaveBeenCalledWith({});
  });

  it('should find blogs by user', async () => {
    const filters = { page: 1, limit: 10, search: '', user_id: '12345' };

    const result = await appService.findByUser(filters);

    expect(result).toEqual({
      total: 0,
      page: filters.page,
      limit: filters.limit,
      blogs: [],
    });

    expect(mockMethods.countDocuments).toHaveBeenCalledWith({ user_id: '12345' });
    expect(mockMethods.find).toHaveBeenCalledWith({
      user_id: '12345',
    });
  });
});
