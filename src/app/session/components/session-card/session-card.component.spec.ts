import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { SessionCardComponent } from './session-card.component';

describe('SessionCardComponent', () => {
    it('renders session totals and player names', async () => {
        await TestBed.configureTestingModule({
            imports: [SessionCardComponent],
        }).compileComponents();
        const fixture = TestBed.createComponent(SessionCardComponent);
        fixture.componentRef.setInput('session', {
            id: 's1',
            date: '2026-11-01',
            players: [{ playerId: 'p1', buyIn: 100, cashOut: 100 }],
        });
        fixture.componentRef.setInput('players', [{ id: 'p1', name: 'Alex' }]);
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain('Alex');
        expect(fixture.nativeElement.textContent).toContain('NZ$100.00');
        expect(fixture.nativeElement.textContent).toContain('Balanced');
    });
});
