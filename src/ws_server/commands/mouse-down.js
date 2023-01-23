import { mouse, down } from "@nut-tree/nut-js";

export default async (offsetValue) => {
    await mouse.move(down(offsetValue));
};