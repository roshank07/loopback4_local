import {juggler} from '@loopback/repository';
import * as sql from 'mssql';

// Define your SQL Server configuration
const config: sql.config = {
  user: 'roshank',
  password: 'root@8092',
  server: 'localhost',
  database: 'test',
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: true // Adjust based on your environment
  }
};

export class SqlDataSource extends juggler.DataSource {
  static dataSourceName = 'sql';

  constructor() {
    super(config);
  }

  getPool() {
    return sql.connect(config);
  }
}
