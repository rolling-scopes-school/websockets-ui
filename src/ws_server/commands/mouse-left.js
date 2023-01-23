import { mouse, left } from "@nut-tree/nut-js";

export default async (offsetValue) => {
    await mouse.move(left(offsetValue));
};