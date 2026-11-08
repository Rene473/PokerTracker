import { Injectable, signal } from '@angular/core';

import { fakeMasterData } from '@app/data';
import { isSessionBalanced } from '../models/session.model';
import type { PokerSession } from '../models/session.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
    private readonly storageKey = 'poker-tracker.sessions.v1';
    readonly sessions = signal<PokerSession[]>(this.loadSessions());

    addSession(session: PokerSession): void {
        if (!isSessionBalanced(session)) {
            throw new Error('Session total buy-in must equal total cash-out.');
        }

        this.save([...this.sessions(), session]);
    }

    private loadSessions(): PokerSession[] {
        if (typeof window === 'undefined') {
            return fakeMasterData.sessions;
        }

        const storedSessions = window.localStorage.getItem(this.storageKey);

        if (!storedSessions) {
            window.localStorage.setItem(
                this.storageKey,
                JSON.stringify(fakeMasterData.sessions),
            );
            return fakeMasterData.sessions;
        }

        try {
            return JSON.parse(storedSessions) as PokerSession[];
        } catch {
            return fakeMasterData.sessions;
        }
    }

    private save(sessions: PokerSession[]): void {
        this.sessions.set(sessions);

        if (typeof window !== 'undefined') {
            window.localStorage.setItem(
                this.storageKey,
                JSON.stringify(sessions),
            );
        }
    }
}
