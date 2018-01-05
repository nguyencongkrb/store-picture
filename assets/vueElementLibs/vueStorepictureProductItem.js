'use strict';

var $ = jQuery.noConflict();
var vuePictureStoreProductItem_API = {
  confirmTool_obj: new window.smallConfirmTool({content: 'Are you sure to delete this?'}),
};

var vuePictureStoreProductItem = {
  props: ['item', 'index', 'remove'],
  data: function() {
    return {
      pid   : this.item.pid,
      phtml : '',
    };
  },
  template: `
    <div :class="classWrapControl()" @mouseover="mouseoverHandle($event)" @mouseleave="mouseleaveHandle($event)">
      <div v-if="phtml">
        <a v-if="remove == 'true'" class="p-remove-item" href="javascript:" @click="removeConfirm(index, $event)"><span class="ion-ios-close-empty"></span></a>
        <div class="is-hover" v-if="item.is_hover == true"><span class="sp-icon i-visibility"></span></div>
        <div v-html="phtml"></div>
      </div>
      <div v-else class="p-load-temp sp-text-center">
        <div class="sp-loading-animate"></div>
        <div>loading...</div>
      </div>
    </div>`,
  created: function() {
    this.getProductHtml();
  },
  methods: {
    mouseoverHandle: function(event) {
      this.$set(this.item, 'is_hover', true);
    },
    mouseleaveHandle: function(event) {
      this.$delete(this.item, 'is_hover');
    },
    classWrapControl: function() {
      var classes = ['product-item-inner'];
      if(this.item.is_hover == true) {
        classes.push('is-hover');
      }

      return classes.join(' ');
    },
    getProductHtml: function() {
      var self = this;

      window.sp_request({
        data: {action: 'sp_woo_product_html_render', pid: self.pid},
        success: function(result) {
          self.phtml = result;
        }
      })
    },
    removeConfirm: function(index, event) { // console.log(event);
      var self = this,
          elem = event.target;

      vuePictureStoreProductItem_API.confirmTool_obj
      .open(event.clientX, event.clientY)
      .confirm(function() {
        self.removeItem(index)
      })
    },
    removeItem: function(index) {
      this.$parent.data.editData.points.splice(index, 1);
    }
  }
}
