define(['jquery', 'app/ajax-request'], function ($, ajaxRequest) {
    'use strict';

    function wfmParameterUrl(uqp) {
        return '{{conf.requrl}}/api/wfmparameter/' + (uqp ? ('?' + $.param(uqp)) : '');
    }

    var datacontext = {};

    // parameter list (all parameter only in Library)
    // IsSystem: true
    // for modal window select box, where user may choose some parameters for himself wellgroup
    datacontext.getWfmParameterList = function (uqp) {
        return ajaxRequest('GET', wfmParameterUrl(uqp));
    };

    datacontext.postWfmParameter = function (data) {
        return ajaxRequest('POST', wfmParameterUrl(), data);
    };

    datacontext.putWfmParameter = function (uqp, data) {
        return ajaxRequest('PUT', wfmParameterUrl(uqp), data);
    };

    return datacontext;
});