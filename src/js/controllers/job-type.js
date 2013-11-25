define(['angular', 'angular-route'], function (angular) {
    'use strict';

    angular.module('ang-job-type-controllers', ['ngRoute', 'api-factory'])
    .controller('JobTypeCtrl', ['$scope', 'WfmApi', function (scp, WfmApi) {
        scp.isLoadedList = false;
        scp.jobTypeList = WfmApi.jobType.query({}, function () {
            scp.isLoadedList = true;
        });

        scp.postJobType = function () {
            // Empty fields
            scp.jobTypeNew.Description = scp.jobTypeNew.Description || '';

            WfmApi.jobType.save({}, scp.jobTypeNew, function (jobTypeCreated) {
                scp.jobTypeList.push(jobTypeCreated);
                scp.jobTypeNew = {};
            });
        };

        ///<param name="isEditable">True (press edit) or false (press cancel)</param>
        scp.toggleEdit = function (objToEdit, isEditable) {
            if (isEditable) {
                // Press "Edit" button
                objToEdit.isEditable = true;
                // Make a clone (initial state) to "Cancel" psblty
                objToEdit.objClone = angular.copy(objToEdit);
            }
            else {
                // Press "Cancel" button
                // Take a @beforeStartEditCopy - take a clone
                var beforeStartEditCopy = angular.copy(objToEdit.objClone);
                // Remove unused (changed) object from array
                scp.jobTypeList.splice(scp.jobTypeList.indexOf(objToEdit), 1);

                scp.jobTypeList.push(beforeStartEditCopy);
                beforeStartEditCopy.isEditable = false;
            }
        };

        scp.putJobType = function (jobTypeToPut) {
            // Delete clone object
            delete jobTypeToPut.objClone;
            // Delete unnecessary props
            delete jobTypeToPut.isEditable; // set editable to false (undef)
            
            WfmApi.jobType.put({ jobTypeId: jobTypeToPut.Id }, jobTypeToPut, function () {
                console.log(jobTypeToPut);
                jobTypeToPut.isEditable = false;
            });
        };

        scp.deleteJobType = function (jobTypeToDelete) {
            if (confirm('{{capitalizeFirst lang.confirmToDelete}} "' + jobTypeToDelete.Name + '"?')) {
                WfmApi.jobType.delete({ jobTypeId: jobTypeToDelete.Id }, function () {
                    var idx = scp.jobTypeList.indexOf(jobTypeToDelete);
                    scp.jobTypeList.splice(idx, 1);
                });
            }
        };
    }]);
});