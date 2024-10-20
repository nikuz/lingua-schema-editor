import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            'src': path.resolve(__dirname, 'src'),
            'server-types': path.resolve(__dirname, 'server/src/types'),
            'server-schema-utils': path.resolve(__dirname, 'server/src/utils/schema.ts'),
        },
    },
});
