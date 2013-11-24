// Controllers (directives) for company page
// requirejs: app/controllers
// angular: ang-cabinet-controllers

define(['jquery',
    'angular',
    'datacontexts/wfm-parameter',
    'angular-route',
    'api-factory'],
    function ($, angular, appDatacontext) {
        'use strict';

        angular.module('ang-wfm-parameter-controllers', ['ngRoute', 'api-factory'])
        .controller('WfmParametersCtrl', ['$scope', 'WfmApi' , function (scp, wfmApi) {
            scp.isLoadedList = false;

            scp.wfmParameterList = wfmApi.wfmParameter.query({}, function () {
                scp.isLoadedList = true;
            });

            scp.turnEdit = function (wfmParameterToEdit, isEditable) {
                if (isEditable === true) {
                    // when press Edit
                    // make copy of current object
                    wfmParameterToEdit.isEditable = true;
                    wfmParameterToEdit.wfmParameterClone = angular.copy(wfmParameterToEdit);
                    ////console.log(wfmParameterToEdit);
                    ////console.log(wfmParameterClone);
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

                // save
                appDatacontext.putWfmParameter({ wfmParameterId: wfmParameterToPut.Id }, wfmParameterToPut);

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
                scp.wfmParameterNew.DefaultColor = '';
                scp.wfmParameterNew.Uom = scp.wfmParameterNew.Uom || '';
                scp.wfmParameterNew.IsCumulative = scp.wfmParameterNew.IsCumulative === true;
                // TODO: add logic for param squad
                scp.wfmParameterNew.WfmParamSquadId = 'Pressure';

                wfmApi.wfmParameter.save(scp.wfmParameterNew, function (data) {
                    scp.wfmParameterList.push(data);
                    scp.wfmParameterNew = {};
                });
            };

            scp.deleteWfmParameter = function (wfmParameterToDelete) {
                if (confirm('{{capitalizeFirst lang.confirmToDelete}} "' + wfmParameterToDelete.Id + '"?')) {
                    wfmApi.wfmParameter.delete({wfmParameterId: wfmParameterToDelete.Id}, function () {
                        var idx = scp.wfmParameterList.indexOf(wfmParameterToDelete);
                        console.log(idx);
                        scp.wfmParameterList.splice(idx, 1);
                    });
                }
            };
        }]);
    });