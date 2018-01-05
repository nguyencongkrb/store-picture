'use strict';

window.smallConfirmTool = function(opts) {
  var opts = $.extend({
    // mode          : 'click',
    x                 : window.innerWidth / 2,
    y                 : window.innerHeight / 2,
    content           : '',
    pos               : 'bottom-center',
    confirm_text      : 'Confirm',
    close_text        : 'Cancel',
    confirm_callback  : function() { return; },
    close_callback    : function() { return; },
  }, opts);

  var html = [
    '<div class="sp-small-confirm-wrap">',
      '<div class="sp-small-confirm-inner">',
        '<div class="message">'+ opts.content +'</div>',
        '<div class="btn-action">',
          '<a href="javascript:" class="sp-button-action btn-link btn-cancel">'+ opts.close_text +'</a>',
          '<a href="javascript:" class="sp-button-action btn-primary btn-confirm">'+ opts.confirm_text +'</a>',
        '</div>',
      '</div>',
    '</div>',
  ].join('');

  var $elem = $(html).css({
    left  : opts.x,
    top   : opts.y,
  });

  $('body').append($elem);

  /* add class position */
  $elem.addClass('pos-' + opts.pos);

  $elem.on({
    'open': function(e) {
      $elem
      .addClass('is-open')
      .css({
        'transform': 'scale(0.6)',
        'opacity': 0,
      })

      anime({
        targets   : $elem[0],
        scale     : 1,
        opacity   : 1,
        duration  : 1000,
        complete: function(anim) {}
      });
    },
    'set_position': function(e, x, y) {

      anime({
        targets   : $elem[0],
        left      : x,
        top       : y,
        duration  : 500,
        easing    : 'easeInOutExpo',
        complete  : function() {
          opts.x = x;
          opts.y = y;
        }
      });
    },
    'set_content': function(e, content) {
      $elem.find('.message').html(content);
    },
    'close': function() {

      anime({
        targets   : $elem[0],
        scale     : 0.6,
        opacity   : 0,
        duration  : 1000,
        complete  : function(e, fn) {
          (opts.close_callback) ? opts.close_callback.call(this) : '';
          $elem.removeClass('is-open');
        }
      });
    },
    'remove': function() {
      $elem.remove();
    },
    'confirm': function() {
      (opts.confirm_callback) ? opts.confirm_callback.call(this) : '';
    },
  })

  $elem.on('click.smt_confirm', '.btn-confirm', function(e) {
    e.preventDefault();
    $elem.trigger('confirm');
    $elem.trigger('close');
  })

  $elem.on('click.smt_close', '.btn-cancel', function(e) {
    e.preventDefault();
    $elem.trigger('close');
  })

  /* esc to close */
  $(document).off('keyup.small_confirm_tool').on('keyup.small_confirm_tool', function(evt) {
    var evt = evt || window.event;
    var isEscape = false;

    if ("key" in evt) { isEscape = (evt.key == "Escape" || evt.key == "Esc"); }
    else { isEscape = (evt.keyCode == 27); }

    if (isEscape) { $elem.trigger('close'); }
  })

  return {
    elem: $elem,
    open: function(x, y) {

      if(! $elem.hasClass('is-open')) {
        /* open & move animate */
        $elem.trigger('open');
        $elem.trigger('set_position', [x, y]);
      } else {
        /* only move animate */
        $elem.trigger('set_position', [x, y]);
      }

      return this;
    },
    close: function(callback) {
      if(callback) opts.close_callback = callback;
      return this;
    },
    confirm: function(callback) {
      if(callback) opts.confirm_callback = callback;
      return this;
    },
    remove: function() {
      $elem.trigger('remove');
    },
  }
}
