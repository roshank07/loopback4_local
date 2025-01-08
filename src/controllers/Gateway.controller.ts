import {inject} from '@loopback/core';
import {post, Request, RestBindings} from '@loopback/rest';
import config from '../config/config.json';
import {commonFunction} from '../residual/common';
import {OldCompiler} from '../residual/old_compiler';
export class GatewayController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}
  @post('/gateway')
  async gateway(): Promise<object> {
    try{
    const javaClassPath=config.encJavaPath
    const javaClassPath2=config.decJavaPath
    const publicKeysPath=config.publicKeyPath
    const privateKeysPath=config.privateKeyPath
    const xmlData = `
      <data>
        <name>Roshannnn</name>
        <location>Mumbai</location>
      </data>
    `;
    const args=[publicKeysPath,xmlData];
    const compiler = new OldCompiler();
    console.time('spawn');
    const encData=await compiler.runJavaProcess(javaClassPath,args);
    console.timeEnd('spawn');
    console.log('encData-spawn wo compile->>>',encData);

    const args2=[privateKeysPath,encData];
    const compiler2 = new OldCompiler();
    console.time('spawn2');
    const decData=await compiler2.runJavaProcess(javaClassPath2,args2);
    console.timeEnd('spawn2');

    console.log('decData-spawn w/o compile->>>',decData);


    console.time('getEncryptData');

    const encData2 = await commonFunction.getEncryptData(publicKeysPath,xmlData);

    console.log('encData Java Service->>>',encData);

    console.timeEnd('getEncryptData');

    console.time('getDecryptData');

    const decData2 = await commonFunction.getDecryptData(privateKeysPath,encData);
    console.log('decData Java Service->>>',decData);

    console.timeEnd('getDecryptData');



    return {
      date: new Date(),
      url: this.req.url,
      encData,
      decData,
    };
  }catch(error){
    console.error('Error in GatewayController:', error);
    return {
      "message":"Internal Server Error"
    }
  }

  }

}
