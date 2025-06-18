import {inject} from '@loopback/core';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import jwt from 'jsonwebtoken';
import * as sc from '../config/config.json';
import {ClientService} from '../services/jwt-client-service';
export class AuthController {
  constructor(@inject('services.ClientService')
   private clientService: ClientService) {}

  @post('/token')
  async authToken( @requestBody() request: {clientId: string; clientSecret: string; source: string}): Promise<object> {
    try{
      if(!request.clientId || !request.clientSecret || !request.source){
        throw new HttpErrors.BadRequest('Invalid Request Body')
      }
      const client = await this.clientService.validate(request.clientId, request.clientSecret);
      if (!client || client.source !== request.source) {
        throw new HttpErrors.Unauthorized('Invalid credentials');
      }

      const secret= sc.JWT.secret;
      const timeOutInSec=sc.JWT.TIMEOUT;
      const source=client.source;

      const token = jwt.sign(
        {
          clientId: client.clientId,
          source: source,
        },
        secret,
        {
          expiresIn: timeOutInSec,
          issuer: `App: ${source}`,
        },
      );

      return {
        statusCode: 200,
        name: "Success",
        message:"Token generated Successfully",
        token:token,
        expiresIn:timeOutInSec
      }

  }catch(error){
    console.error('Error in /token:', error);
    // Re-throw if already an HttpError (like 400, 401)
    if (error instanceof HttpErrors.HttpError) throw error;

    // Otherwise, return 500
    throw new HttpErrors.InternalServerError('Internal Server Error');
  }

  }

}
