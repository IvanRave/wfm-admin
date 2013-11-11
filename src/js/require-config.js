define([], function () {
    requirejs.config({
        paths: {
        },
        shim: {
            'angular': { deps: ['jquery'], exports: 'angular' },
            'angular-route': { deps: ['angular'] },
            'angular-resource': { deps: ['angular'] }
        }
    });
});