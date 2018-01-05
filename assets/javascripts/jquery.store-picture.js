!(function($) {
  'use strict';

  $.fn.__sp_once = function(key, callback) {
    return this.each(function() {
      var data_key = ['one', key].join('-');

      if($(this).data(data_key) == true) return;

      callback.call(this, callback);
      $(this).data('one-'+key, 'true');
    })
  }

  var storePicture = function() {
    var self = this;
    var gridOptions_default = {
      itemSelector: '.grid-item',
      columnWidth: '.grid-sizer',
      gutter: '.gutter-sizer',
      col: 4,
      space: 20,
      percentPosition: false,
      responsives: {
        tablet: { col: 2 },
        mobi: { col: 1 },
      },
    };

    self.vueLoadDirectives = function() {
      Vue.directive('nanoscroll', {
        inserted: function (el) {
          $(el).nanoScroller();
        },
        componentUpdated: function(el, binding) {
          $(el).nanoScroller();
        }
      })
    }

    self.vueLoadComponents = function() {
      var components = {
        'sp-picture-points': vuePicturePoints,
        'sp-product-item': vuePictureStoreProductItem,
        'sp-custom-masonry': vueSpCustomMasonry,
        'sp-picture-edit': vueStorePictureModalEdit,
        'sp-medium-editor': vueMediumEditor.default,
      };

      $.each(components, function(tagName, options) {
        Vue.component(tagName, options);
      })
    }

    /* apply VueJs */
    self.vueApply = function() {
      $('[data-vue-handle]').__sp_once('vue-apply', function() {
        var $elem = $(this);

        new Vue({
          el: this,
          data: function() {
            return {
              postID: 0,
              url: '',
              postLink: '',
              modalControl: {
                show: false,
                editData: {},
              },
              storePicture: {
                generalSettings: {
                  gridOptions: gridOptions_default,
                },
                storePictureData: [],
              },
            };
          },
          created: function() {
            this.getStorePictureData();
            this.$root.$on('eventOpenModalToEdit', this.openModalToEdit);
          },
          watch: {
            postID (val) { console.log(val);
              if(val && val != 0)
                this.getPermalink();
            },
            modalControl: {
              handler (val) {
                if(this.postLink && this.postLink != '')
                  this.changeUrl();
              },
              deep: true
            },
            'storePicture.storePictureData' (data) {
              // console.log(data);
              if('' == this.url) this.url = window.location.href;

              var [url, share_id] = this.url.split('sid=');
              if (share_id) {
                var [id, key] = share_id.split('.');
                var pictureItem = data.filter(item => {
                   return item.key.indexOf(key) > -1
                })
                // console.log(id, key);
                if(this.postID == id && pictureItem.length > 0) {
                  this.modalControl.show = true;
                  this.modalControl.editData = pictureItem[0];
                  this.url = url;
                }
              } else {
                // do something else
              }
            }
          },
          methods: {
            changeUrl: function() {
              var newUrl = '';

              if(true == this.modalControl.show) {
                // newUrl = this.postLink + '#' + this.postID + '.' + this.modalControl.editData.key;
                newUrl = this.postLink.replace('[SHAREID]', this.postID + '.' + this.modalControl.editData.key);
              } else {
                newUrl = this.url.split('sid')[0];
              }

              history.pushState(null, null, newUrl);
            },
            getPermalink: function() {
              var self = this;

              window.sp_request({
                data: {action: 'sp_get_post_link', pid: self.postID},
                success: function(link) {
                  if(link) self.postLink = link;
                }
              })
            },
            getStorePictureData: function() {
              var $this = this,
                  post_ID = $elem.data('post-id');

              if( post_ID && post_ID != 0 ) {
                Vue.set($this, 'postID', post_ID);

                window.sp_request({
                  data: {action: 'sp_get_store_picture_data', pid: post_ID},
                  success: function(result) {
                    if(! result) return;

                    try{
                      var picture_data = JSON.parse(result);
                      Vue.set($this, 'storePicture', picture_data);
                    } catch(e) { console.log(e); }
                  }
                })
              }
            },
            openModalToEdit: function(item) {

              this.modalControl.show = true;
              this.modalControl.editData = item;
            },
          },
        })
      })
    }

    /* init */
    self.init = function() {
      self.vueLoadDirectives();
      self.vueLoadComponents();
      self.vueApply();
    }

    self.init();

    return self;
  }

  /* DOM Ready */
  $(function() {
    var storePicture_obj = new storePicture();
  })
})(jQuery)
