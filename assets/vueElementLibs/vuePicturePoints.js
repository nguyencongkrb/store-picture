'use strict';

var $ = jQuery.noConflict();

var vuePicturePoints = {
  props: ['pdata'],
  data: function() {
    return {

    }
  },
  template: `
    <div class="sp-picture-points-wrap">
      <div :class="classControl(item)" v-for="(item, index) in pdata" :style="{left: item.x + '%', top: item.y + '%'}">
        <div class="point-item-inner" @mouseover="mouseoverHandle(item, $event)" @mouseleave="mouseleaveHandle(item, $event)">{{ index + 1 }}</div>
      </div>
    </div>`,
  methods: {
    mouseoverHandle: function(item, event) {
      this.$set(item, 'is_hover', true);
    },
    mouseleaveHandle: function(item, event) {
      this.$delete(item, 'is_hover');
    },
    classControl: function(item) {
      var _class = ['point-item'];

      if(item.is_hover && item.is_hover == true) {
        _class.push('is-hover');
      }

      return _class.join(' ');
    }
  }
};
