import robot from 'robotjs';
import fs from 'fs';
import Jimp from 'jimp';


  export const prnt_scrn = (x: number, y: number, width: number, height: number): any => {
    return new Promise(resolve => {
      const screen = robot.screen.capture(x, y, width, height);
      const data=[];

      const bitmap=screen.image;
      for(let i=0; i< bitmap.length; i+=4){
        data.push(bitmap[i+2], bitmap[i+1], bitmap[i], bitmap[i+3]);
      }

      const image = new Jimp({
        "data": new Uint8Array(data),
        "width": screen.width,
        "height": screen.height
      },
      function(err:any,image:any){
        if(err){
            fs.writeFile(__dirname+"/data/screen.png","",function(){});
        }else{
            image.write(__dirname+"/data/screen.png");
        } 
      }
      
      )

      resolve(image)
    })

}; 
