!(function($) {
  'use strict';

  //Authorization popup window code
  $.sp_oauthpopup = function(options)
  {
    options.windowName = options.windowName ||  'ConnectWithOAuth'; // should not include space for IE
    options.windowOptions = options.windowOptions || 'location=0,status=0,width=800,height=400';
    options.callback = options.callback || function(){ window.location.reload(); };
    var that = this;

    that._oauthWindow = window.open(options.path, options.windowName, options.windowOptions);
    that._oauthInterval = window.setInterval(function(){
      if (that._oauthWindow.closed) {
          window.clearInterval(that._oauthInterval);
      }

      if(options.callback) options.callback(that);
    }, 1000);

    return that;
  };

  var StorePicture_Settings = function() {
    this.settingsApp = null;

    this.vueInit = function() {
      if($('#store-picture-settings-wrap').length <= 0 ) return;

      this.settingsApp = new Vue({
        el: '#store-picture-settings-wrap',
        data: function() {
          return {
            form: sp_settings_object.form,
            instagram_auth_loading: false,
            loading: false,
          }
        },
        computed: {
          instagram_auth: function() {
            if(this.form.instagram_client_id == '' || this.form.instagram_client_secret == '')
              return true;
            else
              return false;
          },
          instagram_auth_type() {
            var type = 'warning';
            if(this.form.instagram_access_token && this.form.instagram_access_token.access_token) type = 'success';

            return type;
          },
          instagram_token_code() {
            var code = '';

            if(this.form.instagram_access_token && this.form.instagram_access_token.access_token) {
              code = this.form.instagram_access_token.access_token.substring(0, this.form.instagram_access_token.access_token.length - 4) + '****';
            }

            return code;
          }
        },
        methods: {
          onSubmit() {
            this.loading = true;

            var self = this;
            window.sp_request({
              data: {action: 'sp_save_settings', data: this.form},
              success: function(result) {
                self.loading = false;
              }
            })
          },
          instagram_auth_handle() {
            this.instagram_auth_loading = true;
            var self = this;

            var getOAuthToken = function(code) {
              window.sp_request({
                data: {action: 'sp_instagram_get_oauth_token', data: {
                  instagram_auth_code: code,
                  instagram_client_id: self.form.instagram_client_id,
                  instagram_client_secret: self.form.instagram_client_secret,
                }},
                success: function(result) {

                  try{
                    var _obj = JSON.parse(result);
                    self.form.instagram_access_token = _obj;
                    console.log(_obj);
                    self.instagram_auth_loading = false;
                  } catch(e) {
                    console.log(e);
                  }
                }
              })
            }

            var newWindow = new $.sp_oauthpopup({
              path: '#',
              callback: function(e) {
                var currentUrl = e._oauthWindow.location.href;
                if(! currentUrl) return;
                var [url, code] = currentUrl.split('?code=');
                if(! code) return;
                console.log(code);
                getOAuthToken(code);
                e._oauthWindow.close();
              }
            });

            window.sp_request({
              data: {action: 'sp_instagram_get_auth_link', data: {
                instagram_client_id: this.form.instagram_client_id,
                instagram_client_secret: this.form.instagram_client_secret,
              }},
              success: function(result) {
                console.log(result);
                newWindow._oauthWindow.location = result;
              }
            })
          },
          instagram_remove_token_handle() {
            this.form.instagram_access_token = {};
          }
        }
      });
    }

    this.init = function() {
      this.vueInit();
    }

    this.init();
    return this;
  }

  $(function() {
    new StorePicture_Settings();
  })
})(jQuery);
