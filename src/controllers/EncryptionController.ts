import {post, requestBody} from '@loopback/rest';
import {spawn} from 'child_process';

export class EncryptionController {
  constructor() {}

  @post('/encrypt')
  async encryptData(
    @requestBody({
      description: 'Request body with data and Java class path',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: {type: 'string'},
              publicKey: {type: 'string'},
              javaClassPath: {type: 'string'},
            },
            required: ['data', 'publicKey', 'javaClassPath'],
          },
        },
      },
    })
    requestBody: {data: string; publicKey: string; javaClassPath: string},
  ): Promise<object> {
    const {data, publicKey} = requestBody;
    const javaClassPath = 'java'
     console.time('encryption');
    return new Promise((resolve, reject) => {
      const javaProcess = spawn('java', ['-cp', javaClassPath, 'Encryptor', publicKey, data]);

      let encryptedData = '';
      let errorMessage = '';

      javaProcess.stdout.on('data', (chunk) => {
        encryptedData += chunk.toString();
      });

      javaProcess.stderr.on('data', (chunk) => {
        errorMessage += chunk.toString();
      });

      javaProcess.on('close', (code) => {
        if (code === 0) {
          resolve({encryptedData});
          console.timeEnd('encryption');
        } else {
          reject(new Error(errorMessage || 'Encryption process failed.'));
        }
      });
    });
  }
}
