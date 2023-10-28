import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    base: '/Space-Explorer/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                planet_guide: resolve(__dirname, 'planet-guide.html'),
            },
        },
    },
})