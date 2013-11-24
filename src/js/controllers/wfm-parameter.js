// Controllers (directives) for company page
// requirejs: app/controllers
// angular: ang-cabinet-controllers

define(['jquery', 'angular', 'angular-route', 'api-factory'], function ($, angular) {
    'use strict';

    angular.module('ang-wfm-parameter-controllers', ['ngRoute', 'api-factory'])
    .controller('WfmParametersCtrl', ['$scope', 'WfmApi', function (scp, wfmApi) {
        scp.isLoadedList = false;

        scp.wfmParameterList = [];
        scp.wfmParamSquadIdList = [];
        scp.wfmParamSquadList = wfmApi.wfmParamSquad.query({ is_inclusive: true }, function (r) {
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

         

        scp.turnEdit = function (wfmParameterToEdit, isEditable) {
            if (isEditable === true) {
                wfmParameterToEdit.isEditable = true;
                wfmParameterToEdit.wfmParameterClone = angular.copy(wfmParameterToEdit);
            }
            else {
                // when press Cancel
                // take a @beforeStartEditCopy
                var beforeStartEditCopy = angular.copy(wfmParameterToEdit.wfmParameterClone);
                // remove unused (changed) object from array
                scp.wfmParameterList.splice(scp.wfmParameterList.indexOf(wfmParameterToEdit), 1);

                scp.wfmParameterList.push(beforeStartEditCopy);
                beforeStartEditCopy.isEditable = false;
            }
        };

        scp.putWfmParameter = function (wfmParameterToPut) {
            // todo: check if name exists in entire array

            // delete clone object
            delete wfmParameterToPut.wfmParameterClone;

            wfmApi.wfmParameter.put({ wfmParameterId: wfmParameterToPut.Id }, wfmParameterToPut);

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
            
            wfmApi.wfmParameter.save(scp.wfmParameterNew, function (data) {
                scp.wfmParameterList.push(data);
                scp.wfmParameterNew = {};
            });
        };

        scp.deleteWfmParameter = function (wfmParameterToDelete) {
            if (confirm('{{capitalizeFirst lang.confirmToDelete}} "' + wfmParameterToDelete.Id + '"?')) {
                wfmApi.wfmParameter.delete({ wfmParameterId: wfmParameterToDelete.Id }, function () {
                    var idx = scp.wfmParameterList.indexOf(wfmParameterToDelete);
                    console.log(idx);
                    scp.wfmParameterList.splice(idx, 1);
                });
            }
        };
    }]);
});