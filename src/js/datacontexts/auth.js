define(['jquery', 'ajax-request'], function ($, ajaxRequest) {
    'use strict';

    function accountLogoffUrl(uqp) {
        return '{{conf.requrl}}/account/logoff' + (uqp ? ('?' + $.param(uqp)) : '');
    }

    function accountLogonUrl(uqp) {
        return '{{conf.requrl}}/account/logon' + (uqp ? ('?' + $.param(uqp)) : '');
    }

    return {
        accountLogoff: function (uqp) {
            return ajaxRequest('POST', accountLogoffUrl(uqp));
        },
        accountLogon: function (uqp, data) {
            return ajaxRequest('POST', accountLogonUrl(uqp), data);
        }
    };
});