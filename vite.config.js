import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'StyledStackCard',
            fileName: () => 'styled-stack-card.js',
            formats: ['es']
        },
        outDir: 'dist',
        emptyOutDir: true,
        // Forzamos a que el objetivo sea compatible con navegadores modernos estándar
        target: 'es2018',
        minify: false // Desactivamos temporalmente la minificación para ver si el error desaparece
    }
});