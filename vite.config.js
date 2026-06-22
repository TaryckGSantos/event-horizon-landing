import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite'
import path from 'path'

const dirname = path.resolve()

export default defineConfig({
    root: 'sources',
    envDir: '../',
    publicDir: '../public',
    build:
    {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: false
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    },
    plugins: [glsl()]
})