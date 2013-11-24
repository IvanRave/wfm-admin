define(['jquery', 'ajax-request'], function ($, ajaxRequest) {
    function wfmParametersUrl(uqp) {
        return '{{conf.requrl}}/wfmparameter' + (uqp ? ('?' + $.param(uqp)) : '');
    }

    // parameter list (all parameter only in Library)
    // IsSystem: true
    // for modal window select box, where user may choose some parameters for himself wellgroup
    return {
        postWfmParameter: function (data) {
            return ajaxRequest('POST', wfmParametersUrl(), data);
        },
        putWfmParameter: function (uqp, data) {
            return ajaxRequest('PUT', wfmParametersUrl(uqp), data);
        }
    };
});