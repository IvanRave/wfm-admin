define(['angular', 'angular-route'], function (angular) {
    'use strict';

    angular.module('ang-job-type-controllers', ['ngRoute', 'api-factory'])
    .controller('JobTypeCtrl', ['$scope', 'WfmApi', function (scp, WfmApi) {
        scp.isLoadedList = false;
        scp.jobTypeList = WfmApi.jobType.query({}, function () {
            scp.isLoadedList = true;
        });
    }]);
});