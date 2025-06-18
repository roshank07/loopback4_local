import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {get, Request, response, RestBindings} from '@loopback/rest';


export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  // Map to `GET /ping`
  @authenticate('jwt')
  @get('/ping')
  @response(200, {
    description: 'Ping Response',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            greeting: { type: 'string' },
            date: { type: 'string' },
            url: { type: 'string' },
            headers: {
              type: 'object',
              additionalProperties: true,
            },
            consultations: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: true,
              },
            },
          },
        },
      },
    },
  })
  async ping(): Promise<object> {
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers)
    };
  }
}
