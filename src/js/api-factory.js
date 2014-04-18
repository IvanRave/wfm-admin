define(['angular', 'angular-resource'], function (angular) {
    'use strict';

    angular.module('api-factory', ['ngResource']).factory('WfmApi', ['$resource', function (angResource) {
        return {
            wfmParameter: angResource('{{conf.requrl}}/wfm-parameters/:wfmParameterId', {}, { put: { method: 'PUT', isArray: false } }),
            wfmParamSquad: angResource('{{conf.requrl}}/wfm-param-squads'),
            inclusiveWfmParamSquad: angResource('{{conf.requrl}}/wfm-param-squads/inclusive'),
            account:{
                logoff: angResource('{{conf.requrl}}/account/logoff'),
                logon: angResource('{{conf.requrl}}/account/logon'),
                info: angResource('{{conf.requrl}}/account/info'),
            },
            jobType: angResource('{{conf.requrl}}/job-types/:jobTypeId', {}, { put: { method: 'PUT', isArray: false } })
        };
    }]);
});