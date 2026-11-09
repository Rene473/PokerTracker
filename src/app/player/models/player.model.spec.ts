import { describe, expect, it } from 'vitest';

import { calculatePlayerStatistics } from './player.model';
import { masterData } from '@app/data';

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

    it('adds new session results to imported cumulative totals', () => {
        const statistics = calculatePlayerStatistics(
            players,
            sessions.slice(0, 1),
            [
                {
                    playerId: 'alice',
                    totalBuyIn: 500,
                    totalCashOut: 400,
                    sessionsAttended: 8,
                },
            ],
        );

        expect(statistics.find(({ id }) => id === 'alice')).toMatchObject({
            id: 'alice',
            totalBuyIn: 600,
            totalCashOut: 580,
            netProfit: -20,
            sessionsAttended: 9,
        });
    });

    it('uses the cumulative winnings data as the leaderboard baseline', () => {
        const statistics = calculatePlayerStatistics(
            masterData.players,
            masterData.sessions,
            masterData.historicalTotals,
        );

        expect(statistics).toHaveLength(14);
        expect(statistics[0]).toMatchObject({
            name: 'Alex',
            totalBuyIn: 1370,
            totalCashOut: 2217.95,
            sessionsAttended: 14,
        });
        expect(statistics[0].netProfit).toBeCloseTo(847.95);
        expect(statistics.reduce((total, player) => total + player.netProfit, 0)).toBeCloseTo(-302.75);
    });
});
