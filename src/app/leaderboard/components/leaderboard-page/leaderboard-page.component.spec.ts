import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, expect, it } from 'vitest';

import { MasterDataService } from '@app/data/data-access';
import { LeaderboardPageComponent } from './leaderboard-page.component';

describe('LeaderboardPageComponent', () => {
    it('renders the player standings and session history', async () => {
        await TestBed.configureTestingModule({
            imports: [LeaderboardPageComponent],
            providers: [
                {
                    provide: MasterDataService,
                    useValue: {
                        players: signal([{ id: 'player-alex', name: 'Alex' }]),
                        sessions: signal([
                            {
                                id: 'session-1',
                                date: '2026-10-03',
                                note: 'Session 1',
                                players: [
                                    {
                                        playerId: 'player-alex',
                                        buyIn: 50,
                                        cashOut: 158,
                                    },
                                ],
                            },
                        ]),
                        loading: signal(false),
                        error: signal(null),
                        savePlayers: () => undefined,
                        saveSessions: () => undefined,
                    },
                },
            ],
        }).compileComponents();
        const fixture = TestBed.createComponent(LeaderboardPageComponent);
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain('Leaderboard');
        expect(fixture.nativeElement.textContent).toContain('Alex');
        expect(fixture.nativeElement.textContent).toContain('Sessions');
    });
});
