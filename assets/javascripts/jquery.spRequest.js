!(function($) {
  'use strict';
  
  window.sp_request = function(params) {
    var params = $.extend({
      type    : 'POST',
      url     : sp_object.ajax_url,
      data    : {},
      success : function() { return; },
      error   : function() { return; },
    }, params);

    $.ajax({
      type    : params.type,
      url     : params.url,
      data    : params.data,
      success : function(result) {
        if(params.success) params.success.call(this, result);
      },
      error: function(e) {
        if(params.error) params.error.call(this, e);
        console.log('Error: ', e);
      }
    })
  }
})(jQuery)
