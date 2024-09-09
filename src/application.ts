import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {juggler, RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MSSQLDataSource} from './datasources/mssql.datasource';
import {MySequence} from './sequence';
import {EmailService} from './services/email.service';



export {ApplicationConfig};

export class LoopbackApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);
    this.bind('services.EmailService').toClass(EmailService);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.dataSource(MSSQLDataSource);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

  }
   async boot() {
    await super.boot();

    // Auto-migrate the database
    const ds: juggler.DataSource = await this.get('datasources.MSSQLDataSource');
    await ds.autoupdate();
    console.log('Database migration completed');
  }
}
