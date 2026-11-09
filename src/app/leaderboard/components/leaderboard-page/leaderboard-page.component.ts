import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { PlayerCardComponent } from '@app/player';
import { SessionCardComponent } from '@app/session';
import { LeaderboardService } from '../../data-access/leaderboard.service';

@Component({
    selector: 'app-leaderboard-page',
    standalone: true,
    imports: [CurrencyPipe, PlayerCardComponent, SessionCardComponent],
    templateUrl: './leaderboard-page.component.html',
    styleUrl: './leaderboard-page.component.scss',
})
export class LeaderboardPageComponent {
    private readonly leaderboardService = inject(LeaderboardService);

    readonly players = this.leaderboardService.players;
    readonly sessions = this.leaderboardService.sessions;
    readonly playerDirectory = this.leaderboardService.playerDirectory;
    readonly loading = this.leaderboardService.loading;
    readonly error = this.leaderboardService.error;

    get totalBuyIn(): number {
        return this.players().reduce(
            (total, player) => total + player.totalBuyIn,
            0,
        );
    }

    get totalCashOut(): number {
        return this.players().reduce(
            (total, player) => total + player.totalCashOut,
            0,
        );
    }

    get totalNet(): number {
        return this.players().reduce(
            (total, player) => total + player.netProfit,
            0,
        );
    }
}
