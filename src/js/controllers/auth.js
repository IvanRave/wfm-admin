// Controllers (directives)
// requirejs: app/controllers/auth
// angular: ang-auth-controllers

define(['jquery',
    'angular',
    'angular-route',
    'api-factory'],
    function ($, angular) {
        'use strict';

        angular.module('ang-auth-controllers', ['ngRoute', 'api-factory'])
        .controller('AccountLogonCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'WfmApi', function (scp, angRootScope, angLocation, angRouteParams, WfmApi) {

            scp.usver = {
                email: angRouteParams.email
            };

            // When user successfuly confirm email after registration - need to show notification
            scp.isEmailConfirmed = angRouteParams.confirmed;

            scp.isProcessBtnEnabled = true;

            scp.processError = '';

            // Password restriction bounds
            scp.bound = {
                password: {
                    minLength: 6,
                    maxLength: 18
                }
            };

            scp.tryAuth = function () {
                scp.isProcessBtnEnabled = false;

                WfmApi.account.logon.save({}, scp.usver, function () {
                    angRootScope.isLogged = true;
                    angLocation.path('{{syst.companyListUrl}}');
                }, function (err) {
                    console.log(err);
                    if (err.status === 422) {
                        var resJson = err.data;
                        var tmpProcessError = '*';
                        require(['lang-helper'], function (langHelper) {
                            tmpProcessError += (langHelper.translate(resJson.errId) || '{{lang.unknownError}}');
                            // Because using jQuery ajax is out of the world of angular, you need to wrap your $scope assignment inside of
                            scp.$apply(function () {
                                scp.processError = tmpProcessError;
                            });
                        });
                    }

                    scp.isProcessBtnEnabled = true;
                });
            };
        }])
        .controller('AccountLogoffCtrl', ['$rootScope', '$location', 'WfmApi', function (angRootScope, angLocation, WfmApi) {
            WfmApi.account.logoff.get({}, function () {
                angRootScope.isLogged = false;
                angLocation.path('{{syst.logonUrl}}');
            });
        }]);
    });