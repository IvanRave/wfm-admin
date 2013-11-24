define(['angular', 'angular-resource'], function (angular) {
    'use strict';

    angular.module('api-factory', ['ngResource']).factory('WfmApi', ['$resource', function (angResource) {
        return {
            wfmParameter: angResource('{{conf.requrl}}/wfm-parameters/:wfmParameterId', {}, { put: { method: 'PUT', isArray: false } }),
            wfmParamSquad: angResource('{{conf.requrl}}/wfm-param-squads'),
            logoff: angResource('{{conf.requrl}}/account/logoff'),
            logon: angResource('{{conf.requrl}}/account/logon')
        };
    }]);
});