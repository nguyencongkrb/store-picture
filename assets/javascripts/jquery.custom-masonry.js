/**
 * SpCustomMasonry
 */

$ = jQuery;

String.prototype.SpReplaceMap = function(mapObj) {
  var string = this,
      key;

  for (key in mapObj)
      string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), mapObj[key]);

  return string;
};

var SpCustomMasonry = function($elem, opts) {
  this.elem = $elem;
  this.opts = $.extend({
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    gutter: '.gutter-sizer',
    col: 4,
    space: 20,
    percentPosition: false,
    responsive: {
        860: { col: 2 },
        577: { col: 1 },
    },
  }, opts);

  this.init();
  return this;
}

SpCustomMasonry.prototype = {
  init: function() {
    var self = this;

    // call applySelectorClass()
    self.applySelectorClass();

    // call renderStyle()
    self.renderStyle();

    // call applyMasonry()
    self.applyMasonry();

    // apply triggerEvent
    self.triggerEvent();

    // apply window resize (fix)
    self.resizeHandle();

    // window on load complete
    $(window).on('load', function() {
        // f5 grid
        self.elem.trigger('grid:refresh');
    })
  },
  applySelectorClass: function() {
      this.elemClass = 'masonry_hybrid-' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9);
      this.elem.addClass(this.elemClass);
  },
  renderStyle: function() {
    var self = this,
        css = '';

    self.style = $('<style>'),
    css += ' .{elemClass} { margin-left: -{space}px; width: calc(100% + {space}px); transition-property: height, width; }';
    css += ' .{elemClass} {itemSelector}, .{elemClass} {columnWidth} { width: calc(100% / {col}); }';
    css += ' .{elemClass} {gutter} { width: 0; }';
    css += ' .{elemClass} {itemSelector} { float: left; box-sizing: border-box; padding-left: {space}px; padding-bottom: {space}px; }';

    // resize
    css += ' .{elemClass} {itemSelector}.ui-resizable-resizing { z-index: 999 }';
    css += ' .{elemClass} {itemSelector} .screen-size{ visibility: hidden; transition: .5s; -webkit-transition: .5s; opacity: 0; position: absolute; bottom: calc({space}px + 8px); right: 9px; padding: 2px 4px; border-radius: 2px; font-size: 11px; }';
    css += ' .{elemClass} {itemSelector}.ui-resizable-resizing .screen-size{ visibility: visible; opacity: 1; }';
    css += ' .{elemClass} {itemSelector} .ui-resizable-se { right: 0; bottom: {space}px; opacity: 0; }';
    css += ' .{elemClass} {itemSelector}:hover .ui-resizable-se { opacity: 1; }';

    // extra size
    for (var i = 1; i <= self.opts.col; i++) {
      var _width = (100 / self.opts.col) * i;
      css += '.{elemClass} .grid-item--width' + i + ' { width: ' + _width + '% }';
    }

    // responsive
    var responsive_css = "";
    if (self.opts.responsive != false) {
      $.each(self.opts.responsive, function($k, $v) {
          responsive_css = ' @media (max-width: ' + $k + 'px){ .{elemClass} {itemSelector}, .{elemClass} {columnWidth} { width: calc(100% / ' + $v.col + '); } }' + responsive_css;
      })
      css += responsive_css;
    }

    // replace
    css = css.SpReplaceMap({
      elemClass: self.elemClass,
      itemSelector: self.opts.itemSelector,
      gutter: self.opts.gutter,
      columnWidth: self.opts.columnWidth,
      space: self.opts.space,
      col: self.opts.col
    });

    self.elem.prepend(self.style.html(css));
  },
  clearStyle: function() {
    this.style.remove();
    return this;
  },
  applyMasonry: function() {
    var self = this;

    this.grid = self.elem.isotope({
      itemSelector: self.opts.itemSelector,
      percentPosition: self.opts.percentPosition,
      masonry: {
        columnWidth: self.opts.columnWidth,
        gutter: self.opts.gutter,
      }
    });
  },
  resizeHandle: function() {
    var self = this;
    this.is_window_resize = '';

    // fix window resize
    $(window).on('resize.SpCustomMasonry', function() {
      /* check is resize */
      if (this.is_window_resize) { self.clearTimeout(self.is_window_resize) }

      /* refresh */
      self.is_window_resize = setTimeout(function() {
        self.elem.trigger('grid:refresh');
      }, 100)
    })
  },
  triggerEvent: function() {
    var self = this;

    self.elem.on({
      'grid:refresh': function(e, opts_update) {
        if (opts_update) {
          self.opts = $.extend(self.opts, opts_update);
          self.clearStyle().renderStyle();
        }

        // trigger layout
        self.grid.isotope('layout').delay(500).queue(function() {
          self.grid.isotope('reloadItems').isotope();
          self.grid.isotope('layout');
          $(this).dequeue();
        });
      }
    })

    /*  */
    var img_count = self.elem.find('img').length,
        load_complete = 0;
    self.elem.find('img').each(function() {
      var img = new Image();
      img.onload = function(){
        load_complete += 1;

        if(load_complete == img_count) self.elem.trigger('grid:refresh');
      };
      img.src = this.src;
    })
  }
}

