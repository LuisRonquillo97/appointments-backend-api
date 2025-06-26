import 'reflect-metadata';

// Mock del logger para pruebas
jest.mock('../src/infrastructure/logging/loggerFactory', () => ({
  LoggerFactory: {
    getLogger: () => ({
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    }),
  },
}));

// Configuración global para pruebas
beforeAll(async () => {
  // Configuración inicial si es necesaria
});

afterAll(async () => {
  // Limpieza después de todas las pruebas
});
