import { mouse, right } from "@nut-tree/nut-js";

export default async (offsetValue) => {
    await mouse.move(right(offsetValue));
};