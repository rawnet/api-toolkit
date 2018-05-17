# API Toolkit
A toolkit for interacting with APIs

## Installation
`bower install rawnet/api-toolkit`

## Usage

To use the toolkit, you will need to import it at the top of the module you intend to use it.
```
import { Session, Listing, Paginator } from './../components/api-toolkit'
```

### Session
```
  this.session = new Session({
    form: $('form')
  })
  this.session.on('success', function() {
    console.log(this.response);
  })
  this.session.on('error', function() {
    console.log(this.response);
  })
```

### Listing
```
  this.listing = new Listing({
    element: $('.listing'),
    template: template,
    appendItems: true // (optional) Appends new items to bottom of container rather than replace. This can be used for a 'load more' event.
    animationClass: 'is-visible', // (optional)
    animationDuration: 300 (optional)
  });
  
```
#### Render 
Listing render function takes an array of items. Most likely this will be called in conjunction with your session success function.
```
this.session.on('success', function() {
  listing.render(this.reponse)
})

Listing render function also accepts an HTML String as the first parameter if you pass in a second parameter of true. This is useful for when filtering returns no results:
```
  this.session.on('success', function() {
    if(this.response.results.length === 0) {
     listing.render('<p>No results found</p>', true)
    }
  })
```

### Paginator
```
  this.paginator = new Paginator({
    element: $('.pagination'),
    input: $('#page-input'),
    session: this.session,
    arrows: true, // (optional)
    ends: true // (optional)
  });

  paginator.render(response.pagination);
```
