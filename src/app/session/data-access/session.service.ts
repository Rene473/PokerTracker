import { computed, inject, Injectable } from '@angular/core';

import { MasterDataService } from '@app/data/data-access';
import { isSessionBalanced } from '../models/session.model';
import type { PokerSession } from '../models/session.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
    private readonly masterDataService = inject(MasterDataService);
    readonly sessions = computed(() => this.masterDataService.sessions());

    addSession(session: PokerSession): void {
        if (!isSessionBalanced(session)) {
            throw new Error('Session total buy-in must equal total cash-out.');
        }

        this.masterDataService.saveSessions([...this.sessions(), session]);
    }
}
