// Uncomment the code below and write your tests
import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);

    expect(setTimeout).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);

    jest.advanceTimersByTime(999);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 2000);

    expect(setInterval).toHaveBeenCalledWith(callback, 2000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 2000);

    jest.advanceTimersByTime(6000);
    expect(callback).toHaveBeenCalledTimes(3); // 3 intervals (2000ms * 3 = 6000ms)
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const mockPathToFile = 'test.txt';
    const mockFullPath = '/full/path/to/test.txt';
    (join as jest.Mock).mockReturnValue(mockFullPath);

    await readFileAsynchronously(mockPathToFile);

    expect(join).toHaveBeenCalledWith(__dirname, mockPathToFile);
  });

  test('should return null if file does not exist', async () => {
    const mockPathToFile = 'test.txt';
    (existsSync as jest.Mock).mockReturnValue(false);

    const result = await readFileAsynchronously(mockPathToFile);

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const mockPathToFile = 'test.txt';
    const mockFullPath = '/full/path/to/test.txt';
    const mockFileContent = Buffer.from('file content');
    (join as jest.Mock).mockReturnValue(mockFullPath);
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(mockFileContent);

    const result = await readFileAsynchronously(mockPathToFile);

    expect(result).toBe('file content');
    expect(readFile).toHaveBeenCalledWith(mockFullPath);
  });
});
