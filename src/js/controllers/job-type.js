define(['angular', 'angular-route'], function (angular) {
    'use strict';

    angular.module('ang-job-type-controllers', ['ngRoute'])
    .controller('JobTypeCtrl', ['$scope', function (scp) {
        scp.jobTypeList = [];
    }]);
});