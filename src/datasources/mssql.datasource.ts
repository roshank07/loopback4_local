import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'MSSQLDataSource',
  connector: 'mssql',
  url: '',
  host: 'localhost',  // Replace with your MSSQL server host
  port: 1433,
  user: 'roshank',  // Replace with your MSSQL username
  password: 'root@8092',  // Replace with your MSSQL password
  database: 'test',  // Replace with your MSSQL database name
  options: {
    encrypt: true,  // Use this option if required by your MSSQL setup (e.g., Azure SQL)
  },
};

@lifeCycleObserver('datasource')
export class MSSQLDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'MSSQLDataSource';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.MSSQLDataSource', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
