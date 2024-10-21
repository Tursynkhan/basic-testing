import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';
import { throttle } from 'lodash';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const mockAxiosInstance: Partial<AxiosInstance> = {
      get: jest.fn().mockResolvedValue({ data: {} }),
    };

    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

    await throttledGetDataFromApi('/posts');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: {} });
    const mockAxiosInstance: Partial<AxiosInstance> = { get: mockGet };

    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
    await throttledGetDataFromApi('/posts/1');

    expect(mockGet).toHaveBeenCalledWith('/posts/1');
  });

  test('should return response data', async () => {
    const mockData = { id: 1, title: 'Test Post' };
    const mockAxiosInstance: Partial<AxiosInstance> = {
      get: jest.fn().mockResolvedValue({ data: mockData }),
    };

    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

    const result = await throttledGetDataFromApi('/posts/1');

    expect(result).toEqual(mockData);
  });
});
