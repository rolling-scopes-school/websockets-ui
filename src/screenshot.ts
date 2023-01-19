import { Region, mouse, screen, Image } from '@nut-tree/nut-js';
import Jimp from "jimp";

async function screenShot() {
    try {
        let { x, y } = await mouse.getPosition()
        const size = {
            width: await screen.width(),
            heigth: await screen.height()
        }
       if(x > size.width - 200){
        x = size.width - 200
       }else if(x < 200){
        x = 200
       }
       if(y > size.heigth - 200){
        y = size.heigth - 200
       } else if(y < 200){
        y = 200
       }

        const screeenShot = await screen.grabRegion(new Region(x, y, 200, 200));
        const img = new Jimp(screeenShot)
        let dataImg;
        img.getBase64(Jimp.MIME_PNG, (err, data) => {
            if (err) console.log(err);
            else {
                dataImg = data.slice(22)
            }
        })

        return `prnt_scrn ${dataImg}`
    } catch (error) {
        console.log(error);
        return "prnt_scrn"
    }
}

export default screenShot