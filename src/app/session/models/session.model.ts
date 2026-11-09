export interface SessionPlayerResult {
    playerId: string;
    buyIn: number;
    cashOut: number;
}

export interface PokerSession {
    id: string;
    date: string | null;
    note?: string;
    players: SessionPlayerResult[];
}

export interface SessionTotals {
    totalBuyIn: number;
    totalCashOut: number;
    netTable: number;
}

export function calculateSessionTotals(session: PokerSession): SessionTotals {
    const totalBuyIn = session.players.reduce(
        (total, player) => total + player.buyIn,
        0,
    );
    const totalCashOut = session.players.reduce(
        (total, player) => total + player.cashOut,
        0,
    );

    return {
        totalBuyIn,
        totalCashOut,
        netTable: totalCashOut - totalBuyIn,
    };
}

export function isSessionBalanced(session: PokerSession): boolean {
    const { netTable } = calculateSessionTotals(session);
    return Math.abs(netTable) < 0.01;
}
