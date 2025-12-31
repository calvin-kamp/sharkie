import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths()],
    resolve: {
        alias: {
            '@root': fileURLToPath(new URL('./src', import.meta.url)),
            '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
            '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
            '@models': fileURLToPath(new URL('./src/models', import.meta.url)),
            '@scripts': fileURLToPath(
                new URL('./src/scripts', import.meta.url)
            ),
        },
    },
})
