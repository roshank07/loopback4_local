import { get } from '@loopback/rest';
import axios from 'axios';
import { Compiler } from '../residual/compiler';

export class JsonPlaceholderController {
  constructor() {}

  @get('/posts')
  async getPosts(): Promise<any> {
      // Fetch data from the external API
    const compiler = new Compiler();

      compiler.runJavaProcess('java/Main.java')
        .then(output => {
          console.log('Java Output:', output);
        })
        .catch(error => {
          console.error('Handled Error:', error.message);
          // Further error handling logic (logging, notifications, etc.)
        });
  }
}
