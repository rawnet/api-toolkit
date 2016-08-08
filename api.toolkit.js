var API = {};

// SESSION OBJECT
API.Session = function() {
  this.events = {
    success: function() {},
    error: function() {},
    before: function() {}
  }
};

API.Session.prototype.on = function(event, callback) {
  this.events[event] = callback;
};

API.Session.prototype.connect = function(form) {
  this.form = form;
  this.data = form.serialize();
  this.method = form.attr('method');
  this.endpoint = form.attr('action');

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