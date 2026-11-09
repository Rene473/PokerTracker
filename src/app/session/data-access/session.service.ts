import { Injectable, signal } from '@angular/core';

import { masterData } from '@app/data';
import { isSessionBalanced } from '../models/session.model';
import type { PokerSession } from '../models/session.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
    private readonly storageKey = 'poker-tracker.sessions.v2';
    readonly sessions = signal<PokerSession[]>(this.loadSessions());

    addSession(session: PokerSession): void {
        if (!isSessionBalanced(session)) {
            throw new Error('Session total buy-in must equal total cash-out.');
        }

        this.save([...this.sessions(), session]);
    }

    private loadSessions(): PokerSession[] {
        if (typeof window === 'undefined') {
            return masterData.sessions;
        }

        const storedSessions = window.localStorage.getItem(this.storageKey);

        if (!storedSessions) {
            window.localStorage.setItem(
                this.storageKey,
                JSON.stringify(masterData.sessions),
            );
            return masterData.sessions;
        }

        try {
            return JSON.parse(storedSessions) as PokerSession[];
        } catch {
            return masterData.sessions;
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
