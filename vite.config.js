import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    base: '/Space-Explorer/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                nested: resolve(__dirname, 'planet-guide.html'),
            },
        },
    },
})