'use strict';

var vueSpCustomMasonry = {
  data: function() {
    return {
      gridOptions: {},
      storePictureData: [],
    }
  },
  template: `
    <div class="sp-custom-masonry-wrap" v-if="storePictureData.length > 0">
      <div class="sp-custom-masonry-inner" :style="gridStyle()">
        <div class="custom-masonry" v-custom-masonry="gridOptions">
          <div class="grid-sizer"></div>
          <div class="gutter-sizer"></div>
          <div class="grid-item" v-for="(item, index) in storePictureData" :key="item.key" v-grid-item="item">
            <div class="grid-item-inner">
              <div class="sp-item-ui" @click="openModalToEdit(item)">
                <div class="picture-item-wrap">
                  <div class="picture-item">
                    <img class="picture-image" :src="item.pictures.url" :alt="item.name">
                    <span class="sp-icon-bag">
                      <i class="ion-bag"></i>
                    </span>
                  </div>
                  <div class="point-items" v-if="item.points.length > 0">
                    <div class="point-item" v-for="(item, index) in item.points" :style="getPointPosition(item)">
                      <span class="point-inner">{{ index + 1 }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
  created: function(el) {

  },
  mounted: function() {
    this.$nextTick(function () {
      this.gridOptions = this.$root.$data.storePicture.generalSettings.gridOptions;
      this.storePictureData = this.$root.$data.storePicture.storePictureData;
    })
  },
  directives: {
    customMasonry: {
      inserted: function(el, binding, vnode) {
        var CustomMasonryOpts = {
          itemSelector  : binding.value.itemSelector,
          columnWidth   : binding.value.columnWidth,
          gutter        : binding.value.gutter,
          col           : binding.value.col,
          space          : binding.value.space,
          percentPosition: binding.value.percentPosition,
          responsive: {
            860: { col: binding.value.responsives.tablet.col },
            577: { col: binding.value.responsives.mobi.col },
          },
        };
        el.customMasonry_obj = new SpCustomMasonry($(el), CustomMasonryOpts);

        var gridRefresh = function() {
          el.customMasonry_obj.elem.trigger('grid:refresh', {col: binding.value.col, space: binding.value.space});
        }

        vnode.context.$root.$on('event:grid_add_item', function(item) {
          el.customMasonry_obj.grid.isotope('insert', $(item) );
          gridRefresh();
        })

        vnode.context.$root.$on('event:grid_refresh', function() {
          gridRefresh();
        })
      },
      update: function(el, binding, vnode) {
        vnode.context.$root.$emit('event:grid_refresh');
      }
    },
    gridItem: {
      inserted: function(el, binding, vnode) {
        vnode.context.$root.$emit('event:grid_add_item', el);
      }
    },
  },
  methods: {
    openModalToEdit: function(item) {
      // console.log(item);
      this.$root.$emit('eventOpenModalToEdit', item);
    },
    getPointPosition: function(point) {
      return {
        left: point.x + '%',
        top: point.y + '%',
      }
    },
    gridStyle: function() {
      return {};
    }
  },
};
