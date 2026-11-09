import { computed, inject, Injectable } from '@angular/core';

import { MasterDataService } from '@app/data/data-access';
import { calculatePlayerStatistics } from '@app/player';
import { PlayerService } from '@app/player/data-access';
import { SessionService } from '@app/session/data-access';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
    private readonly playerService = inject(PlayerService);
    private readonly sessionService = inject(SessionService);
    private readonly masterDataService = inject(MasterDataService);

    readonly players = computed(() =>
        calculatePlayerStatistics(
            this.playerService.players(),
            this.sessionService.sessions(),
        ),
    );
    readonly sessions = this.sessionService.sessions;
    readonly playerDirectory = this.playerService.players;
    readonly loading = this.masterDataService.loading;
    readonly error = this.masterDataService.error;
}
