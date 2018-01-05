(function($) {
  tinymce.create("tinymce.plugins.add_store_picture_button", {

    //url argument holds the absolute url of our plugin directory
    init : function(ed, url) {
      var $modal = new window.store_picture_modal({
        extra_class: 'store-picture-modal-setting-shortcode',
        width: '300px',
      });

      function getStorePictureByAjax(callback) {

        $.ajax({
          type: 'POST',
          url: sp_enqueue_mce_obj.ajax_url,
          data: {action: 'sp_get_all_store_picture'},
          success: function(result) {
            if(callback) callback.call(this, result);
          },
          error: function(e) {
            console.log(e)
          }
        })
      }

      function openModalSettings() {
        var html = `
          <div class="store-picture-shortcode-setting-wrap">
            <h4 class="modal-title">
              Store Picture Shortcode
            </h4>
            <div class="sp-field-wrap">
              <label>Select Store Picture</label>
              <select id="picture-store"></select>
            </div>
            <div class="sp-field-wrap">
              <label>Select Layout</label>
              <select id="picture-store-layout">
                <option value="grid">Grid</option>
                <option value="carousel" disabled>Carousel (coming soon)</option>
              </select>
            </div>
            <div class="btn-action">
              <button class="btn btn-text btn-cancel-action" type="button">Cancel</button>
              <button class="btn btn-primary btn-confirm-action" type="button">Insert</button>
            </div>
          </div>`;

        $modal.open();
        $modal.updateContent(html);

        /* cancel */
        $modal.modal.off('click.close_modal').on('click.close_modal', '.btn-cancel-action', function(e) {
          e.preventDefault();
          $modal.close();
        })

        /* confirm */
        $modal.modal.off('click.confirm_modal').on('click.confirm_modal', '.btn-confirm-action', function(e) {
          e.preventDefault();
          insertShortcode();
          $modal.close();
        })

        $modal.modal.find('select#picture-store').on({
          'is_loading': function() {

            $(this)
            .html('<option>Load store...</option>')
            .css({opacity: .3, pointerEvents: 'none'})
          },
          'is_complete': function() {

            $(this)
            .html('')
            .css({opacity: 1, pointerEvents: 'auto'})
          },
          'load_options': function() {
            var self = this;
            $(this).trigger('is_loading');

            /* load store picture option */
            getStorePictureByAjax(function(result) {
              if(result) {
                try{
                  var obj = JSON.parse(result),
                      options = [];

                  $.each(obj, function(index, item) {
                    options.push('<option value="'+ item.ID +'">'+ item.title +'</option>');
                  })

                  $(self)
                  .trigger('is_complete')
                  .html(options.join(''));

                } catch(e) {
                  console.log(e);
                }
              }
              //console.log(result);
            })
          },
        }).trigger('load_options');

        $modal.modal.getData = function() {
          return {
            id: $modal.modal.find('select#picture-store').val(),
            layout: $modal.modal.find('select#picture-store-layout').val(),
          }
        }
      }

      function insertShortcode() {
        ed.insertContent('[store-picture id="'+ $modal.modal.getData().id +'" layout="'+ $modal.modal.getData().layout +'"]');
      }

      //add new button
      ed.addButton("add_store_picture", {
        title : "Add Store Picture",
        image : "../wp-content/plugins/store-picture/assets/images/store-picrure-icon-60x60.png",
        onclick: openModalSettings,
      });

    },

    createControl : function(n, cm) {
        return null;
    },

    getInfo : function() {
      return {
        longname : "Store Picture Plugin",
        author : "Huynh",
        version : "1.0"
      };
    }
  });

  tinymce.PluginManager.add("add_store_picture_button", tinymce.plugins.add_store_picture_button);
})(jQuery);
