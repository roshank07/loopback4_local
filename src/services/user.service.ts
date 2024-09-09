import {inject} from '@loopback/core';
import * as sql from 'mssql';
import {SqlDataSource} from '../datasources/sql.datasource';

export class UserService {
  constructor(
    @inject('datasources.sql') private dataSource: SqlDataSource,
  ) {}

  async getUserByUsername(query:any,username: string) {
    try {
      const pool = await this.dataSource.getPool();
      const result = await pool.request()
        .input('username', sql.VarChar, username)
        .query(query);
      return result.recordset;
    } catch (err) {
      console.error(err);
      throw err; // Rethrow or handle the error as needed
    }
  }
}
