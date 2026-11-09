import type { Player } from '@app/player/models';
import type { PokerSession } from '@app/session/models';

export interface MasterData {
    players: Player[];
    sessions: PokerSession[];
}
