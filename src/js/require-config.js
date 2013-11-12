define([], function () {
    requirejs.config({
        paths: {
            'jquery.bootstrap': 'bootstrap'
        },
        shim: {
            'jquery.bootstrap': {deps: ['jquery']},
            'angular': { deps: ['jquery'], exports: 'angular' },
            'angular-route': { deps: ['angular'] },
            'angular-resource': { deps: ['angular'] }
        }
    });
});