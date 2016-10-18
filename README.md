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
  session.on('error', function() {
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
Listing render function takes an array of items, or an HTML String if you pass in a second parameter of true, this is useful for when filtering returns no results:
```
  listing.render('<p>No results found</p>', true);
```


### Paginator
```
  var paginator = new API.Paginator({
    element: $('.pagination'),
    input: $('#page-input'),
    session: session,
    limit: 6,
    arrows: true,
    ends: true,
    ellipsis: true
  });

  paginator.render(currentPage, totalPages);
```
