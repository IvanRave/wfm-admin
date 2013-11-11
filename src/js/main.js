require(['require-config'], function () {
    'use strict';

    require(['jquery', 'angular', 'angular-route', 'app/controllers', 'jquery.bootstrap'], function ($, angular) {

        var PRJ_MODULE_NAME = 'ang-cabinet-project';

        angular.module(PRJ_MODULE_NAME, ['ngRoute', 'ang-cabinet-controllers'])
        .config(['$routeProvider', '$httpProvider', '$interpolateProvider', function (rpr, angHttpProvider, angInterpolateProvider) {
            rpr
                //.when('/{{syst.logonUrl}}', { controller: 'AccountLogonCtrl', templateUrl: tplFolder + '{{syst.logonUrl}}.html' })
                //.when('/{{syst.logoffUrl}}', { controller: 'AccountLogoffCtrl', templateUrl: tplFolder + '{{syst.logoffUrl}}.html' })
                .when('{{syst.paramListUrl}}', { controller: 'ParamListCtrl', templateUrl: '.{{syst.tplUrl}}{{syst.paramListUrl}}{{syst.tplExt}}' })
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