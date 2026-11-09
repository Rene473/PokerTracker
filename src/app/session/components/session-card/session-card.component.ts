import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import type { Player } from '@app/player/models';
import { calculateSessionTotals } from '../../models/session.model';
import type { PokerSession } from '../../models/session.model';

@Component({
    selector: 'app-session-card',
    standalone: true,
    imports: [CurrencyPipe, DatePipe],
    templateUrl: './session-card.component.html',
    styleUrl: './session-card.component.scss',
})
export class SessionCardComponent {
    @Input({ required: true }) session!: PokerSession;
    @Input({ required: true }) players!: Player[];

    get totals() {
        return calculateSessionTotals(this.session);
    }

    get isBalanced(): boolean {
        return Math.abs(this.totals.netTable) < 0.01;
    }

    playerName(playerId: string): string {
        return (
            this.players.find((player) => player.id === playerId)?.name ??
            'Unknown player'
        );
    }
}
