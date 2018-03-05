module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        ts: {
            app: {
                files: [{
                    src: ['src/\*\*/\*.ts', '!src/.baseDir.ts', '!src/_all.d.ts'],
                    dest: 'build/'
                }]
            },
            options: {
                module: 'commonjs',
                target: 'es6',
                sourceMap: false,
                rootDir: 'src/'
            }
        },
        tslint: {
            options: {
                configuration: 'tslint.json'
            },
            files: {
                src: ['src/\*\*/\*.ts']
            }
        },
        watch: {
            ts: {
                files: ['js/src/\*\*/\*.ts', 'src/\*\*/\*.ts'],
                tasks: ['ts', 'tslint']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-tslint');

    grunt.registerTask('default', [
        'ts',
        'tslint',
    ]);
};
