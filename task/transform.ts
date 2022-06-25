import { Transform } from "stream";
import { Controller } from "./controller";


export class TransformMessage extends Transform {
    constructor(){
        super();
    }
    async _transform(chunk:Buffer, encoding:any, callback:any) {
      try {    
        let transform = await Controller(chunk.toString().trim().split(" "))
        callback(null, transform);
      } catch (err) {
        callback(err);
      }
    }
  }