import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@app/data': fileURLToPath(
                new URL('./src/app/data/index.ts', import.meta.url),
            ),
            '@app/leaderboard': fileURLToPath(
                new URL('./src/app/leaderboard/index.ts', import.meta.url),
            ),
            '@app/player/data-access': fileURLToPath(
                new URL(
                    './src/app/player/data-access/index.ts',
                    import.meta.url,
                ),
            ),
            '@app/player': fileURLToPath(
                new URL('./src/app/player/index.ts', import.meta.url),
            ),
            '@app/player/models': fileURLToPath(
                new URL('./src/app/player/models/index.ts', import.meta.url),
            ),
            '@app/session/data-access': fileURLToPath(
                new URL(
                    './src/app/session/data-access/index.ts',
                    import.meta.url,
                ),
            ),
            '@app/session': fileURLToPath(
                new URL('./src/app/session/index.ts', import.meta.url),
            ),
            '@app/session/models': fileURLToPath(
                new URL('./src/app/session/models/index.ts', import.meta.url),
            ),
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test-setup.ts'],
    },
});
