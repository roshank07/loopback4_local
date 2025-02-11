import axios from 'axios';
export class commonFunction {
 // Method to call the external API
  static async getDecryptData(fileName: string,data: any): Promise<any> {
    try {
      const response = await axios.post(
        'http://localhost:8001/api/v1/decrypt',
        {
          fileName: fileName,
          data: data,
        },
        {
          headers: {
            'Content-Type': 'application/json',},
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error calling Java Decrypt Service API:', error);
      throw new Error('Failed to fetch data from Java Service for Decryption');
    }
  }
  static async getEncryptData(fileName: string,data: any): Promise<any> {
    try {
      const response = await axios.post(
        'http://localhost:8001/api/v1/encrypt',
        {
          fileName: fileName,
          data: data,
        },
        {
          headers: {
            'Content-Type': 'application/json',},
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error calling Java Encryption Service API:', error);
      throw new Error('Failed to fetch data from Java Service for Encryption');
    }
  }
   async generate12CharAlphanumericUUID(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uuid = '';
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      uuid += chars[randomIndex];
    }
    return uuid;
  }
}


