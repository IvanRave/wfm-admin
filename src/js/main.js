require(['require-config'], function () {
    'use strict';

    require(['jquery', 'angular', 'angular-route', 'jquery.bootstrap',
        'controllers/auth', 'controllers/wfm-parameter', 'controllers/job-type'
    ], function ($, angular) {

        var PRJ_MODULE_NAME = 'ang-cabinet-project';

        angular.module(PRJ_MODULE_NAME, ['ngRoute', 'ang-auth-controllers', 'ang-wfm-parameter-controllers', 'ang-job-type-controllers'])
        .config(['$routeProvider', '$httpProvider', '$interpolateProvider', function (rpr, angHttpProvider, angInterpolateProvider) {
            rpr
                .when('{{syst.logonUrl}}', { controller: 'AccountLogonCtrl', templateUrl: '.{{syst.tplUrl}}{{syst.logonUrl}}{{syst.tplExt}}' })
                .when('{{syst.logoffUrl}}', { controller: 'AccountLogoffCtrl', templateUrl: '.{{syst.tplUrl}}{{syst.logoffUrl}}{{syst.tplExt}}' })
                .when('{{syst.wfmParametersUrl}}', { controller: 'WfmParametersCtrl', templateUrl: '.{{syst.tplUrl}}{{syst.wfmParametersUrl}}{{syst.tplExt}}' })
                .when('{{syst.jobTypesUrl}}', { controller: 'JobTypeCtrl', templateUrl: '.{{syst.tplUrl}}{{syst.jobTypesUrl}}{{syst.tplExt}}' })
                .otherwise({ redirectTo: '/' });

            // Turn in CORS cookie support
            angHttpProvider.defaults.withCredentials = true;

            // Change standard curly braces tempate engine to {[{value}]}
            angInterpolateProvider.startSymbol('{[{').endSymbol('}]}');
        }])
        .run(['$rootScope', '$location', function (angRootScope, angLocation) {
            angRootScope.isLogged = true;
            angRootScope.getClass = function (path) {
                if (angLocation.path().substr(0, path.length) === path) {
                    return 'active';
                } else {
                    return '';
                }
            };
        }]);

        // Using jQuery dom ready because it will run this even if DOM load already happened
        $(function () {
            var wfmProject = document.getElementById('wfm-project');
            angular.bootstrap(wfmProject, [PRJ_MODULE_NAME]);
            $(wfmProject).removeClass('hide');
        });
    });
});