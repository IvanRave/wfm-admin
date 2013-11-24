require(['require-config'], function () {
    'use strict';

    require(['jquery', 'angular', 'angular-route', 'jquery.bootstrap',
        'controllers/auth', 'controllers/wfm-parameter', 'controllers/job-type'
    ], function ($, angular) {

        var PRJ_MODULE_NAME = 'ang-cabinet-project';

        angular.module(PRJ_MODULE_NAME, ['ngRoute', 'ang-auth-controllers', 'ang-wfm-parameter-controllers', 'ang-job-type-controllers'])
        .config(['$httpProvider', '$interpolateProvider', '$locationProvider', function (angHttpProvider, angInterpolateProvider, angLocationProvider) {
            angLocationProvider.hashPrefix('!');

            // Turn in CORS cookie support
            angHttpProvider.defaults.withCredentials = true;
            ////angHttpProvider.defaults.headers.common -- default headers for all request
            ////angHttpProvider.defaults.headers.post = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' };
            ////angHttpProvider.defaults.headers.put = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' };

            // register the interceptor via an anonymous factory
            angHttpProvider.interceptors.push(function ($q) {
                return {
                    'responseError': function (responseErr) {
                        if (responseErr.status === 401) {
                            //            angLocation.path('{{syst.logonUrl}}');
                        }
                        console.log('response error', responseErr);
                        return $q.reject(responseErr);
                    }
                };
            });

            ////  case 400:
            ////var resJson = jqXHR.responseJSON;
            ////console.log(resJson);
            ////if (resJson.errId === 'validationErrors') {
            ////    // Show window - but modal window can be active already
            ////    // TODO: make realization for all cases, or show in alert

            ////    require(['app/lang-helper'], function (langHelper) {
            ////        var errMsg = '{{capitalizeFirst lang.validationErrors}}:';
            ////        $.each(resJson.modelState, function (stateKey, stateValue) {
            ////            errMsg += '\n' + (langHelper.translate(stateKey) || stateKey) + ': ';

            ////            $.each(stateValue, function (errIndex, errValue) {
            ////                errMsg += langHelper.translateRow(errValue) + '; ';
            ////            });
            ////        });

            ////        alert(errMsg);
            ////    });

            ////    return;
            ////}
            ////else {
            ////    console.log(resJson);
            ////    alert(textStatus + ": " + jqXHR.responseText + ' (' + errorThrown + ')');
            ////}

            ////break;

            // Change standard curly braces tempate engine to {[{value}]}
            angInterpolateProvider.startSymbol('{[{').endSymbol('}]}');
        }])
        .config(['$routeProvider', function (rpr) {
            rpr
                .when('{{syst.logonUrl}}', { controller: 'AccountLogonCtrl', templateUrl: '.{{syst.tplUrl}}{{syst.logonUrl}}{{syst.tplExt}}' })
                .when('{{syst.logoffUrl}}', { controller: 'AccountLogoffCtrl', templateUrl: '.{{syst.tplUrl}}{{syst.logoffUrl}}{{syst.tplExt}}' })
                .when('{{syst.wfmParametersUrl}}', { controller: 'WfmParametersCtrl', templateUrl: '.{{syst.tplUrl}}{{syst.wfmParametersUrl}}{{syst.tplExt}}' })
                .when('{{syst.jobTypesUrl}}', { controller: 'JobTypeCtrl', templateUrl: '.{{syst.tplUrl}}{{syst.jobTypesUrl}}{{syst.tplExt}}' })
                .otherwise({ redirectTo: '/' });
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