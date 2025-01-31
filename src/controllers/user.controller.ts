import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  IsolationLevel,
  repository,
  Where
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
import cf from '../config/config.json';
import userDump from '../config/users.json';
import {MSSQLDataSource} from '../datasources/mssql.datasource';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories/user.repository';
import {commonFunction} from '../residual/common';
import {SqlService} from '../services/sqlservice.service';
import {UserService2} from '../services/user.service2';


export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
    // @inject('services.UserService') private userService: UserService,
    @inject('datasources.MSSQLDataSource') private dataSource: MSSQLDataSource,
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
   @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              password: { type: 'string' },
            },
            example: {
              username: '',
              password: '',
            },
          },
        },
      },
   }) req: any, @inject('rest.http.response') res: Response
  ): Promise<any> {

    try {
      // Execute raw SQL query
    const username = req.username;
    const psk=req.password;
    //  const publicKeysPath=cf.publicKeyPath
    // const xmlData = `
    //   <data>
    //     <name>Roshannnn</name>
    //     <location>Mumbai</location>
    //   </data>
    // `;


    // const errorQuery = `SELECT error_flag FROM test.dbo.[user] WHERE username='${username}'`; // Example query
    // const errorResult=await new SqlService().executeRawQuery(errorQuery);
    // // await new Promise(resolve => setTimeout(resolve, 5000));
    // let message='';
    // if(errorResult[0].error_flag == 1){
    //   await new SqlService().executeRawQuery(`update test.dbo.[user] set error_flag=0 where username='${username}'`);
    //   const query = `update test.dbo.[user] set password='${psk}' where username='${username}'`;
    //   await new SqlService().executeRawQuery(query);
    //   message='updated';
    //   console.log('external docker called',message);
    //   commonFunction.getEncryptData(publicKeysPath,xmlData);
    // } else{
    //   message='not updated';
    // }

    CREATE TABLE Employees (
    emp_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50),
    mobile_num BIGINT,
    isActive BIT
);

CREATE TABLE emp_details (
    emp_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50),
    mobile_num varchar(10),
    isActive BIT
);


// CREATE NONCLUSTERED INDEX IDX_empdetails_MobileNum
// ON emp_details (mobile_num);


// INSERT INTO emp_details (emp_id, name, mobile_num, isActive)
// SELECT emp_id, name, mobile_num, isActive FROM Employees;

// SELECT * FROM emp_details;

