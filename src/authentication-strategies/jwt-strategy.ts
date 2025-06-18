// src/authentication-strategies/jwt-strategy.ts
import {AuthenticationStrategy} from '@loopback/authentication';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import * as jwt from 'jsonwebtoken';
import {JWT} from '../config/config.json';

export class JWTStrategy implements AuthenticationStrategy {
  name = 'jwt';

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const authHeader = request.headers.authorization;
    // console.log("headeeer",authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')){
       throw new HttpErrors.BadRequest('JWT error: Token Missing')
    }

    const token = authHeader.split(' ')[1];
    console.log("token",token);
    const secret =JWT.secret;
    try {
      const decoded = jwt.verify(token, secret) as any;
      return {[securityId]: decoded.clientId, clientId: decoded.clientId, source: decoded.source};
    } catch (err) {
      console.error("JWT strategy error ",err)
      throw new HttpErrors.Unauthorized(`JWT error: Invalid Token`);
    }
  }
}
