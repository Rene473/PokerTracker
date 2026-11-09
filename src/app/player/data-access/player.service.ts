import { Injectable, signal } from '@angular/core';

import { masterData } from '@app/data';
import type { Player } from '../models/player.model';

@Injectable({ providedIn: 'root' })
export class PlayerService {
    private readonly storageKey = 'poker-tracker.players.v2';
    readonly players = signal<Player[]>(this.loadPlayers());

    addPlayer(player: Player): void {
        if (this.players().some((existing) => existing.id === player.id)) {
            throw new Error(`Player with id "${player.id}" already exists.`);
        }

        this.save([...this.players(), player]);
    }

    private loadPlayers(): Player[] {
        if (typeof window === 'undefined') {
            return masterData.players;
        }

        const storedPlayers = window.localStorage.getItem(this.storageKey);

        if (!storedPlayers) {
            window.localStorage.setItem(
                this.storageKey,
                JSON.stringify(masterData.players),
            );
            return masterData.players;
        }

        try {
            return JSON.parse(storedPlayers) as Player[];
        } catch {
            return masterData.players;
        }
    }

    private save(players: Player[]): void {
        this.players.set(players);

        if (typeof window !== 'undefined') {
            window.localStorage.setItem(
                this.storageKey,
                JSON.stringify(players),
            );
        }
    }
}
