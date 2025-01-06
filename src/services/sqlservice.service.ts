import {juggler} from '@loopback/repository';

export class SqlService {
  private dataSource: juggler.DataSource;

  constructor() {
    // Manually configure the data source
    this.dataSource = new juggler.DataSource({
      name: 'mssql',
      connector: 'mssql',
      host: 'localhost',
      port: 1433,
      user: 'roshank',
      password: 'root@8092',
      database: 'test',
      options: {
        encrypt: true, // For secure connections
        trustServerCertificate: true, // Adjust based on your environment
      },
    });
  }

  /**
   * Execute a raw SQL query
   * @param query - Raw SQL query string
   * @param params - Query parameters
   * @returns Query result
   */
  async executeRawQuery(query: string, params: unknown[] = []): Promise<any> {
    // const connector = this.dataSource.connector;
    // if (!connector) {
    //   throw new Error('Database connector is not initialized');
    // }

    return new Promise((resolve, reject) => {
      this.dataSource.execute(query, params, {}, (err: Error | null, result: unknown) => {
        if (err) {
          console.error('SQL Execution Error:', err);
          // reject(err); // Properly reject on error
        } else {
          resolve(result);
        }
      });
    });
  }
}
