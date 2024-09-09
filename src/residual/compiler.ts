import { spawn } from 'child_process';
import path from 'path';

export class Compiler {
  runJavaProcess(inputString: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const javaFilePath = path.resolve(__dirname, `../../${inputString}`);
      const javaDirPath = path.dirname(javaFilePath);
      const className = path.basename(javaFilePath, '.java'); // 'Main' from 'Main.java'

      console.log(`File Path: ${javaFilePath}`);
      console.log(`Directory Path: ${javaDirPath}`);
      console.log(`Class Name: ${className}`);

      const javaCompiler = spawn('javac', [javaFilePath]);
      javaCompiler.stdout.on('data', (data) => {
        // Handle standard output from the compiler if needed
      });
      javaCompiler.stderr.on('data', (data) => {
        reject(new Error(`Java Compilation Error: ${data.toString()}`));
      });

      javaCompiler.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Java compilation failed with exit code ${code}`));
          return;
        }

        const args=['Roshan','Kumar'].join('\n');

        const javaProcess = spawn('java', ['-cp', javaDirPath, className]);
        javaProcess.stdin.write(args);
        javaProcess.stdin.end();

        let output = '';
        let errorOccurred = false;

        // Capture stdout
        javaProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        // Capture stderr
        javaProcess.stderr.on('data', (data) => {
          errorOccurred = true;
          reject(new Error(`Java Error: ${data.toString()}`));
        });

        // Handle process exit
        javaProcess.on('close', (code) => {
          if (errorOccurred) return; // Error already handled

          if (code === 0) {
            resolve(output.trim());
          } else {
            reject(new Error(`Java process exited with code ${code}`));
          }
        });

        // Handle errors with the process itself (e.g., spawn failure)
        javaProcess.on('error', (error) => {
          reject(new Error(`Failed to start Java process: ${error.message}`));
        });

        // Pass input via stdin
       
      });
    });
  }
}
