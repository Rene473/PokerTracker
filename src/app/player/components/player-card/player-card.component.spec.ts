import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { PlayerCardComponent } from './player-card.component';

describe('PlayerCardComponent', () => {
    it('renders the player identity and session-derived totals', async () => {
        await TestBed.configureTestingModule({
            imports: [PlayerCardComponent],
        }).compileComponents();
        const fixture = TestBed.createComponent(PlayerCardComponent);
        fixture.componentRef.setInput('player', {
            id: 'p1',
            name: 'Alex',
            totalBuyIn: 150,
            totalCashOut: 250,
            netProfit: 100,
            sessionsAttended: 2,
        });
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain('Alex');
        expect(fixture.nativeElement.textContent).toContain(
            '2 sessions played',
        );
        expect(fixture.nativeElement.textContent).toContain('$100.00');
    });
});
