/* version 1.0
 */

!(function($) {
  'use strict';

  /**
   * only called once
   *
   */
  $.fn._sp_once = function(handle) {
    return $(this).each(function() {
      var $this = $(this);
      if ($this.data('sp-once-action') == true) return;

      $this.data('sp-once-action', true);
      handle.call(this);
    })
  }

  ELEMENT.locale(ELEMENT.lang.en);

  var StorePictureAdmin_API = {
    app                 : null,
    components          : [],
    _request            : window.sp_request,
    wooSearchTool_obj   : new window.wooSearchTool(),
    confirmTool_obj     : new window.smallConfirmTool({content: 'Are you sure to delete this?'}),
    generateHexString   : function(length) {
      var ret = "";
      while (ret.length < length) {
        ret += Math.random().toString(16).substring(2);
      }

      return ret.substring(0,length);
    }
  };

  /* WordPress Media */
  StorePictureAdmin_API.wp_media = wp.media({
    title: sp_object.language.wp_media_title,
    button: {
      text: sp_object.language.wp_media_button_text
    },
    multiple: false
  });

  /* sp wp media */
  StorePictureAdmin_API.sp_wp_media = function(onSelect) {
    StorePictureAdmin_API.wp_media.off('select').on('select', function() {
      var attachment = StorePictureAdmin_API.wp_media.state().get('selection').first().toJSON();
      onSelect.call(this, attachment);
    })

    return {
      open: function() {
        StorePictureAdmin_API.wp_media.open();
      }
    }
  }

  /**
   * component <ps-tools>
   */
  var sp_tools_component = function() {
    Vue.component('sp-tools', {
      data: function() {
        return {

        };
      },
      template: `<ul class="uk-nav uk-dropdown-nav"><slot></slot></ul>`,
      methods: {

      }
    })
  }
  StorePictureAdmin_API.components.push(sp_tools_component);

  var sp_instagram_media = function() {
    Vue.component('sp-instagram-media-modal', vueInstagramMediaModal);
    Vue.component('sp-instagram-media', vueInstagramMedia);
  }
  StorePictureAdmin_API.components.push(sp_instagram_media);

  /**
   * component <sp-add-picture>
   */
  var sp_add_picture_component = function() {
    Vue.component('sp-add-picture', {
      props     : ['type', 'href'],
      data      : function() {
        return {
          storePictureData: [],
        };
      },
      template  : `
        <li v-if="href"><a :href="href" uk-toggle><slot></slot></a></li>
        <li v-else><a href="#" @click="selectPicture"><slot></slot></a></li>`,
      created: function(el) {
        // this.$root.$on('event-add-picture', this.addPicture);
      },
      mounted: function () {
        this.$nextTick(function () {
          this.storePictureData = this.$root.$data.storePicture.storePictureData;
        })
      },
      methods   : {
        selectPicture: function() {
          var type = this.type;

          switch (type) {
            case 'wp-media':
              var self = this;

              /* open wp media */
              StorePictureAdmin_API.sp_wp_media(function(attachment) {
                var picture_url = attachment.url,
                    picture_id = attachment.id;

                // self.addPicture({
                //   url: picture_url,
                //   id: picture_id,
                // })

                self.$root.$emit('eventAddPicture', {
                  url: picture_url,
                  id: picture_id,
                })

              }).open();

              break;

            case 'instagram':
              break;

          }
        },
        addPicture: function(picture_data, info) {
          var current_date = new Date().toLocaleString();
          var key_item = StorePictureAdmin_API.generateHexString(26);

          var push_data = {
            key           : key_item,
            created       : current_date,
            name          : (info && info.name) ? info.name : '',
            description   : (info && info.description) ? info.description : '',
            pictures      : picture_data,
            points        : [],
          };

          this.$root.$data.storePicture.storePictureData.push(push_data);
          this.$root.$emit('eventOpenModalToEdit', push_data);
        },
      }
    })
  }
  StorePictureAdmin_API.components.push(sp_add_picture_component);

  /**
   * component <sp-picture-table>
   */
  var sp_picture_table_component = function() {
    Vue.component('sp-picture-table', {
      props: ['spData'],
      data: function() {
        return {

        }
      },
      template: `
        <table class="uk-table uk-table-hover uk-table-divider sp-table-list" v-if="spData && spData.length > 0">
          <thead>
            <tr>
              <th>#</th>
              <th>Picture</th>
              <th width="20%">Name</th>
              <th>Description</th>
              <th>Point(s)</th>
              <th width="15%"></th>
            </tr>
          </thead>
          <tbody v-sortable>
            <tr class="sort-item" v-for="(item, index) in spData" :key="item.key" ref="elems" draggable="true">
              <td>{{ index + 1 }}</td>
              <td>
                <sp-picture-thumbnail :pictures="item.pictures"></sp-picture-thumbnail>
              </td>
              <td><strong v-html="item.name"></strong></td>
              <td><div v-html="item.description"></div></td>
              <td>{{ item.points.length }}</td>
              <td class="uk-text-right">
                <a href="javascript:" class="uk-icon-link uk-margin-small-right" uk-icon="icon: file-edit" title="edit" uk-tooltip @click="editItem(item)"></a>
                <a href="javascript:" class="uk-icon-link" uk-icon="icon: trash" title="remove" uk-tooltip @click="openConfirmRemove(index, $event)"></a>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else></div>`,
      created: function() {

      },
      methods: {
        editItem: function(item) {
          this.$root.$emit('eventOpenModalToEdit', item);
        },
        openConfirmRemove: function(index, event) {
          var self = this;

          StorePictureAdmin_API.confirmTool_obj
          .open(event.clientX, event.clientY)
          .confirm(function() {

            anime({
              targets: self.$refs.elems[index],
              translateX: 35,
              opacity: 0,
              easing: 'easeOutExpo',
              duration: 600,
              complete: function(anim) {
                self.removeItem(index);
              }
            });
          })
        },
        removeItem: function(index) {
          this.spData.splice(index, 1);
        }
      }
    })
  }
  StorePictureAdmin_API.components.push(sp_picture_table_component);

  var sp_picture_thumbnail_component = function() {
    Vue.component('sp-picture-thumbnail', {
      props: ['pictures'],
      data: function() {
        return {
          loader: false,
          thumbnail: this.pictures.url,
        };
      },
      template: `
        <img class="sp-icon-img" :src="thumbnail" alt="#" v-if="loader == false">
        <div class="" v-else><div uk-spinner></div></div>`,
      created: function() {
        this.getThumbnail();
      },
      methods: {
        getThumbnail: function() {
          var self = this;

          if(! this.pictures.id || this.pictures.id == 0) {
            this.thumbnail = this.pictures.url
          } else {
            this.loader = true;

            StorePictureAdmin_API._request({
              data: {action: 'sp_get_thumbnail_src', attachment_id: self.pictures.id, size: 'thumbnail'},
              success: function(result) {
                self.thumbnail = result;
                self.loader = false;
              },
            })
          }
        }
      }
    });
  }
  StorePictureAdmin_API.components.push(sp_picture_thumbnail_component);

  var sp_medium_editor_component = function() {
    Vue.component('sp-medium-editor', vueMediumEditor.default);
  }
  StorePictureAdmin_API.components.push(sp_medium_editor_component);

  /**
   * component <sp-picture-edit>
   */
  var sp_picture_edit_component = function() {
    Vue.component('sp-picture-edit', vueStorePictureModalEdit)
  }
  StorePictureAdmin_API.components.push(sp_picture_edit_component);

  /**
   * component <sp-product-item>
   */
  var sp_product_item_component = function() {
    Vue.component('sp-product-item', vuePictureStoreProductItem)
  }
  StorePictureAdmin_API.components.push(sp_product_item_component);

  /**
   * component <sp_picture_points_component>
   */
  var sp_picture_points_component = function() {
    Vue.component('sp-picture-points', vuePicturePoints);
  }
  StorePictureAdmin_API.components.push(sp_picture_points_component);

  /**
   * nicescroll directive
   */
  var sp_vue_nanoscroll_directive = function() {
    Vue.directive('nanoscroll', {
      inserted: function (el) {
        $(el).nanoScroller();
      },
      componentUpdated: function(el, binding) {
        $(el).nanoScroller();
      }
    })
  }
  StorePictureAdmin_API.components.push(sp_vue_nanoscroll_directive);

  /**
   * Sortable directive
   */
  var sp_vue_sortable_directive = function() {
    Vue.directive('sortable', {
      inserted: function (el, binding, vnode) {
        var self = this;

        Sortable.create(el, {
          draggable: '.sort-item',
          onEnd: function (evt) {
            var itemData = vnode.context.$root.$data.storePicture.storePictureData[evt.oldIndex];

            vnode.context.$root.$data.storePicture.storePictureData.splice(evt.oldIndex, 1);
            vnode.context.$root.$data.storePicture.storePictureData.splice(evt.newIndex, 0, itemData);
          },
        });
      },
    })
  }
  StorePictureAdmin_API.components.push(sp_vue_sortable_directive);

  var sp_custom_masonry_component = function() {
    Vue.component('sp-custom-masonry', vueSpCustomMasonry);
  }
  StorePictureAdmin_API.components.push(sp_custom_masonry_component);

  var sp_carousel_3d_component = function() {
    Vue.component('sp-carousel-3d', Carousel3d.Carousel3d);
    Vue.component('sp-slide', Carousel3d.Slide);
  }
  StorePictureAdmin_API.components.push(sp_carousel_3d_component);

  /**
   * load components
   */
  StorePictureAdmin_API.load_components = function() {
    StorePictureAdmin_API.components.forEach(function(_fn) { _fn.call(); })
  }

  /**
   * Vue init
   *
   */
  StorePictureAdmin_API.vue_init = function() {
    if($('#store-picture-custom-metabox-wrap').length <= 0) return;

    StorePictureAdmin_API.load_components();
    StorePictureAdmin_API.app = new Vue({
      el: '#store-picture-custom-metabox-wrap',
      data: function() {
        return {
          settings: sp_object.settings,
          postID: 0,
          url: '',
          postLink: '',
          modalControl: {
            show: false,
            editData: {},
          },
          storePicture: {
            generalSettings: {
              gridOptions: {
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
              },
            },
            storePictureData: [],
          },
        }
      },
      computed: {
        storePictureDataStringify: function() {
          return JSON.stringify(this.storePicture);
        },
      },
      created: function() {
        this.getStorePictureData();
        this.$root.$on('eventOpenModalToEdit', this.openModalToEdit);
        this.$root.$on('eventAddPicture', this.addPicture);
      },
      watch: {
        postID (val) {
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

          var [url, share_id] = this.url.split('#');
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
            // newUrl = this.url;
            newUrl = this.url.split('sid')[0];
          }

          // history.pushState(null, null, newUrl);
        },
        getPermalink: function() {
          var self = this;

          StorePictureAdmin_API._request({
            data: {action: 'sp_get_post_link', pid: self.postID},
            success: function(link) {
              if(link) self.postLink = link;
            }
          })
        },
        classNavTabControl: function() {
          var _class = [];

          if(this.storePicture.storePictureData && this.storePicture.storePictureData.length <= 0) {
            _class.push('uk-disabled');
          }

          return _class.join(' ');
        },
        openModalToEdit: function(item) {

          StorePictureAdmin_API.app.modalControl.show = true;
          StorePictureAdmin_API.app.modalControl.editData = item;
        },
        addPicture: function(picture_data, info) {
          var current_date = new Date().toLocaleString();
          var key_item = StorePictureAdmin_API.generateHexString(26);

          var push_data = {
            key           : key_item,
            created       : current_date,
            source        : (info && info.source) ? info.source : {type: 'media'},
            name          : (info && info.name) ? info.name : '',
            description   : (info && info.description) ? info.description : '',
            pictures      : picture_data,
            points        : [],
          };

          this.$root.$data.storePicture.storePictureData.push(push_data);
          this.$root.$emit('eventOpenModalToEdit', push_data);
        },
        extendsControl: function() {
          /* slider 3d set default options */
          if(sp_object.extends.carousel_3d) {
            var carouselOptionsDefault = {
              space: 240,
              width: 360,
              height: 270,
              border: 1,
              perspective: 35,
              inverseScaling: 300,
              count: 5,
              loop: true,
              disable3d: false,
              animationSpeed: 500,
              dir: 'rtl' // rtl or ltr
            };

            if(! this.storePicture.generalSettings.carouselOptions) {
              this.storePicture.generalSettings.carouselOptions = carouselOptionsDefault;
            }
          }
        },
        getStorePictureData: function() {
          var self = this,
              post_ID = $('#store-picture-custom-metabox-wrap').data('post-id');

          if( post_ID && post_ID != 0 ) {
            Vue.set(self, 'postID', post_ID);
            StorePictureAdmin_API._request({
              data: {action: 'sp_get_store_picture_data', pid: post_ID},
              success: function(result) {
                if(! result) return;

                try{
                  var picture_data = JSON.parse(result);
                  Vue.set(self, 'storePicture', picture_data);

                  self.extendsControl();
                } catch(e) { console.log(e); }
              }
            })
          }
        }
      }
    })
  }

  StorePictureAdmin_API.init = function() {
    StorePictureAdmin_API.vue_init();
  }

  /**
   * fix masonry
   */
  function fixMasonryResize() {
    $('#store-picture-main-tabs').on('show', function() {
      setTimeout(function() {
        $(window).trigger('resize');
      }, 10)
    })
  }

  $(function() {
    StorePictureAdmin_API.init();

    fixMasonryResize();
  })
})(jQuery)