// select * from test.dbo.[emp_details] where emp_id='sdksjd' and mobile_num='sds' and  isActive=1;

      let missingFields:any = [];
      if(username&&psk){
        const query=`select * from test.dbo.[emp_details] where emp_id='${username}' and mobile_num='${psk}' and  isActive=1`;
        const result=await new SqlService().executeRawQuery(query);
        console.log('result',result);
        if(result.length == 0){{
          console.log('Employee_not_found');
        missingFields.push('Employee_not_found');
        }}
      } else{
        if(!username){
          missingFields.push('username');
        }
        if(!psk){
          missingFields.push('password');
        }
      }

      if(missingFields.length > 0){
        return res.status(200).json({
          status:'200',
          message:'Missing Fields',
          missingFields:missingFields
        })
      }

      return res.status(200).json({
        status:'200',
        name1:'Success',
      })
    } catch (error) {
     res.status(500).json({ status:500,message: error.message });
    }
  }

    @post('/findusersconn')
  async findById2(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              password: { type: 'string' },
            },
            example: {
              username: '',
              password: '',
            },
          },
        },
      },
    }) req: any, @inject('rest.http.response') res: Response
  ): Promise<any> {
    const username = req.username;
    const psk = req.password;
    const publicKeysPath=cf.publicKeyPath
    const xmlData = `
      <data>
        <name>Roshannnn</name>
        <location>Mumbai</location>
      </data>
    `;
    // Start a transaction using the DataSource
    const tx = await this.dataSource.beginTransaction({
      isolationLevel: IsolationLevel.READ_COMMITTED,
    });
    let x:any;
    try {
      // Lock the row for update
      const lockQuery = `SELECT * FROM test.dbo.[user] WITH (UPDLOCK, ROWLOCK) WHERE username='${username}'`;
      const record = await this.dataSource.execute(lockQuery, [], { transaction: tx });
       // Add a 5-second delay
      //  console.log("passss",psk)
      // await new Promise(resolve => setTimeout(resolve, 5000));
      console.log("passss2222222",psk)
      let message = '';
      if (record.length && record[0].error_flag) {
        // Update the flag in the database within the transaction
        const updateFlagQuery = `UPDATE test.dbo.[user] SET error_flag=0,password='${psk}' WHERE username='${username}'`;
        await this.dataSource.execute(updateFlagQuery, [], { transaction: tx });
         // Commit the transaction
        await tx.commit();
         x =commonFunction.getEncryptData(publicKeysPath,xmlData);

        message = 'updated';
      } else {
        message = 'not updated';
        // Commit the transaction
        await tx.commit();
      }
      console.log('x-----',x);
      return res.status(200).json({
        status: '200',
        message: message,
      });
    } catch (error) {
      // Rollback the transaction in case of an error
      await tx.rollback();
      console.error('Error in findById2222:', error);
      throw error;
    }
  }

   @post('/findusersversion')
  async findByIdVersion(
   @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              password: { type: 'string' },
            },
            example: {
              username: '',
              password: '',
            },
          },
        },
      },
   }) req: any, @inject('rest.http.response') res: Response
  ): Promise<any> {

    try {
      // Execute raw SQL query
    const uuid=await new commonFunction().generate12CharAlphanumericUUID();
    console.log('uuid',uuid);
    const username = req.username;
    const psk=req.password;
    const publicKeysPath=cf.publicKeyPath
    const xmlData = `
      <data>
        <name>Roshannnn</name>
        <location>Mumbai</location>
      </data>
    `;

    const errorQuery = `SELECT error_flag,version FROM test.dbo.[user] WHERE username='${username}'`;
    const errorResult=await new SqlService().executeRawQuery(errorQuery);
    console.log('errorResult',errorResult[0].error_flag);
    let message='';
    // if(errorResult[0].error_flag){
    //   const nextVersion=errorResult[0].version?errorResult[0].version+1:1;
    //   const currentVersion=errorResult[0].version;
    //   let rowsaffected=0;
    //   if(currentVersion == null){
    //     console.log("currentVersion is null",currentVersion,'--->',psk);
    //     const updateResult = await this.userRepository.updateAll({error_flag:false,password:psk,version:nextVersion},{username:username,version: {eq: null}});
    //     rowsaffected = updateResult.count;
    //     // query = `update test.dbo.[user] set password='${psk}',error_flag=0,version=${nextVersion} where username='${username}' and version IS NULL`;
    //   }else{
    //     console.log("currentVersion is not null",currentVersion,'--->',psk);
    //     const updateResult=await this.userRepository.updateAll({error_flag:false,password:psk,version:nextVersion},{username:username,version: currentVersion});
    //     rowsaffected =updateResult.count;
    //     // query = `update test.dbo.[user] set password='${psk}',error_flag=0,version=${nextVersion} where username='${username}' and version=${currentVersion}`;
    //   }
    //   // const updateCount=await new SqlService().executeRawQuery(query);
    //   console.log('rowsaffected',rowsaffected,'--->',psk);
    //   if(rowsaffected == 1){
    //     message='updated';
    //     console.log('external docker called',message);
    //     // commonFunction.getEncryptData(publicKeysPath,xmlData);
    //   } else{
    //     message='not updated';
    //   }
    // } else{
    //   console.log('error_flag is 0','--->',psk);
    //   message='not updated';
    // }
    if(errorResult[0].error_flag){
      const updateResult=await this.userRepository.updateAll({error_flag:0},{username:username,error_flag:errorResult[0].error_flag});
      console.log('updateResult',updateResult);
      const rowsaffected =updateResult.count;
       if(rowsaffected == 1){
        message='updated';
        console.log('external docker called',message);
        commonFunction.getEncryptData(publicKeysPath,xmlData).catch((err)=>{console.log('err',err)});
      } else{
        message='not updated';
      }

    }

    console.log('message before returnnnnnnnnn',message);
      return res.status(200).json({
        status:'200',
        message:message
      })
    } catch (error) {
      console.error('Error in findByIdVersion:', error);
     res.status(500).json({ status:500,message: error.message });
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

  // @get('/getTemplate/{id}')

  // async getTemplate(@param.path.number('id') id: number): Promise<any> {
  //   const sql = 'SELECT input_params FROM test.dbo.[template] WHERE id = @id';
  //   const userService = new UserService2();
  //   const result = await userService.getUserByUsername(sql, {id: id});
  //   console.log("result",result[0].input_params);
  //   const input_params =JSON.parse(result[0].input_params);
  //   let response = [];
  //   for(let i=0;i<input_params.length;i++){
  //     response.push(input_params[i]);
  //   }
  //   const sql2 = 'SELECT cust FROM test.dbo.[template] WHERE id = @id';
  //   const userService2 = new UserService2();
  //   const result2 = await userService2.getUserByUsername(sql2, {id: id});
  //   console.log("result2",result2[0].cust);
  //   const cust =JSON.parse(result2[0].cust);
  //   console.log('cust',cust);

  //   return response;
  // }

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
    // console.log('result',result[0]);
    return result;
  }

  @get('/get-dump-users/{index}')
  async getDumpUsers(@param.path.number('index') index: number): Promise<any> {

    return userDump[index];
  }

}
