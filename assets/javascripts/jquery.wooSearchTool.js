'use strict';

window.wooSearchTool = function(opts) {
  var opts = $.extend({
    x         : window.innerWidth / 2,
    y         : window.innerHeight / 2,
    wrap      : $('body'),
    select    : function() { return; },
    formSubmit: function() { return; }
  }, opts);


  var smartDisplayInterval = null;
  var html = `
    <div class="sp-woo-search-tool-wrap">
      <div class="woo-search-tool-inner">
        <div class="s-container">
          <div class="s-input-container">
            <input type="text" placeholder="Search product...">
          </div>
          <div class="result"></div>
          <a class="close"><span class="ion-ios-close-empty"></span></a>
        </div>
      </div>
    </div>`

  var $elem = $(html).css({
    left  : opts.x,
    top   : opts.y,
  });

  opts.wrap.append($elem);

  $elem.on({
    'open': function() {
      $elem.addClass('is-open')
      .css({
        transform: 'scale(.6)',
        opacity: 0,
      });

      anime({
        targets   : $elem[0],
        scale     : 1,
        opacity   : 1,
        duration  : 1000,
        complete  : function() {
          $elem.trigger('inputFocus');
          $elem.trigger('smartDisplay', [150]);
        }
      });
    },
    'close': function() {

      anime({
        targets   : $elem[0],
        scale     : 0.6,
        opacity   : 0,
        duration  : 1000,
        complete  : function(e, fn) {
          if(fn) fn.call(this);
          $elem.removeClass('is-open');
        }
      });
    },
    'remove': function() {
      $elem.remove();
    },
    'setPosition': function(e, x, y) {
      anime({
        targets   : this,
        left      : x,
        top       : y,
        duration  : 500,
        easing    : 'easeInOutExpo',
        complete  : function() {
          opts.x = x;
          opts.y = y;
          $elem.trigger('inputFocus');
          $elem.trigger('smartDisplay', [150]);
        }
      });
    },
    'inputFocus': function() {
      $elem.find('.s-input-container input[type="text"]').focus();
    },
    'pushData': function(e, result) {
      $elem.find('.result').html(result);
      $elem.trigger('smartDisplay', [150]);
    },
    'toogleForm': function(e) {
      $elem.find('.woo-search-tool-inner').toggleClass('open-form');
      $elem.trigger('smartDisplay', [150]);
    },
    'smartDisplay': function(e, timeout) {
      clearInterval(smartDisplayInterval);

      smartDisplayInterval = setInterval(function() {
        var sd_var = {
          browserHeight : $(window).height(),
          // resultHeight  : $elem.find('.result').innerHeight() + 80,
          resultHeight  : $elem.find('.woo-search-tool-inner').innerHeight() + 10,
          elemAnimate   : $elem.find('.woo-search-tool-inner'),
        };

        if((sd_var.resultHeight + opts.y) >= sd_var.browserHeight) {

          if(! $elem.hasClass('is-right')) {
            $elem.addClass('is-right');
            sd_var.elemAnimate.css({'opacity': 0})
          }

          anime({
            targets   : sd_var.elemAnimate[0],
            top       : sd_var.browserHeight - (sd_var.resultHeight + opts.y),
            opacity   : 1,
            duration  : 500,
            easing    : 'easeInOutExpo',
            complete  : function() {}
          });
        } else {

          if($elem.hasClass('is-right')) {
            $elem.removeClass('is-right');
            sd_var.elemAnimate.css({'opacity': 0, 'top': 30});
            anime({
              targets   : sd_var.elemAnimate[0],
              top       : 8,
              opacity   : 1,
              duration  : 500,
              easing    : 'easeInOutExpo',
              complete  : function() {}
            });
          }
        }

        clearInterval(smartDisplayInterval);
      }, timeout);
    },
  })

  /* toggle form */
  $elem.on('click', '.toggle-form, .btn-cancel', function(e) {
    e.preventDefault();
    $elem.trigger('toogleForm');
  })

  $elem.on('submit', 'form.form-add-external-product', function(e) {
    e.preventDefault();

    var data = $(this).serialize(); // console.log(data);
    window.sp_request({
      data: {action: 'sp_woo_add_external_product', data: data},
      success: function(result) {
        console.log(result);
      }
    })
    // opts.formSubmit.call(this, data);
  })

  /* trigger close on resize browser */
  var resize_inverval = null;
  $(window).on('resize.close_sp_woo_search_tool', function(e) {
    clearInterval(resize_inverval);

    resize_inverval = setInterval(function() {
      $elem.trigger('close');
      clearInterval(resize_inverval);
    }, 400)
  })

  /* on type */
  $elem.on('input', '.s-input-container input[type="text"]', function(e) {
    var value = this.value;
    window.sp_request({
      data: {action: 'sp_woo_search_tool_items_render', s: value},
      success: function(result) {
        // console.log(result);
        $elem.trigger('pushData', [result]);
      }
    })
  })

  $elem.on('click.select_item', '[data-pid]', function(e) {
    e.preventDefault();
    var pid = $(this).data('pid'); // console.log(opts.select);
    if(opts.select) opts.select.call(this, pid);
    $elem.trigger('close');
  })

  $elem.on('click.close_modal', 'a.close', function(e) {
    e.preventDefault();
    $elem.trigger('close');
  })

  /* esc to close */
  // $(document).off('keyup.sp_woo_search_tool_close').on('keyup.sp_woo_search_tool_close', function(evt) {
  //   var evt = evt || window.event;
  //   var isEscape = false;
  //
  //   if ("key" in evt) { isEscape = (evt.key == "Escape" || evt.key == "Esc"); }
  //   else { isEscape = (evt.keyCode == 27); }
  //   if (isEscape) { $elem.trigger('close'); }
  // })

  return {
    elem: $elem,
    open: function(x, y) {
      $elem
      .trigger('open')
      .trigger('setPosition', [x, y]);
    },
    close: function() {
      $elem.trigger('close');
    },
    setPosition: function(x, y) {
      $elem
      .trigger('setPosition', [x, y])
    },
    isOpen: function() {
      return ($elem.hasClass('is-open')) ? true : false;
    },
    pushData: function(data) {
      $elem.trigger('pushData', [data]);
    },
    select: function(callback)  {
      if( callback ) { opts.select = callback; }
      $elem.trigger('click.select_item');
    }
  }
}
