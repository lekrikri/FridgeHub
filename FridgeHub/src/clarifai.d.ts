declare module 'clarifai' {
    export class App {
      constructor(options: { apiKey: string });
      models: {
        predict(model: string, image: { base64: string }): Promise<any>;
      };
    }
    export const GENERAL_MODEL: string;
  }
  