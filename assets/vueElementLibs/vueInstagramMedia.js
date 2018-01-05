'use strict';
var $ = jQuery.noConflict();

var vueInstagramMediaModal = {
  props: ['modalId', 'modalTitle', 'modalButtonText'],
  data: function() {
    return {
      itemSelected: {},
    };
  },
  template: `
    <div :id="modalId" class="uk-modal-container" uk-modal>
      <div class="uk-modal-dialog">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
          <h2 class="uk-modal-title">{{ modalTitle }}</h2>
        </div>
        <div class="uk-modal-body" uk-overflow-auto>
          <sp-instagram-media></sp-instagram-media>
        </div>
        <div class="uk-modal-footer uk-text-right">
          <button class="uk-button uk-button-default" :disabled="buttonHandleControl()" type="button" @click="selectMediahandle($event)">{{ modalButtonText }}</button>
        </div>
      </div>
    </div>`,
  created: function(e) {
    this.$on('event-select-media-handle', this.selectMediahandle);
  },
  methods: {
    buttonHandleControl() {
      if(Object.keys(this.itemSelected).length <= 0) {
        return true;
      }else {
        return false;
      }
    },
    instagramContentTags() {
      var tags = (this.itemSelected.tags) ? this.itemSelected.tags : [],
          mapObj = {};

      tags.forEach(function(item) {
        var tag_link = 'https://www.instagram.com/explore/tags/' + item;
        mapObj['#'+item] = '<a href="'+ tag_link +'" alt="'+ item +'" target="_blank">#'+ item +'</a>';
      })

      var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
      return this.itemSelected.caption.text.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
      });
    },
    selectMediahandle(e) {

      this.$root.$emit('eventAddPicture', {
        url: this.itemSelected.images.standard_resolution.url,
        thumbnail: this.itemSelected.images.thumbnail.url,
      }, {
        description: [
            //this.itemSelected.caption.text,
            this.instagramContentTags(),
            '<a href="'+ this.itemSelected.link +'" target="_blank">',
              '<b>@post</b>',
            '</a>',
          ].join(' '),
        source: {
          type: 'instagram',
          instagram_type: this.itemSelected.type, /* image, carousel, etc... */
          user: this.itemSelected.user,
        },
      })

      UIkit.modal('#'+this.modalId).hide();
    }
  },
}

var vueInstagramMedia = {
  props: [],
  data: function() {
    return {
      data: [],
      itemSelect: {},
      search: {
        userData: [],
        name: '',
        timeout: null,
      }
    };
  },
  template: `
    <div class="sp-instagram-media-wrap">
      <div class="instagram-media-items uk-margin" v-if="data.length > 0">
        <div uk-grid>
          <div class="uk-width-1-2@s uk-width-1-5@m" v-for="(item, index) in data">
            <div :class="itemClassControl(item)" @click="selectItemHandle(item)">
              <div class="media-wrap">
                <img :src="item.images.standard_resolution.url" :alt="item.caption.text"/>
              </div>
              <div class="meta-icons">
                <div class="icon-item"><span class="sp-icon i-like"></span> {{ item.likes.count }}</div>
                <div class="icon-item"><span class="sp-icon i-chat"></span> {{ item.comments.count }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        No items...
      </div>
      <!-- <pre>{{ data }}</pre> -->
    </div>`,
  created: function(el) {
    this.getData();
  },
  methods: {
    getData() {
      var self = this;

      window.sp_request({
        data: {action: 'sp_get_instagram_media'},
        success: function(result) {
          try{
            var obj = JSON.parse(result);
            switch (obj.status) {
              case 200:
                  var instagram_result = obj.result,
                      data = instagram_result.data;

                  self.data = data;
                break;
              default:

                break;
            }
          } catch(e) {
            console.log(e);
          }
        }
      })
    },
    itemClassControl(item) {
      var classes = ['instagram-media-item'];
      if(this.itemSelect == item) classes.push('is-selected');

      return classes.join(' ');
    },
    selectItemHandle(item) { // console.log(item);
      if(this.itemSelect == item) this.itemSelect = {};
      else this.itemSelect = item;

      this.$parent.itemSelected = this.itemSelect;
    },
  },
}
