import { describe, expect, it } from 'vitest';

import { calculatePlayerStatistics } from './player.model';

const players = [
    { id: 'alice', name: 'Alice' },
    { id: 'ben', name: 'Ben' },
    { id: 'cara', name: 'Cara' },
];

const sessions = [
    {
        id: 'session-1',
        date: '2026-11-01',
        players: [
            { playerId: 'alice', buyIn: 100, cashOut: 180 },
            { playerId: 'ben', buyIn: 100, cashOut: 20 },
        ],
    },
    {
        id: 'session-2',
        date: '2026-11-08',
        players: [{ playerId: 'alice', buyIn: 50, cashOut: 70 }],
    },
];

describe('calculatePlayerStatistics', () => {
    it('aggregates buy-ins and cash-outs across attended sessions', () => {
        const [alice] = calculatePlayerStatistics(players, sessions);

        expect(alice).toMatchObject({
            id: 'alice',
            totalBuyIn: 150,
            totalCashOut: 250,
            netProfit: 100,
            sessionsAttended: 2,
        });
    });

    it('keeps players who missed sessions and sorts by net profit', () => {
        const statistics = calculatePlayerStatistics(players, sessions);

        expect(statistics.map(({ name }) => name)).toEqual([
            'Alice',
            'Cara',
            'Ben',
        ]);
        expect(statistics[1]).toMatchObject({
            name: 'Cara',
            netProfit: 0,
            sessionsAttended: 0,
        });
    });
});
