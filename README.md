# API Toolkit
A toolkit for interacting with APIs

## Installation
`bower install rawnet/api-toolkit`

## Usage

### Session
```
  var session = new API.Session();
  session.on('success', function() {
    console.log(this.response);
  });
  session.connect($('form'));
```

### Listing
```
  var listing = new API.Listing({
    element: $('.listing'),
    template: handlebarsTemplate,
    animationClass: 'is-visible',
    animationDuration: 300
  });

  listing.render(items);
```
