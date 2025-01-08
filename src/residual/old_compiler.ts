import {spawn} from 'child_process';
import path from 'path';

export class OldCompiler {
  runJavaProcess(javaClassPath: string,args: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // const javaFilePath = path.resolve(__dirname, `../../${inputString}`);
      const javaDirPath = path.dirname(javaClassPath);
      const className = path.basename(javaClassPath, '.class');
      // console.log(`Directory Path: ${javaDirPath}`);
      // console.log(`Class Name: ${className}`);
      const javaProcess: any = spawn('java', ['-cp', javaDirPath, className, ...args]);

      let result = '';
      let errorMessage = '';


        // Capture stdout
      javaProcess.stdout.on('data', (data:any) => {
        result += data.toString();
      });

        // Capture stderr
      javaProcess.stderr.on('data', (chunk:any) => {
        errorMessage += chunk.toString();
      });

        // Handle process exit
      javaProcess.on('close', (code:any) => {
        if (code === 0) {
          resolve(result);
        } else {
          console.error('Java Error:', errorMessage);
          reject(new Error(errorMessage || 'Encryption process failed.'));
        }
      });

        // Handle errors with the process itself (e.g., spawn failure)
        javaProcess.on('error', (error:any) => {
          reject(new Error(`Failed to start Java process: ${error.message}`));
        });

    });
  }
}
