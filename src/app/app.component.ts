import { Component } from '@angular/core';

import { LeaderboardPageComponent } from '@app/leaderboard';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [LeaderboardPageComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {}
