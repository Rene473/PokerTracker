import type { Player, PlayerHistoricalTotals } from '../player/models';
import type { PokerSession } from '../session/models';

export interface MasterData {
    players: Player[];
    historicalTotals: PlayerHistoricalTotals[];
    sessions: PokerSession[];
}

export const masterData: MasterData = {
    players: [
        { id: 'p1', name: 'Alex' },
        { id: 'p2', name: 'Dhyanesh' },
        { id: 'p3', name: 'Jayden' },
        { id: 'p4', name: 'Leo' },
        { id: 'p5', name: 'Aum' },
        { id: 'p6', name: 'Rene' },
        { id: 'p7', name: 'Yeshan' },
        { id: 'p8', name: 'Louis' },
        { id: 'p9', name: 'Lucca' },
        { id: 'p10', name: 'Oliver Ross' },
        { id: 'p11', name: 'Zach' },
        { id: 'p12', name: 'Lachy' },
        { id: 'p13', name: 'Harry' },
        { id: 'p14', name: 'Eric' },
    ],
    // Historical aggregates parsed from data/cumulative-winnings.csv.
    historicalTotals: [
        { playerId: 'p1', totalBuyIn: 1370, totalCashOut: 2217.95, sessionsAttended: 14 },
        { playerId: 'p2', totalBuyIn: 1150, totalCashOut: 1463.95, sessionsAttended: 11 },
        { playerId: 'p3', totalBuyIn: 50, totalCashOut: 158, sessionsAttended: 1 },
        { playerId: 'p4', totalBuyIn: 1460, totalCashOut: 1557.55, sessionsAttended: 13 },
        { playerId: 'p5', totalBuyIn: 2275, totalCashOut: 2345.1, sessionsAttended: 14 },
        { playerId: 'p6', totalBuyIn: 1580, totalCashOut: 1588.6, sessionsAttended: 15 },
        { playerId: 'p7', totalBuyIn: 50, totalCashOut: 0, sessionsAttended: 1 },
        { playerId: 'p8', totalBuyIn: 100, totalCashOut: 0, sessionsAttended: 1 },
        { playerId: 'p9', totalBuyIn: 370, totalCashOut: 248.8, sessionsAttended: 4 },
        { playerId: 'p10', totalBuyIn: 150, totalCashOut: 0, sessionsAttended: 1 },
        { playerId: 'p11', totalBuyIn: 1475, totalCashOut: 1218.25, sessionsAttended: 14 },
        { playerId: 'p12', totalBuyIn: 330, totalCashOut: 0, sessionsAttended: 3 },
        { playerId: 'p13', totalBuyIn: 450, totalCashOut: 93.15, sessionsAttended: 4 },
        { playerId: 'p14', totalBuyIn: 2015, totalCashOut: 1630.9, sessionsAttended: 12 },
    ],
    sessions: [],
};
