import '@testing-library/jest-dom'

beforeAll(() => {
  const error = console.error;
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Not implemented: navigation')
    ) {
      return;
    }
    error(...args);
  });
});
