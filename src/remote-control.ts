import { mouse, left, right, down, up, Button, straightTo, Point, screen, Region } from "@nut-tree/nut-js";
import { checkCoordinates } from "./helpers/position-handler";
import Jimp from "jimp/*";
import { getScreenShot } from "./helpers/print-screen";

export class RemoteControl {
    constructor() { }

    public async mouse_move_left(command: string, px: number): Promise<string> {
        await mouse.move(left(px));
        return command;
    }

    public async mouse_move_right(command: string, px: number): Promise<string> {
        await mouse.move(right(px));
        return command;
    }

    public async mouse_move_down(command: string, px: number): Promise<string> {
        await mouse.move(down(px));
        return command;
    }

    public async mouse_move_up(command: string, px: number): Promise<string> {
        await mouse.move(up(px));
        return command;
    }

    public async mouse_position(command: string): Promise<string> {
        const position = await mouse.getPosition();
        return command + ` ${position.x},${position.y}`;
    }

    public async draw_square(command: string, px: number): Promise<string> {
        await this.releasePressedButton();
        await mouse.move(right(px));
        await this.releasePressedButton();
        await mouse.move(down(px));
        await this.releasePressedButton();
        await mouse.move(left(px));
        await this.releasePressedButton();
        await mouse.move(up(px));
        await mouse.releaseButton(Button.LEFT);
        return command;
    }

    public async draw_rectangle(command: string, px: number, py: number): Promise<string> {
        await this.releasePressedButton();
        await mouse.move(right(px));
        await this.releasePressedButton();
        await mouse.move(down(py));
        await this.releasePressedButton();
        await mouse.move(left(px));
        await this.releasePressedButton();
        await mouse.move(up(py));
        await mouse.releaseButton(Button.LEFT);
        return command;
    }

    public async draw_circle(command, px) {
        const radius = px;
        const { x, y } = await mouse.getPosition();
        await this.releasePressedButton();

        for (let i = 0; i < 360; i++) {
            const rad = (i / 180) * Math.PI;
            const cx = radius * Math.cos(rad) + x - radius;
            const cy = radius * Math.sin(rad) + y;
            await checkCoordinates(cx, cy);
            await mouse.move(straightTo(new Point(cx, cy)));
        }

        await mouse.releaseButton(Button.LEFT)
        return command;
    }

    public async print_screen(command) {
        const { left, top, width, height } = await getScreenShot();
        const image = await (await screen.grabRegion(new Region(left, top, width, height))).toRGB();

        const jimp = new Jimp({
            data: image.data,
            width: image.width,
            height: image.height
        });

        const base64Buffer = await jimp.getBufferAsync(Jimp.MIME_PNG);
        const base64 = base64Buffer.toString('base64');

        return `${command} ${base64}`;
    }

    private async releasePressedButton() {
        await mouse.releaseButton(Button.LEFT);
        await mouse.pressButton(Button.LEFT);
    }
}