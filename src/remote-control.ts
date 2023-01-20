import { mouse, left, right, down, up, Button } from "@nut-tree/nut-js";

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
        await mouse.pressButton(Button.LEFT);
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
        await mouse.pressButton(Button.LEFT);
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

    private async releasePressedButton() {
        await mouse.releaseButton(Button.LEFT);
        await mouse.pressButton(Button.LEFT);
    }

    async draw_circle(command: string, px: number, py: number): Promise<string> {
        await mouse.pressButton(0);
        await mouse.move(right(px));
        await mouse.move(down(py));
        await mouse.move(left(px));
        await mouse.move(up(py));
        await mouse.releaseButton(0);
        return command;
    }
}