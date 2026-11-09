import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { calculateSessionTotals } from '@app/session/models';
import { parseMasterSessionLog } from './master-session-log.parser';

describe('parseMasterSessionLog', () => {
    const source = readFileSync(
        resolve(process.cwd(), 'data/2026_poker_sessions_master_log.txt'),
        'utf8',
    );

    it('parses the official log into player identities and session records', () => {
        const data = parseMasterSessionLog(source);

        expect(data.sessions).toHaveLength(15);
        expect(data.players.map((player) => player.name)).toContain('Josh');
        expect(data.players.map((player) => player.name)).not.toContain(
            'Oliver Ross',
        );

        const firstSession = data.sessions.find(
            (session) => session.id === 'session-1',
        );
        expect(firstSession?.date).toBe('2026-10-03');
        expect(firstSession && calculateSessionTotals(firstSession)).toEqual({
            totalBuyIn: 1090,
            totalCashOut: 1090,
            netTable: 0,
        });
    });

    it('preserves unbalanced source rows and the undated session', () => {
        const data = parseMasterSessionLog(source);
        const secondSession = data.sessions.find(
            (session) => session.id === 'session-2',
        );
        const sixthSession = data.sessions.find(
            (session) => session.id === 'session-6',
        );
        const undatedSession = data.sessions.find(
            (session) => session.id === 'session-16',
        );

        expect(
            secondSession && calculateSessionTotals(secondSession).netTable,
        ).toBe(-150);
        expect(
            sixthSession && calculateSessionTotals(sixthSession).netTable,
        ).toBe(749);
        expect(undatedSession?.date).toBeNull();
        expect(undatedSession?.players).toHaveLength(4);
    });
});
