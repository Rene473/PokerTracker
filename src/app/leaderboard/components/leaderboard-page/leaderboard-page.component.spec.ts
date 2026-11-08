import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { LeaderboardPageComponent } from './leaderboard-page.component';

describe('LeaderboardPageComponent', () => {
    it('renders the fake master-data leaderboard and sessions', async () => {
        await TestBed.configureTestingModule({
            imports: [LeaderboardPageComponent],
        }).compileComponents();
        const fixture = TestBed.createComponent(LeaderboardPageComponent);
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain('Leaderboard');
        expect(fixture.nativeElement.textContent).toContain('Alex');
        expect(fixture.nativeElement.textContent).toContain('Sessions');
    });
});
