import { Injectable, signal } from '@angular/core';

import type { Player } from '@app/player/models';
import type { PokerSession } from '@app/session/models';
import { parseMasterSessionLog } from './master-session-log.parser';

@Injectable({ providedIn: 'root' })
export class MasterDataService {
    private readonly playersStorageKey = 'poker-tracker.players.v4';
    private readonly sessionsStorageKey = 'poker-tracker.sessions.v4';
    private officialPlayers: Player[] = [];
    private officialSessions: PokerSession[] = [];

    readonly players = signal<Player[]>([]);
    readonly sessions = signal<PokerSession[]>([]);
    readonly loading = signal(true);
    readonly error = signal<string | null>(null);

    constructor() {
        void this.load();
    }

    savePlayers(players: Player[]): void {
        const officialIds = new Set(
            this.officialPlayers.map((player) => player.id),
        );
        const additions = players.filter(
            (player) => !officialIds.has(player.id),
        );

        this.persist(this.playersStorageKey, additions);
        this.players.set([...this.officialPlayers, ...additions]);
    }

    saveSessions(sessions: PokerSession[]): void {
        const officialIds = new Set(
            this.officialSessions.map((session) => session.id),
        );
        const additions = sessions.filter(
            (session) => !officialIds.has(session.id),
        );

        this.persist(this.sessionsStorageKey, additions);
        this.sessions.set([...this.officialSessions, ...additions]);
    }

    private async load(): Promise<void> {
        if (typeof window === 'undefined') {
            this.loading.set(false);
            return;
        }

        try {
            const sourceUrl = new URL(
                'data/2026_poker_sessions_master_log.txt',
                document.baseURI,
            );
            const response = await fetch(sourceUrl);

            if (!response.ok) {
                throw new Error(
                    `Master log request failed (${response.status}).`,
                );
            }

            const parsed = parseMasterSessionLog(await response.text());
            this.officialPlayers = parsed.players;
            this.officialSessions = parsed.sessions;
            this.players.set([
                ...parsed.players,
                ...this.readStored(this.playersStorageKey, []),
            ]);
            this.sessions.set([
                ...parsed.sessions,
                ...this.readStored(this.sessionsStorageKey, []),
            ]);
        } catch (error) {
            this.error.set(
                error instanceof Error
                    ? error.message
                    : 'Unable to load master data.',
            );
        } finally {
            this.loading.set(false);
        }
    }

    private readStored<T>(key: string, fallback: T[]): T[] {
        const stored = window.localStorage.getItem(key);

        if (!stored) {
            this.persist(key, fallback);
            return fallback;
        }

        try {
            return JSON.parse(stored) as T[];
        } catch {
            this.persist(key, fallback);
            return fallback;
        }
    }

    private persist<T>(key: string, value: T): void {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
    }
}
