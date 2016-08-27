var API = {};

// SESSION OBJECT
API.Session = function(options) {
  if(options) {
    this.options = options;
    if(!this.options.endpoint && !this.options.form) {
      console.error('API Toolkit Error: Please provide a valid endpoint or a form.');
      return;
    }
  } else {
    console.error('API Toolkit Error: No parameters provided.');
    return;
  }
  this.events = {
    success: function() {},
    error: function() {},
    before: function() {}
  }
};

API.Session.prototype.on = function(event, callback) {
  this.events[event] = callback;
};

API.Session.prototype.connect = function() {
  if(this.options.form) {
    this.data = this.options.form.serialize();
    this.method = this.options.form.attr('method');
    this.endpoint = this.options.form.attr('action');
  } else {
    this.data = this.options.data || null;
    this.method = this.options.method || 'GET';
    this.endpoint = this.options.endpoint;
  }

  this.events.before.call(this);

  $.ajax({
    url: this.endpoint,
    method: this.method,
    data: this.data,
    success: function(response) {
      this.response = JSON.parse(response);
      this.events.success.call(this);
    }.bind(this),
    error: function(jqxhr) {
      this.response = jqxhr;
      this.events.error.call(this);
    }.bind(this)
  });
};

// LISTING OBJECT
API.Listing = function(options) {
  this.firstLoad = true;
  this.options = options;
  this.events = {
    before: function() {},
    after: function() {}
  }
};

API.Listing.prototype.on = function(event, callback) {
  this.events[event] = callback;
};

API.Listing.prototype.render = function(items) {
  var timeout = this.firstLoad ? 0 : this.options.animationDuration || 0;
  
  this.firstLoad = false;
  this.events.before.call(this);
  this.options.element.removeClass(this.options.animationClass);

  setTimeout(function() {
    this.options.element.empty();
    items.forEach(function(item) {
      this.options.element.append(this.options.template(item));
    }.bind(this));
    this.options.element.addClass(this.options.animationClass);
    this.events.after.call(this);
  }.bind(this), timeout);
};

// PAGINATOR OBJECT
API.Paginator = function(options) {
  this.options = $.extend({
    limit: 6
  }, options);
  this.events = {
    before: function() {},
    after: function() {}
  }
}

API.Paginator.prototype.render = function(page, total) {
  this.options.element.empty();
  this.currentPage = page;
  this.totalPages = total;
  this.events.before.call(this);

  var range = Math.floor(this.options.limit / 2 - 1),
      start = this.currentPage - range < 1 ? 1 : this.currentPage - range,
      start = start + this.options.limit > this.totalPages ? this.totalPages - (this.options.limit - 1) : start,
      start = start < 1 ? 1 : start,
      last = this.options.limit + start > this.totalPages ? this.totalPages : this.options.limit + start - 1;

  for(var i = start; i < last + 1; i++) {
    var classes = i === page ? 'paginator__button paginator__button--is-active' : 'paginator__button';
    var button = $('<button/>', {
      text: i,
      class: classes,
      disabled: i === page
    });
    button.on('click', function(e) {
      this.newPage = $(e.currentTarget).text();
      this.update.call(this);
    }.bind(this));
    this.options.element.append(button);
  }

  if(this.options.ellipsis) {
    if(start > 1) {
      var ellipsisBefore = $('<span/>', {
        text: '...',
        class: 'paginator__ellipsis'
      });
      var first = $('<button/>', {
        text: '1',
        class: 'paginator__button'
      });
      first.on('click', function() {
        this.newPage = 1;
        this.update.call(this);
      }.bind(this));
      this.options.element.prepend(ellipsisBefore);
      this.options.element.prepend(first);
    }
    if(last < this.totalPages) {
      var ellipsisAfter = $('<span/>', {
        text: '...',
        class: 'paginator__ellipsis'
      });
      var last = $('<button/>', {
        text: this.totalPages,
        class: 'paginator__button'
      });
      last.on('click', function() {
        this.newPage = this.totalPages;
        this.update.call(this);
      }.bind(this));
      this.options.element.append(ellipsisAfter);
      this.options.element.append(last);
    }
  }

  if(this.options.arrows) {
    var prev = $('<button/>', {
      text: '<',
      class: 'paginator__button paginator__button--previous',
      disabled: this.currentPage === 1
    });
    var next = $('<button/>', {
      text: '>',
      class: 'paginator__button paginator__button--next',
      disabled: this.currentPage === this.totalPages
    });

    prev.on('click', function() {
      this.newPage = this.currentPage - 1;
      this.update.call(this);
    }.bind(this));
    next.on('click', function() {
      this.newPage = this.currentPage + 1;
      this.update.call(this);
    }.bind(this));

    this.options.element.prepend(prev);
    this.options.element.append(next);
  }

  if(this.options.ends) {
    var start = $('<button/>', {
      text: '<<',
      class: 'paginator__button paginator__button--start',
      disabled: this.currentPage === 1
    });
    var end = $('<button/>', {
      text: '>>',
      class: 'paginator__button paginator__button--ends',
      disabled: this.currentPage === this.totalPages
    });

    start.on('click', function() {
      this.newPage = 1;
      this.update.call(this);
    }.bind(this));
    end.on('click', function() {
      this.newPage = this.totalPages;
      this.update.call(this);
    }.bind(this));
    
    this.options.element.prepend(start);
    this.options.element.append(end);
  }

  this.events.after.call(this);
}

API.Paginator.prototype.update = function() {
  this.options.input.val(this.newPage);
  this.options.session.connect();
}