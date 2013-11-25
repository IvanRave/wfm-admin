// Controllers (directives) for company page
// requirejs: app/controllers
// angular: ang-cabinet-controllers

define(['jquery', 'angular', 'angular-route', 'api-factory'], function ($, angular) {
    'use strict';

    angular.module('ang-wfm-parameter-controllers', ['ngRoute', 'api-factory'])
    .controller('WfmParametersCtrl', ['$scope', 'WfmApi', function (scp, WfmApi) {
        scp.isLoadedList = false;

        scp.wfmParameterList = [];
        scp.wfmParamSquadIdList = [];
        scp.wfmParamSquadList = WfmApi.wfmParamSquad.query({ is_inclusive: true }, function (r) {
            var readyArr = [];
            // Extract wfm parameters from every squad
            for (var i = 0; i < r.length; i += 1) {
                var tmpArr = r[i].WfmParameterDtoList;
                if (tmpArr) {
                    readyArr = readyArr.concat(tmpArr);
                }
            }

            scp.wfmParameterList = readyArr;
            scp.isLoadedList = true;

            scp.wfmParamSquadIdList = $.map(scp.wfmParamSquadList, function (wfmParamSquad) {
                return wfmParamSquad.Id;
            });

            console.log(scp.wfmParamSquadIdList);
        });         

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
                scp.wfmParameterList.splice(scp.wfmParameterList.indexOf(objToEdit), 1);

                scp.wfmParameterList.push(beforeStartEditCopy);
                beforeStartEditCopy.isEditable = false;
            }
        };

        scp.putWfmParameter = function (wfmParameterToPut) {
            // Todo: check if name exists in entire array

            // delete clone object
            delete wfmParameterToPut.objClone;
            delete wfmParameterToPut.isEditable;

            WfmApi.wfmParameter.put({ wfmParameterId: wfmParameterToPut.Id }, wfmParameterToPut);

            wfmParameterToPut.isEditable = false;
        };

        scp.postWfmParameter = function () {
            var isUnique = true;
            // check for unique Id
            $.each(scp.wfmParameterList, function (itemIndex, itemValue) {
                // break if Id exists in list
                if (itemValue.Id === scp.wfmParameterNew.Id || itemValue.Name === scp.wfmParameterNew.Name) {
                    isUnique = false;
                    return false;
                } else {
                    return true;
                }
            });

            if (isUnique === false) {
                alert('This Id/Name is in the list already. Please choose another Id/Name');
                return;
            }

            scp.wfmParameterNew.IsSystem = false;
            
            scp.wfmParameterNew.DefaultColor = scp.wfmParameterNew.DefaultColor || '';
            scp.wfmParameterNew.Uom = scp.wfmParameterNew.Uom || '';
            scp.wfmParameterNew.IsCumulative = (scp.wfmParameterNew.IsCumulative === true);
            
            WfmApi.wfmParameter.save(scp.wfmParameterNew, function (data) {
                scp.wfmParameterList.push(data);
                scp.wfmParameterNew = {};
            });
        };

        scp.deleteWfmParameter = function (wfmParameterToDelete) {
            if (confirm('{{capitalizeFirst lang.confirmToDelete}} "' + wfmParameterToDelete.Id + '"?')) {
                WfmApi.wfmParameter.delete({ wfmParameterId: wfmParameterToDelete.Id }, function () {
                    var idx = scp.wfmParameterList.indexOf(wfmParameterToDelete);
                    scp.wfmParameterList.splice(idx, 1);
                });
            }
        };
    }]);
});