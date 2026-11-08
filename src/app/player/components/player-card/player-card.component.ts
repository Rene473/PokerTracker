import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

import type { PlayerStatistics } from '../../models/player.model';

@Component({
    selector: 'app-player-card',
    standalone: true,
    imports: [CurrencyPipe, NgClass],
    templateUrl: './player-card.component.html',
    styleUrl: './player-card.component.scss',
})
export class PlayerCardComponent {
    @Input({ required: true }) player!: PlayerStatistics;
}
