define(['angular', 'angular-resource'], function (angular) {
    'use strict';

    angular.module('api-factory', ['ngResource'])
        .factory('WfmApi', ['$resource', function (angResource) {
            return {
                wfmParameter: angResource('{{conf.requrl}}/wfm-parameters/:wfmParameterId', {}, { update: {method: 'PUT'}})
            };
        }]);
});