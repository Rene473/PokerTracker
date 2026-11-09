import type { Player } from '@app/player/models';
import type { PokerSession, SessionPlayerResult } from '@app/session/models';

export interface ParsedSessionLog {
    players: Player[];
    sessions: PokerSession[];
}

const sessionHeader =
    'session_id,date,player,buyin_total,cashout_total,net_profit';

export function parseMasterSessionLog(source: string): ParsedSessionLog {
    const lines = source.split(/\r?\n/);
    const headerIndex = lines.findIndex(
        (line) => line.trim().toLowerCase() === sessionHeader,
    );

    if (headerIndex < 0) {
        throw new Error('The master log CSV header was not found.');
    }

    const players = new Map<string, Player>();
    const sessions = new Map<string, PokerSession>();

    for (const line of lines.slice(headerIndex + 1)) {
        const trimmedLine = line.trim();

        if (!trimmedLine || trimmedLine.startsWith('====')) {
            break;
        }

        const [sessionLabel, dateValue, playerName, buyInValue, cashOutValue] =
            trimmedLine.split(',').map((value) => value.trim());

        if (!sessionLabel || !dateValue || !playerName) {
            continue;
        }

        const buyIn = Number(buyInValue);
        const cashOut = Number(cashOutValue);

        if (!Number.isFinite(buyIn) || !Number.isFinite(cashOut)) {
            throw new Error(
                `Invalid buy-in or cash-out in row: ${trimmedLine}`,
            );
        }

        const playerId = toPlayerId(playerName);
        if (!players.has(playerId)) {
            players.set(playerId, { id: playerId, name: playerName });
        }

        const sessionId = toSessionId(sessionLabel);
        let session = sessions.get(sessionId);

        if (!session) {
            session = {
                id: sessionId,
                date: parseSessionDate(dateValue),
                note: sessionLabel,
                players: [],
            };
            sessions.set(sessionId, session);
        }

        const entry: SessionPlayerResult = { playerId, buyIn, cashOut };
        session.players.push(entry);
    }

    if (!sessions.size) {
        throw new Error('The master log did not contain any session rows.');
    }

    return {
        players: [...players.values()],
        sessions: [...sessions.values()].sort(
            (left, right) => sessionNumber(left.id) - sessionNumber(right.id),
        ),
    };
}

function toPlayerId(name: string): string {
    return `player-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function toSessionId(label: string): string {
    return label.toLowerCase().replace(/\s+/g, '-');
}

function sessionNumber(id: string): number {
    return Number(id.match(/\d+/)?.[0] ?? 0);
}

function parseSessionDate(value: string): string | null {
    if (value.toLowerCase() === 'undated') {
        return null;
    }

    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) {
        throw new Error(`Invalid session date: ${value}`);
    }

    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
}
