import { computed, inject, Injectable } from '@angular/core';

import { MasterDataService } from '@app/data/data-access';
import type { Player } from '../models/player.model';

@Injectable({ providedIn: 'root' })
export class PlayerService {
    private readonly masterDataService = inject(MasterDataService);
    readonly players = computed(() => this.masterDataService.players());

    addPlayer(player: Player): void {
        if (this.players().some((existing) => existing.id === player.id)) {
            throw new Error(`Player with id "${player.id}" already exists.`);
        }

        this.masterDataService.savePlayers([...this.players(), player]);
    }
}
