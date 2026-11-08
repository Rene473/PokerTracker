import type { Player } from '../player/models';
import type { PokerSession } from '../session/models';

export interface MasterData {
    players: Player[];
    sessions: PokerSession[];
}

export const fakeMasterData: MasterData = {
    players: [
        { id: 'p1', name: 'Alex' },
        { id: 'p2', name: 'Dhyanesh' },
        { id: 'p3', name: 'Rene' },
        { id: 'p4', name: 'Lachy' },
        { id: 'p5', name: 'Sam' },
    ],
    sessions: [
        {
            id: 's1',
            date: '2026-11-01',
            note: 'Sunday night cash game',
            players: [
                { playerId: 'p1', buyIn: 100, cashOut: 250 },
                { playerId: 'p2', buyIn: 100, cashOut: 50 },
                { playerId: 'p3', buyIn: 100, cashOut: 100 },
                { playerId: 'p4', buyIn: 200, cashOut: 100 },
            ],
        },
        {
            id: 's2',
            date: '2026-11-05',
            note: 'Thursday night cash game',
            players: [
                { playerId: 'p1', buyIn: 150, cashOut: 320 },
                { playerId: 'p2', buyIn: 150, cashOut: 120 },
                { playerId: 'p3', buyIn: 150, cashOut: 110 },
                { playerId: 'p5', buyIn: 200, cashOut: 100 },
            ],
        },
    ],
};
