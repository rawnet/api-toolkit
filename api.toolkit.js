var API = {};

// SESSION OBJECT
API.Session = function(options) {
  this.form = options.form;
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
  this.data = this.form.serialize();
  this.method = this.form.attr('method');
  this.endpoint = this.form.attr('action');

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
  this.options = options;
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
  for(var i = 1; i < total + 1; i++) {
    var classes = i === page ? 'paginator__button paginator__button--is-active' : 'paginator__button';
    var button = $('<button/>', {
      text: i,
      class: classes
    });
    if(i === page) {
      button.attr('disabled', true);
    }
    button.on('click', function(e) {
      this.newPage = $(e.currentTarget).text();
      this.update.call(this);
    }.bind(this));
    this.options.element.append(button);
  }
  this.events.after.call(this);
}

API.Paginator.prototype.update = function() {
  this.options.input.val(this.newPage);
  this.options.session.connect();
}