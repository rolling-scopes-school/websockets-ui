import { ShipsTypes } from '../enum/ships.types';
import { DeckStatus } from '../enum/deck.status';

export const listOfBotShipScheme = [
    [
        {
            position: [
                { x: 5, y: 4, status: DeckStatus.DECK_INTACT },
                { x: 6, y: 4, status: DeckStatus.DECK_INTACT },
                { x: 7, y: 4, status: DeckStatus.DECK_INTACT },
                { x: 8, y: 4, status: DeckStatus.DECK_INTACT },
            ],
            direction: false,
            type: ShipsTypes.HUGE,
            length: 4,
        },
        {
            position: [
                { x: 8, y: 0, status: DeckStatus.DECK_INTACT },
                { x: 8, y: 1, status: DeckStatus.DECK_INTACT },
                { x: 8, y: 2, status: DeckStatus.DECK_INTACT },
            ],
            direction: true,
            type: ShipsTypes.LARGE,
            length: 3,
        },
        {
            position: [
                { x: 5, y: 6, status: DeckStatus.DECK_INTACT },
                { x: 6, y: 6, status: DeckStatus.DECK_INTACT },
                { x: 7, y: 6, status: DeckStatus.DECK_INTACT },
            ],
            direction: false,
            type: ShipsTypes.LARGE,
            length: 3,
        },
        {
            position: [
                { x: 1, y: 6, status: DeckStatus.DECK_INTACT },
                { x: 2, y: 6, status: DeckStatus.DECK_INTACT },
            ],
            direction: false,
            type: ShipsTypes.MEDIUM,
            length: 2,
        },
        {
            position: [
                { x: 2, y: 2, status: DeckStatus.DECK_INTACT },
                { x: 2, y: 3, status: DeckStatus.DECK_INTACT },
            ],
            direction: true,
            type: ShipsTypes.MEDIUM,
            length: 2,
        },
        {
            position: [
                { x: 5, y: 8, status: DeckStatus.DECK_INTACT },
                { x: 6, y: 8, status: DeckStatus.DECK_INTACT },
            ],
            direction: false,
            type: ShipsTypes.MEDIUM,
            length: 2,
        },
        {
            position: [{ x: 1, y: 8, status: DeckStatus.DECK_INTACT }],
            direction: false,
            type: ShipsTypes.SMALL,
            length: 1,
        },
        {
            position: [{ x: 2, y: 0, status: DeckStatus.DECK_INTACT }],
            direction: true,
            type: ShipsTypes.SMALL,
            length: 1,
        },
        {
            position: [{ x: 0, y: 3, status: DeckStatus.DECK_INTACT }],
            direction: false,
            type: ShipsTypes.SMALL,
            length: 1,
        },
        {
            position: [{ x: 9, y: 6, status: DeckStatus.DECK_INTACT }],
            direction: false,
            type: ShipsTypes.SMALL,
            length: 1,
        },
    ],
    [
        {
            position: [
                { x: 5, y: 4, status: DeckStatus.DECK_INTACT },
                { x: 5, y: 5, status: DeckStatus.DECK_INTACT },
                { x: 5, y: 6, status: DeckStatus.DECK_INTACT },
                { x: 5, y: 7, status: DeckStatus.DECK_INTACT },
            ],
            direction: true,
            type: ShipsTypes.HUGE,
            length: 4,
        },
        {
            position: [
                { x: 1, y: 3, status: DeckStatus.DECK_INTACT },
                { x: 1, y: 4, status: DeckStatus.DECK_INTACT },
                { x: 1, y: 5, status: DeckStatus.DECK_INTACT },
            ],
            direction: true,
            type: ShipsTypes.LARGE,
            length: 3,
        },
        {
            position: [
                { x: 7, y: 3, status: DeckStatus.DECK_INTACT },
                { x: 8, y: 3, status: DeckStatus.DECK_INTACT },
                { x: 9, y: 3, status: DeckStatus.DECK_INTACT },
            ],
            direction: false,
            type: ShipsTypes.LARGE,
            length: 3,
        },
        {
            position: [
                { x: 6, y: 0, status: DeckStatus.DECK_INTACT },
                { x: 7, y: 0, status: DeckStatus.DECK_INTACT },
            ],
            direction: false,
            type: ShipsTypes.MEDIUM,
            length: 2,
        },
        {
            position: [
                { x: 1, y: 0, status: DeckStatus.DECK_INTACT },
                { x: 1, y: 1, status: DeckStatus.DECK_INTACT },
            ],
            direction: true,
            type: ShipsTypes.MEDIUM,
            length: 2,
        },
        {
            position: [
                { x: 7, y: 5, status: DeckStatus.DECK_INTACT },
                { x: 7, y: 6, status: DeckStatus.DECK_INTACT },
            ],
            direction: true,
            type: ShipsTypes.MEDIUM,
            length: 2,
        },
        {
            position: [{ x: 1, y: 8, status: DeckStatus.DECK_INTACT }],
            direction: true,
            type: ShipsTypes.SMALL,
            length: 1,
        },
        {
            position: [{ x: 8, y: 8, status: DeckStatus.DECK_INTACT }],
            direction: true,
            type: ShipsTypes.SMALL,
            length: 1,
        },
        {
            position: [{ x: 4, y: 0, status: DeckStatus.DECK_INTACT }],
            direction: true,
            type: ShipsTypes.SMALL,
            length: 1,
        },
        {
            position: [{ x: 3, y: 4, status: DeckStatus.DECK_INTACT }],
            direction: true,
            type: ShipsTypes.SMALL,
            length: 1,
        },
    ],
    [
        {
            position: [
                { x: 0, y: 1, status: DeckStatus.DECK_INTACT },
                { x: 0, y: 2, status: DeckStatus.DECK_INTACT },
                { x: 0, y: 3, status: DeckStatus.DECK_INTACT },
                { x: 0, y: 4, status: DeckStatus.DECK_INTACT },
            ],
            direction: true,
            type: ShipsTypes.HUGE,
            length: 4,
        },
        {
            position: [
                { x: 9, y: 1, status: DeckStatus.DECK_INTACT },
                { x: 9, y: 2, status: DeckStatus.DECK_INTACT },
                { x: 9, y: 3, status: DeckStatus.DECK_INTACT },
            ],
            direction: true,
            type: ShipsTypes.LARGE,
            length: 3,
        },
        {
            position: [
                { x: 4, y: 6, status: DeckStatus.DECK_INTACT },
                { x: 5, y: 6, status: DeckStatus.DECK_INTACT },
                { x: 6, y: 6, status: DeckStatus.DECK_INTACT },
            ],
            direction: false,
            type: ShipsTypes.LARGE,
            length: 3,
        },
        {
            position: [
                { x: 2, y: 0, status: DeckStatus.DECK_INTACT },
                { x: 2, y: 1, status: DeckStatus.DECK_INTACT },
            ],
            direction: true,
            type: ShipsTypes.MEDIUM,
            length: 2,
        },
        {
            position: [
                { x: 8, y: 5, status: DeckStatus.DECK_INTACT },
                { x: 9, y: 5, status: DeckStatus.DECK_INTACT },
            ],
            direction: false,
            type: ShipsTypes.MEDIUM,
            length: 2,
        },
        {
            position: [
                { x: 4, y: 1, status: DeckStatus.DECK_INTACT },
                { x: 5, y: 1, status: DeckStatus.DECK_INTACT },
            ],
            direction: false,
            type: ShipsTypes.MEDIUM,
            length: 2,
        },
        {
            position: [{ x: 0, y: 8, status: DeckStatus.DECK_INTACT }],
            direction: false,
            type: ShipsTypes.SMALL,
            length: 1,
        },
        {
            position: [{ x: 7, y: 1, status: DeckStatus.DECK_INTACT }],
            direction: true,
            type: ShipsTypes.SMALL,
            length: 1,
        },
        {
            position: [{ x: 2, y: 7, status: DeckStatus.DECK_INTACT }],
            direction: false,
            type: ShipsTypes.SMALL,
            length: 1,
        },
        {
            position: [{ x: 0, y: 6, status: DeckStatus.DECK_INTACT }],
            direction: false,
            type: ShipsTypes.SMALL,
            length: 1,
        },
    ],
    [
        {
            position: [
                { x: 8, y: 2, status: DeckStatus.DECK_INTACT },
                { x: 8, y: 3, status: DeckStatus.DECK_INTACT },
                { x: 8, y: 4, status: DeckStatus.DECK_INTACT },
                { x: 8, y: 5, status: DeckStatus.DECK_INTACT },
            ],
            direction: true,
            type: ShipsTypes.HUGE,
            length: 4,
        },
        {
            position: [
                { x: 3, y: 6, status: DeckStatus.DECK_INTACT },
                { x: 4, y: 6, status: DeckStatus.DECK_INTACT },
                { x: 5, y: 6, status: DeckStatus.DECK_INTACT },
            ],
            direction: false,
            type: ShipsTypes.LARGE,
            length: 3,
        },
        {
            position: [
                { x: 7, y: 7, status: DeckStatus.DECK_INTACT },
                { x: 8, y: 7, status: DeckStatus.DECK_INTACT },
                { x: 9, y: 7, status: DeckStatus.DECK_INTACT },
            ],
            direction: false,
            type: ShipsTypes.LARGE,
            length: 3,
        },
        {
            position: [
                { x: 1, y: 7, status: DeckStatus.DECK_INTACT },
                { x: 1, y: 8, status: DeckStatus.DECK_INTACT },
            ],
            direction: true,
            type: ShipsTypes.MEDIUM,
            length: 2,
        },
        {
            position: [
                { x: 5, y: 1, status: DeckStatus.DECK_INTACT },
                { x: 5, y: 2, status: DeckStatus.DECK_INTACT },
            ],
            direction: true,
            type: ShipsTypes.MEDIUM,
            length: 2,
        },
        {
            position: [
                { x: 3, y: 2, status: DeckStatus.DECK_INTACT },
                { x: 3, y: 3, status: DeckStatus.DECK_INTACT },
            ],
            direction: true,
            type: ShipsTypes.MEDIUM,
            length: 2,
        },
        {
            position: [{ x: 3, y: 0, status: DeckStatus.DECK_INTACT }],
            direction: true,
            type: ShipsTypes.SMALL,
            length: 1,
        },
        {
            position: [{ x: 0, y: 5, status: DeckStatus.DECK_INTACT }],
            direction: false,
            type: ShipsTypes.SMALL,
            length: 1,
        },
        {
            position: [{ x: 6, y: 4, status: DeckStatus.DECK_INTACT }],
            direction: true,
            type: ShipsTypes.SMALL,
            length: 1,
        },
        {
            position: [{ x: 0, y: 0, status: DeckStatus.DECK_INTACT }],
            direction: false,
            type: ShipsTypes.SMALL,
            length: 1,
        },
    ],
    [
        {
            position: [
                { x: 1, y: 3, status: DeckStatus.DECK_INTACT },
                { x: 1, y: 4, status: DeckStatus.DECK_INTACT },
                { x: 1, y: 5, status: DeckStatus.DECK_INTACT },
                { x: 1, y: 6, status: DeckStatus.DECK_INTACT },
            ],
            direction: true,
            type: ShipsTypes.HUGE,
            length: 4,
        },
        {
            position: [
                { x: 5, y: 6, status: DeckStatus.DECK_INTACT },
                { x: 6, y: 6, status: DeckStatus.DECK_INTACT },
                { x: 7, y: 6, status: DeckStatus.DECK_INTACT },
            ],
            direction: false,
            type: ShipsTypes.LARGE,
            length: 3,
        },
        {
            position: [
                { x: 5, y: 4, status: DeckStatus.DECK_INTACT },
                { x: 6, y: 4, status: DeckStatus.DECK_INTACT },
                { x: 7, y: 4, status: DeckStatus.DECK_INTACT },
            ],
            direction: false,
            type: ShipsTypes.LARGE,
            length: 3,
        },
        {
            position: [
                { x: 1, y: 9, status: DeckStatus.DECK_INTACT },
                { x: 2, y: 9, status: DeckStatus.DECK_INTACT },
            ],
            direction: false,
            type: ShipsTypes.MEDIUM,
            length: 2,
        },
        {
            position: [
                { x: 6, y: 2, status: DeckStatus.DECK_INTACT },
                { x: 7, y: 2, status: DeckStatus.DECK_INTACT },
            ],
            direction: false,
            type: ShipsTypes.MEDIUM,
            length: 2,
        },
        {
            position: [
                { x: 2, y: 0, status: DeckStatus.DECK_INTACT },
                { x: 2, y: 1, status: DeckStatus.DECK_INTACT },
            ],
            direction: true,
            type: ShipsTypes.MEDIUM,
            length: 2,
        },
        {
            position: [{ x: 3, y: 3, status: DeckStatus.DECK_INTACT }],
            direction: true,
            type: ShipsTypes.SMALL,
            length: 1,
        },
        {
            position: [{ x: 0, y: 1, status: DeckStatus.DECK_INTACT }],
            direction: false,
            type: ShipsTypes.SMALL,
            length: 1,
        },
        {
            position: [{ x: 3, y: 7, status: DeckStatus.DECK_INTACT }],
            direction: false,
            type: ShipsTypes.SMALL,
            length: 1,
        },
        {
            position: [{ x: 7, y: 0, status: DeckStatus.DECK_INTACT }],
            direction: true,
            type: ShipsTypes.SMALL,
            length: 1,
        },
    ],
];
