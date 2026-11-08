import { computed, inject, Injectable } from '@angular/core';

import { calculatePlayerStatistics } from '@app/player';
import { PlayerService } from '@app/player/data-access';
import { SessionService } from '@app/session/data-access';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
    private readonly playerService = inject(PlayerService);
    private readonly sessionService = inject(SessionService);

    readonly players = computed(() =>
        calculatePlayerStatistics(
            this.playerService.players(),
            this.sessionService.sessions(),
        ),
    );
    readonly sessions = this.sessionService.sessions;
    readonly playerDirectory = this.playerService.players;
}
