# API Toolkit
A toolkit for interacting with APIs

## Usage

To use the toolkit, you will need to import it at the top of the module you intend to use it.
```
import { Session, Listing, Paginator } from './../components/api-toolkit'
```

### Session
A form is required to successfully call your api. Your api endpoint should be set as your forms action.
```
<form action="/api/news">
```

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
})
  
```
#### Render 
Listing render function takes an array of items. Most likely this will be called in conjunction with your session success function.
```
this.session.on('success', function() {
  listing.render(this.reponse)
})
```
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

### Creating templates
Templates for listing items need to be passed to the listing to render successfully. We encourage these to be created using template literals but another templating language could be utilised.
```
const template = (data) => (
`<article class="card">
    <h1 class="card__heading">${data.name}</h1>
</article>`)

export default template
```
```
import article from '../classes/news-article'
```
To ensure your listing module is flexible, template should be set dynamically for each instance.
```
this.listingType = $('.listing').data('type')

this.listing = new Listing({
  element: $('.listing'),
  template: window[this.listingType],
})
```