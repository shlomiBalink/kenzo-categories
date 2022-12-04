import { DatabaseConnection } from '../../src/database/database.types.d';

export const databaseConnectionMock: DatabaseConnection = {
  hashSet: jest.fn(),
  closeConnection: jest.fn()
};
