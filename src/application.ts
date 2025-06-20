import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
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
import {JWTStrategy} from './authentication-strategies/jwt-strategy';
import {EncryptionController} from './controllers';
import {GatewayController} from './controllers/Gateway.controller';
import {MSSQLDataSource} from './datasources/mssql.datasource';
import {setupGlobalErrorHandling} from './global-error-handler';
import {MySequence} from './sequence';
import {EmailService} from './services/email.service';
import {ClientService} from './services/jwt-client-service';


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
     // Set up global error handling
    setupGlobalErrorHandling(this);
    this.component(RestExplorerComponent);

     // Register the controller
    this.controller(EncryptionController);

    this.controller(GatewayController);

    this.dataSource(MSSQLDataSource);

    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTStrategy);

    this.bind('services.ClientService').toClass(ClientService);

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