SpCustomMasonry.prototype.resize = function(opts) {
  var self = this;
  self._resize = {};

  // set options
  self._resize.opts = $.extend({
    celHeight: 140,
    sizeMap: [
        [1, 1]
    ],
    resize: false,
  }, opts);

  // func applySize
  self._resize.applySize = function() {
    var countItem = self.elem.find(self.opts.itemSelector).length,
        countSizeMap = self._resize.opts.sizeMap.length;

    for (var i = 0, j = 0; i <= countItem; i++) {
      var _width = self._resize.opts.sizeMap[j][0],
          _height = self._resize.opts.celHeight * self._resize.opts.sizeMap[j][1];

      self.elem.find(self.opts.itemSelector).eq(i)
          .data('grid-size', [self._resize.opts.sizeMap[j][0], self._resize.opts.sizeMap[j][1]])
          .stripClass('grid-item--width')
          .addClass('grid-item--width' + _width)
          .css({
              height: _height,
          })

      j++;
      if (j == countSizeMap) j = 0; // back to top arr
    }
    self.elem.trigger('grid:refresh');
  }
  self._resize.applySize();

  // func getSizeMap
  self._resize.getSizeMap = function() {
      var countItem = self.elem.find(self.opts.itemSelector).length,
          sizeMap = [];

      for (var i = 0; i <= (countItem - 1); i++) {
        var _elem = self.elem.find(self.opts.itemSelector).eq(i),
            _gridSize = _elem.data('grid-size');

        sizeMap.push([_gridSize[0], _gridSize[1]]);
      }

      return sizeMap;
  }

  // func setSizeMap
  self._resize.setSizeMap = function(sizeMap) {
    if (!sizeMap) return;

    self._resize.opts.sizeMap = sizeMap;
    return this;
  }

  // func resizeHandle (resize item masonry)
  self._resize.resizeHandle = function() {
    if (self._resize.opts.resize == false) return;

    self.elem.find(self.opts.itemSelector).resizable({
      handles: 'se',
      start: function() {
        if ($(this).find('.screen-size').length <= 0) {
          this.screenSize = $('<span>', { class: 'screen-size' });
          $(this).append(this.screenSize);
        } else {
          this.screenSize = $(this).find('.screen-size');
        }
      },
      resize: function(event, ui) {
          ui.size.width = ui.size.width + self.opts.space;
          ui.size.height = ui.size.height + self.opts.space;

          var pointerItem = this.getBoundingClientRect(),
              containerWidth = self.elem.width(),
              celWidth = parseInt((containerWidth / 100) * (100 / self.opts.col));

          this.step_w = Math.round(ui.size.width / celWidth),
          this.step_h = Math.round(ui.size.height / self._resize.opts.celHeight);

          if (this.step_w <= 0) this.step_w = 1;
          if (this.step_h <= 0) this.step_h = 1;

          this.screenSize.html(this.step_w + ' x ' + this.step_h);
      },
      stop: function(event, ui) {
          // reset css width/height inline & set item size data
          $(this).css({
            width: '',
            height: '',
          }).data('grid-size', [this.step_w, this.step_h]);
          self._resize.opts.sizeMap = self._resize.getSizeMap();
          self._resize.applySize();
      }
    });
  }
  self._resize.resizeHandle();

  return self._resize;
}
