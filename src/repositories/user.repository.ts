import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MSSQLDataSource} from '../datasources/mssql.datasource';
import {User, UserRelations} from '../models/user.model';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(
    @inject('datasources.MSSQLDataSource') dataSource: MSSQLDataSource,
  ) {
    super(User, dataSource);
  }
}
