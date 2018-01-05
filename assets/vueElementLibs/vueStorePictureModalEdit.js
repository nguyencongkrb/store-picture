'use strict';

var $ = jQuery.noConflict();

var StorePictureModalEdit_API = {
  wooSearchTool_obj   : new window.wooSearchTool(),
  confirmTool_obj     : new window.smallConfirmTool({content: 'Are you sure to delete this?'}),
  _request            : window.sp_request,
};

var vueStorePictureModalEdit = {
  props: ['edit'],
  data: function() {
    return {
      modalClass: this.spModalClass(),
      data: this.getModalData(),
      nameEditorOptions: {
        placeholder: {
          text: 'Enter picture name...',
          hideOnClick: true
        },
        disableExtraSpaces: true,
        toolbar: {buttons: ['italic', 'underline']}
      },
      descriptionEditorOptions: {
        placeholder: {
          text: 'Enter picture description...',
          hideOnClick: true
        },
        disableExtraSpaces: true,
        toolbar: {buttons: ['bold', 'italic', 'underline', 'anchor']}
      },
    }
  },
  template: `
    <transition
      mode="in-out"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:leave="leave"
      v-bind:css="false"
    >
      <div :class="modalClass">
        <div class="overlay-modal" @click="closeModal()"></div>
        <div class="sp-modal-container">
          <a href="javascript:" class="sp-modal-close" @click="closeModal()">
            <span class="ion-ios-close-empty"></span>
          </a>
          <div class="sp-navs">
            <a v-if="navControlDisplay('prev')" class="item-prev" @click="navControlDirect('prev', $event)" href="#"><span class="sp-icon i-back"></span></a>
            <a v-if="navControlDisplay('next')" class="item-next" @click="navControlDirect('next', $event)" href="#"><span class="sp-icon i-next"></span></a>
          </div>
          <div class="sp-modal-body">
            <div class="picture-editor-wrap">
              <div class="picture-wrap">
                <div class="picture-pick" @click="wooSearchToolHandle">
                  <img :src="data.editData.pictures.url" alt="#">
                </div>
                <sp-picture-points v-if="data.editData.points.length > 0" :pdata="data.editData.points"></sp-picture-points>
                <div class="sp-follow" v-if="data.editData.source && data.editData.source.type == 'instagram'">
                  <div class="icon-wrap">
                    <span class="sp-icon i-instagram"></span>
                    <span class="instagram-user-link"><a :href="'https://www.instagram.com/' + data.editData.source.user.username" target="_blank">{{ data.editData.source.user.username }}</a></span>
                  </div>
                </div>
              </div>
              <div class="picture-control-wrap">
                <div class="picture-control-inner nano" v-nanoscroll>
                  <div class="nano-content">
                    <div class="control-item">
                      <div class="picture-name">
                        <sp-medium-editor v-if="edit == 'true'" :text='data.editData.name' :options='nameEditorOptions' v-on:edit='nameProcessEditOperation' custom-tag='h3'></sp-medium-editor>
                        <h3 v-else v-html="data.editData.name"></h3>
                      </div>
                    </div>
                    <div class="picture-products" v-if="data.editData.points.length > 0">
                      <div class="p-item" v-for="(item, index) in data.editData.points" :key="item.pid" ref="product_elems">
                        <sp-product-item :item="item" :index="index" :remove="edit"></sp-product-item>
                      </div>
                    </div>
                    <div class="control-item">
                      <div class="picture-description">
                        <sp-medium-editor v-if="edit == 'true'" :text='data.editData.description' :options='descriptionEditorOptions' v-on:edit='descriptionProcessEditOperation' custom-tag='div'></sp-medium-editor>
                        <p v-else v-html="data.editData.description"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>`,
  methods: {
    getIndexCurrentData: function() {
      var storePictureData = this.$root.storePicture.storePictureData,
          itemEdit = this.$root.modalControl.editData;

      return storePictureData.indexOf(itemEdit);
    },
    navControlDisplay: function(direct) {
      var currentIndex = this.getIndexCurrentData(),
          total = this.$root.storePicture.storePictureData.length;

      if('prev' == direct) {
        if(currentIndex <= 0) return false;
        else return true;
      } else {
        /* next */
        if(currentIndex >= (total - 1)) return false;
        else return true;
      }
    },
    navControlDirect: function(direct, event) {
      event.preventDefault();
      var currentIndex = this.getIndexCurrentData();

      if(StorePictureModalEdit_API.wooSearchTool_obj.isOpen())
        StorePictureModalEdit_API.wooSearchTool_obj.close();

      if('prev' == direct) {
        /* prev */
        this.$root.modalControl.editData = this.$root.storePicture.storePictureData[currentIndex-1];
      } else {
        /* next */
        this.$root.modalControl.editData = this.$root.storePicture.storePictureData[currentIndex+1];
      }
    },
    wooSearchToolHandle: function(e) {
      if(this.edit != 'true') return;

      var self = this,
          elem = e.target,
          obj  = {
            pictureWidth      : $(e.target).innerWidth(),
            pictureHeight     : $(e.target).innerHeight(),
            mouseX            : e.clientX,
            mouseY            : e.clientY,
            currentPositionL  : $(e.target).offset().left,
            currentPositionT  : $(e.target).offset().top - $(window).scrollTop(),
          };

      var point_position = {
        x: parseInt(((obj.mouseX - obj.currentPositionL) * 100) / obj.pictureWidth),
        y: parseInt(((obj.mouseY - obj.currentPositionT) * 100) / obj.pictureHeight),
      };

      if( StorePictureModalEdit_API.wooSearchTool_obj.isOpen() ) { StorePictureModalEdit_API.wooSearchTool_obj.setPosition(e.clientX, e.clientY); }
      else { StorePictureModalEdit_API.wooSearchTool_obj.open(e.clientX, e.clientY); }

      StorePictureModalEdit_API.wooSearchTool_obj.select(function(pid) {
        var point = {
          pid   : pid,
          x     : point_position.x,
          y     : point_position.y,
        };
        self.addPoint(point);
        // console.log(point, obj);
      })
    },
    addPoint: function(pointData) {
      this.data.editData.points.push(pointData);
    },
    nameProcessEditOperation: function(operation) {
      // this.data.editData.name = operation.event.explicitOriginalTarget.innerHTML;
      this.data.editData.name = operation.api.elements[0].innerHTML;
    },
    descriptionProcessEditOperation: function(operation) {
      this.data.editData.description = operation.api.elements[0].innerHTML;
    },

    spModalClass: function() {
      var result = ['sp-modal-wrap', 'dark-background'],
          modalData = this.getModalData();

      if(modalData.show == true) result.push('is-open');

      return result.join(' ', result);
    },
    getModalData: function() {
      return this.$root.$data.modalControl;
    },
    closeModal: function() {
      StorePictureModalEdit_API.wooSearchTool_obj.close();
      StorePictureModalEdit_API.confirmTool_obj.close();
      return this.$root.$data.modalControl.show = false;
    },

    beforeEnter: function (el) {
      // el.style.opacity = 0

      /* css default */
      $(el).find('.sp-modal-container').css({
        'transform': 'scale(0.6)',
        'opacity': 0,
      });
    },
    enter: function (el, done) {

      /* animate */
      anime({
        targets: $(el).find('.sp-modal-container')[0],
        scale: { value: 1 },
        opacity: { value: 1 },
        delay: 300,
        complete: function(anim) {

        }
      });
    },
    leave: function (el, done) {

      /* animate */
      anime({
        targets: $(el).find('.sp-modal-container')[0],
        scale: {
          value: .6,
        },
        opacity: {
          value: 0,
        },
        easing: 'easeInOutExpo',
        complete: done
      });
    }
  },
}
