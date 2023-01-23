import { mouse, up } from "@nut-tree/nut-js";

export default async (offsetValue) => {
    await mouse.move(up(offsetValue));
};