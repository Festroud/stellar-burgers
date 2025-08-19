import '@testing-library/jest-dom';

// Mock для fetch API
global.fetch = jest.fn();

// Mock для localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock для document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
});

// Mock для process.env (если не установлена)
if (!process.env.BURGER_API_URL) {
  process.env.BURGER_API_URL = 'https://norma.nomoreparties.space/api';
}

// Дополнительные моки при необходимости
beforeEach(() => {
  jest.clearAllMocks();
});
