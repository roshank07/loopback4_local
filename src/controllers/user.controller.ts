import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  Response
} from '@loopback/rest';
import * as fs from 'fs';
import * as path from 'path';
import userDump from '../config/users.json';
import {MSSQLDataSource} from '../datasources/mssql.datasource';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories/user.repository';
import {UserService2} from '../services/user.service2';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
    // @inject('services.UserService') private userService: UserService,
    @inject('datasources.MSSQLDataSource') private dataSource: MSSQLDataSource

  ) {}

  @post('/users', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.userRepository.create(user);
  }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {

    console.log('userDUmppppp',userDump);
    return this.userRepository.count(where);

  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  // @get('/users/{id}', {
  //   responses: {
  //     '200': {
  //       description: 'User model instance',
  //       content: {
  //         'application/json': {
  //           schema: getModelSchemaRef(User, {includeRelations: true}),
  //         },
  //       },
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.number('id') id: number,
  //   @param.filter(User, {exclude: 'where'}) filter?: Filter<User>
  // ): Promise<User> {

  //   return this.userRepository.findById(id, filter);
  // }


  @post('/findusers')
  async findById(
   @requestBody() req: any, @inject('rest.http.response') res: Response
  ): Promise<any> {
    // Raw SQL query
    const sql = 'SELECT * FROM test.dbo.[User] WHERE username = @username';

    try {
      // Execute raw SQL query
    const username = req.username;
    const id = req.id;
    const userService = new UserService2();
    const query = 'SELECT option_name FROM test.dbo.[paramsOP]'; // Example query
    const result=await userService.getUserByUsername(query, {username,id} );
      // Return the user if found, otherwise return null
      console.log("result",result);
      if(result[1].option_name==null){
        console.log("resultkkkkkkkk");
      }
      return result.length > 0 ? result[1] : null;

    } catch (error) {
     res.status(200).json({ status:200,message: error.message });
    }
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
    @get('/dump-users', {
    responses: {
      '200': {
        description: 'Dump users to JSON file',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  async dumpUsersToJson(): Promise<{ message: string }> {
    const query = 'SELECT * FROM test.dbo.[User]'; // Adjust the table name as needed
     try {
      const userService = new UserService2();
      const result = await userService.getUserByUsername(query, {});
       // Define the path to the JSON file
      const dirPath = path.join(process.cwd(), 'src/config');
      const filePath = path.join(dirPath, 'users.json');

      console.log('Directory Path:', dirPath);
      console.log('File Path:', filePath);

      // Ensure the directory exists
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log('Directory created:', dirPath);
      } else {
        console.log('Directory already exists:', dirPath);
      }

      // Write the result to the JSON file
      fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
      console.log('File written:', filePath);



      return { message: 'Users dumped to JSON file successfully' };
    } catch (error) {
      console.error('Error dumping users to JSON file:', error);
      throw error; // You can customize error handling here
    }
  }

  @get('/getTemplate/{id}')

  async getTemplate(@param.path.number('id') id: number): Promise<any> {
    const sql = 'SELECT input_params FROM test.dbo.[template] WHERE id = @id';
    const userService = new UserService2();
    const result = await userService.getUserByUsername(sql, {id: id});
    console.log("result",result[0].input_params);
    const input_params =JSON.parse(result[0].input_params);
    let response = [];
    for(let i=0;i<input_params.length;i++){
      response.push(input_params[i]);
    }
    const sql2 = 'SELECT cust FROM test.dbo.[template] WHERE id = @id';
    const userService2 = new UserService2();
    const result2 = await userService2.getUserByUsername(sql2, {id: id});
    console.log("result2",result2[0].cust);
    const cust =JSON.parse(result2[0].cust);
    console.log('cust',cust);

    return response;
  }

  @get('/params')
  async getCustomData() {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

   const query = `
      SELECT
          cust1.option_name AS cust1,
          cust2.option_name AS cust2,
          cust3.option_name AS cust3,
          cust4.option_name AS cust4
      FROM
          test.dbo.[paramsOP] cust1
      LEFT JOIN
          test.dbo.[paramsOP] cust2 ON cust2.id_category = cust1.id_category+1
      LEFT JOIN
          test.dbo.[paramsOP] cust3 ON cust3.id_category = cust1.id_category+2
      LEFT JOIN
          test.dbo.[paramsOP] cust4 ON cust4.id_category = cust1.id_category+3
      WHERE
          cust1.id_category = 45
          AND cust2.start_date <= '${today}'
          AND cust2.end_date >= '${today}';
`;


    // Execute the query
    const userService = new UserService2();
    const result = await userService.getUserByUsername(query, {});
    console.log('result',result[0]);
    return result;
  }

  @get('/get-dump-users/{index}')
  async getDumpUsers(@param.path.number('index') index: number): Promise<any> {

    return userDump[index];
  }

}
