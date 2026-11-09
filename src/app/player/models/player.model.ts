import type { PokerSession } from '@app/session/models';

export interface Player {
    id: string;
    name: string;
}

export interface PlayerStatistics extends Player {
    totalBuyIn: number;
    totalCashOut: number;
    netProfit: number;
    sessionsAttended: number;
}

export function calculatePlayerStatistics(
    players: Player[],
    sessions: PokerSession[],
): PlayerStatistics[] {
    return players
        .map((player) => {
            const results = sessions.flatMap((session) =>
                session.players.filter((entry) => entry.playerId === player.id),
            );
            const totalBuyIn = results.reduce(
                (total, result) => total + result.buyIn,
                0,
            );
            const totalCashOut = results.reduce(
                (total, result) => total + result.cashOut,
                0,
            );

            return {
                ...player,
                totalBuyIn,
                totalCashOut,
                netProfit: totalCashOut - totalBuyIn,
                sessionsAttended: results.length,
            };
        })
        .sort((left, right) => right.netProfit - left.netProfit);
}
