﻿// Controllers (directives) for company page
// requirejs: app/controllers
// angular: ang-cabinet-controllers

define(['jquery',
    'angular',
    'app/datacontext',
    'angular-route'],
    function ($, angular, appDatacontext) {
        'use strict';

        angular.module('ang-cabinet-controllers', ['ngRoute'])
        .controller('ParamListCtrl', ['$scope', function (scp) {
            scp.isLoadedList = false;

            scp.wfmParameterList = [];

            appDatacontext.getWfmParameterList().done(function (res) {
                scp.$apply(function () {
                    scp.wfmParameterList = res;
                    scp.isLoadedList = true;
                });
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
                appDatacontext.putWfmParameter({ id: wfmParameterToPut.Id }, wfmParameterToPut);

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
                // TODO: change to datacontext
                ////wfmParameterFactory.post(scp.wfmParameterNew, function (data) {
                ////    scp.wfmParameterList.push(data);
                ////    scp.wfmParameterNew = {};
                ////});
            };

            scp.deleteWfmParameter = function (wfmParameterToDelete) {
                if (confirm('Are you sure to delete ' + wfmParameterToDelete.Id + ' parameter?')) {
                    // TODO: change to datacontext
                    ////wfmParameterFactory.delete({ id: wfmParameterToDelete.Id }, function () {
                    ////    var idx = scp.wfmParameterList.indexOf(wfmParameterToDelete);
                    ////    console.log(idx);
                    ////    scp.wfmParameterList.splice(idx, 1);
                    ////});
                }
            };
        }]);
    });