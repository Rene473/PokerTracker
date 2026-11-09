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

export interface PlayerHistoricalTotals {
    playerId: string;
    totalBuyIn: number;
    totalCashOut: number;
    sessionsAttended: number;
}

export function calculatePlayerStatistics(
    players: Player[],
    sessions: PokerSession[],
    historicalTotals: PlayerHistoricalTotals[] = [],
): PlayerStatistics[] {
    const historicalTotalsByPlayer = new Map(
        historicalTotals.map((totals) => [totals.playerId, totals]),
    );

    return players
        .map((player) => {
            const results = sessions.flatMap((session) =>
                session.players
                    .filter((entry) => entry.playerId === player.id)
            );
            const historical = historicalTotalsByPlayer.get(player.id);
            const totalBuyIn = results.reduce(
                (total, result) => total + result.buyIn,
                historical?.totalBuyIn ?? 0,
            );
            const totalCashOut = results.reduce(
                (total, result) => total + result.cashOut,
                historical?.totalCashOut ?? 0,
            );

            return {
                ...player,
                totalBuyIn,
                totalCashOut,
                netProfit: totalCashOut - totalBuyIn,
                sessionsAttended:
                    (historical?.sessionsAttended ?? 0) + results.length,
            };
        })
        .sort((left, right) => right.netProfit - left.netProfit);
}
