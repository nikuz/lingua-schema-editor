module.exports = {
    apps : [{
        name: 'wisual',
        cwd: '/home/nikuz/lingua-schema-editor',
        script: './server/server-build/index.js',
        env: {
            NODE_ENV: 'production',
            STATIC_FILES_DIRECTORY: '/home/nikuz',
        },
    }],
};