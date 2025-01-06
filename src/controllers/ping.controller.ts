import {inject} from '@loopback/core';
import {get, Request, response, RestBindings} from '@loopback/rest';
import axios from 'axios';

export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  // Map to `GET /ping`
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
    // Call the external API
     console.time('getConsultations');
    const consultations = await this.getConsultations();
     console.timeEnd('getConsultations');
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
      consultations,
    };
  }

  // Method to call the external API
  async getConsultations(): Promise<any> {
    try {
      const response = await axios.post(
        'http://localhost:8080/public/api/consultations',
        {
          publicKey: 'pppppp',
          data: 'sppsdo',
        },
        {
          headers: {
            'Content-Type': 'application/json',          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error calling external API:', error);
      throw new Error('Failed to fetch consultations');
    }
  }
}
