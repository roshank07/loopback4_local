import * as sql from 'mssql';

export class UserService2 {
  private config = {
  user: 'roshank',
  password: 'root@8092',
  server: 'localhost',
  database: 'test',
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: true // Adjust based on your environment
  }
};
  constructor(
    // @inject('datasources.sql') private dataSource: SqlDataSource,
  ) {}

  async getUserByUsername(query:any,params: { [key: string]: any }) {
  let pool: sql.ConnectionPool | null = null; // Initialize pool as null
  try {
    pool = await sql.connect(this.config);
    const request = pool.request();

    // Add parameters to the request
   for (const key in params) {
  if (params.hasOwnProperty(key)) {
    const value = params[key];
    if (typeof value === 'string') {
      request.input(key, sql.NVarChar, value);
    } else if (typeof value === 'number') {
       if (Number.isInteger(value)) {
            request.input(key, sql.Int, value);
          } else {
            request.input(key, sql.Float, value);
          }
    } else if (typeof value === 'boolean') {
      request.input(key, sql.Bit, value);
    } else if (value instanceof Date) {
      request.input(key, sql.DateTime, value);
    } else if (value instanceof Buffer) {
      request.input(key, sql.VarBinary, value);
    } else {
      // Add handling for other types as needed
      throw new Error(`Unsupported parameter type for key ${key}`);
    }
  }
}

    // Execute the query
    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err; // Rethrow or handle the error as needed
  } finally {
    if (pool) {
      await pool.close(); // Ensure the pool is closed after use
    }
  }

  }
}
