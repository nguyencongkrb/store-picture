/*
Store Picture Modal
version: 1.0.0
*/

! (function($) {

  /* sp_modal */
  var sp_modal = function(opts) {

    var opts = $.extend({
      'dark_ovelay': false,
      'extra_class': '',
      'width': '',
    }, opts);

    var modal_frame = [];
    var modal_class = ['sp-modal-wrap', opts.extra_class];
    if(opts.dark_ovelay == true){ modal_class.push('dark-background'); }


    modal_frame = [
      '<div class="'+ modal_class.join(' ') +'">',
        '<div class="sp-modal-container">',
          '<a href="javascript:" class="sp-modal-close">',
            '<span class="ion-ios-close-empty"></span>',
          '</a>',
          '<div class="sp-modal-body"></div>',
        '</div>',
      '</div>',
    ].join('');

    var modal_element = $(modal_frame);

    if(opts.width != '') {
      modal_element.find('.sp-modal-container').css({
        width: opts.width,
      })
    }

    modal_element.on({
      'open': function() {
        /* add class open */
        modal_element.addClass('is-open');

        /* css default */
        modal_element.find('.sp-modal-container').css({
          'transform': 'scale(0.6)',
          'opacity': 0,
        });

        /* animate */
        anime({
          targets: modal_element.find('.sp-modal-container')[0],
          scale: { value: 1 },
          opacity: { value: 1 },
          delay: 300,
          complete: function(anim) {

          }
        });
      },
      'close': function() {
        /* animate */
        anime({
          targets: modal_element.find('.sp-modal-container')[0],
          scale: {
            value: .6,
          },
          opacity: {
            value: 0,
          },
          easing: 'easeInOutExpo',
          complete: function(anim) {
            modal_element.removeClass('is-open');
          }
        });
      },
      'remove': function() {
        modal_element.remove();
      },
      'loading': function() {
        $(this).addClass('is-loading');
      },
      'loadComplete': function() {
        $(this).removeClass('is-loading');
      },
      'updateContent': function(e, newContent) {
        $(this)
        .find('.sp-modal-body')
        .html(newContent)
      }
    });

    modal_element.on('click', 'a.sp-modal-close', function(e) {
      e.preventDefault();
      modal_element.trigger('close');
    })

    /* append html on body */
    $('body').append(modal_element);

    return {
      'modal': modal_element,
      'open': function() {
        return modal_element.trigger('open');
      },
      'close': function() {
        return modal_element.trigger('close');
      },
      'remove': function() {
        modal_element.trigger('remove');
      },
      'loading': function() {
        return modal_element.trigger('loading');
      },
      'loadComplete': function() {
        return modal_element.trigger('loadComplete');
      },
      'updateContent': function(content) {
        return modal_element.trigger('updateContent', [content]);
      }
    };
  }

  /* window.store_picture_modal */
  window.store_picture_modal = window.store_picture_modal || sp_modal;
})(jQuery)
