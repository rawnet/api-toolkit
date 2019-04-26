class Session {
    constructor(options) {
        if (options) {
            this.options = options
            if (!options.endpoint && !options.form) {
                console.error('API Toolkit Error: Please provide a valid endpoint or a form to serialize')
                return
            }
        } else {
            console.error('API Toolkit Error: No parameters provided')
        }
        this.events = {
            success: () => {},
            error: () => {},
            before: () => {}
        }
    }
    on(event, callback) {
        this.events[event] = callback
    }
    connect(options) {
        if (options) {
            $.extend(this.options, options)
        }
        if (this.options.form) {
            this.data = this.options.form.serialize()
            this.method = this.options.form.attr('method')
            this.endpoint = this.options.form.attr('action')
        } else {
            this.data = this.options.data || null
            this.method = this.options.method || 'GET'
            this.endpoint = this.options.endpoint
        }

        this.events.before.call(this)

        $.ajax({
            url: this.endpoint,
            method: this.method,
            data: this.data,
            success: (response, statusText, jqxhr) => {
                this.response = response || {}
                this.response.status = jqxhr.status
                this.response.statusText = jqxhr.statusText
                this.events.success.call(this)
            },
            error: (jqxhr) => {
                this.response = jqxhr
                this.events.error.call(this)
            }
        })
    }
}

class Listing {
    constructor(options) {
        this.firstLoad = true
        this.options = options
        this.events = {
            before: () => {},
            after: () => {}
        }
    }
    on(event, callback) {
        this.events[event] = callback
    }
    render(items, isMessage) {
        const timeout = this.firstLoad ? 0 : this.options.animationDuration || 0

        this.firstLoad = false
        this.events.before.call(this)
        this.options.element.removeClass(this.options.animationClass)

        setTimeout(() => {
            if(!this.options.appendItems) {
                this.options.element.empty()
            }
            if (isMessage) {
                this.options.element.append(items)
            } else {
                items.forEach((item) => {
                    this.options.element.append(this.options.template(item))
                })
                this.options.element.addClass(this.options.animationClass)
                this.events.after.call(this)
            }
        }, timeout)
    }
}

class Paginator {
    constructor(options) {
        if (options) {
            if (!options.element) {
                console.error('API:Paginator:Error: Please provide a paginator container')
                return
            }
            if (!options.input) {
                console.error('API:Paginator:Error: Please provide a page input')
                return
            }
            if (!options.session) {
                console.error('API:Paginator:Error: Please provide an API Session')
                return
            }
        } else {
            console.error('API:Paginator:Error: No options provided')
            return
        }
        this.options = $.extend({
            arrows: false,
            ends: false
        }, options);
        this.events = {
            before: () => {},
            after: () => {}
        }
    }
    on(event, callback) {
        this.events[event] = callback
    }
    render(page, total) {
        this.currentPage = page
        this.totalPages = total

        const range = Math.floor(this.options.limit / 2 - 1)
        let start = this.currentPage - range < 1 ? 1 : this.currentPage - range
        start = start + this.options.limit > this.totalPages ? this.totalPages - (this.options.limit - 1) : start
        start = start < 1 ? 1 : start
        const last = this.options.limit + start > this.totalPages ? this.totalPages : this.options.limit + start - 1

        this.options.element.empty()

        for(let i = start; i < last + 1; i++) {
            let classes = i === this.currentPage ? 'button button--active' : 'button'
            classes += this.options.classes ? ' ' + this.options.classes : ''
            const button = $('<button/>', {
                text: i,
                class: classes,
                disabled: i === this.currentPage,
                type: 'button'
            })
            button.on('click', () => {
                this.newPage = i
                this.update.call(this)
            })
            this.options.element.append(button)
        }
        if (this.options.ellipsis) {
            if (this.currentPage <= (this.totalPages - this.options.limit)) {
                const end = $('<button/>', {
                    text: this.totalPages,
                    class: 'paginator__button paginator__button--next',
                    type: 'button'
                })
                end.on('click', function() {
                    this.newPage = this.totalPages
                    this.update.call(this)
                }.bind(this))
                this.options.element.append('<span class="ellipses">...</span>')
                this.options.element.append(end)
            }
        }
        if (this.options.arrows) {
            const prev = $('<button/>', {
                text: 'Prev',
                class: 'paginator__button paginator__button--previous',
                disabled: this.currentPage === 1,
                type: 'button'
            })
            const next = $('<button/>', {
                text: 'Next',
                class: 'paginator__button paginator__button--next',
                disabled: this.currentPage === this.totalPages
            })
            prev.on('click', function() {
                this.newPage = this.currentPage - 1
                this.update.call(this)
            }.bind(this))
            next.on('click', function() {
                this.newPage = this.currentPage + 1
                this.update.call(this)
            }.bind(this))

            this.options.element.prepend(prev)
            this.options.element.append(next)
        }
        if (this.options.ends) {
            const startButton = $('<button/>', {
                text: 'First',
                class: 'paginator__button paginator__button--start',
                disabled: this.currentPage === 1,
                type: 'button'
            })
            const endButton = $('<button/>', {
                text: 'Last',
                class: 'paginator__button paginator__button--ends',
                disabled: this.currentPage === this.totalPages,
                type: 'button'
            })
            startButton.on('click', function() {
                this.newPage = 1
                this.update.call(this)
            }.bind(this))
            endButton.on('click', function() {
                this.newPage = this.totalPages
                this.update.call(this)
            }.bind(this))
            
            this.options.element.prepend(startButton)
            this.options.element.append(endButton)
        }
    }
    update() {
        this.options.input.val(this.newPage)
        this.options.session.connect()
    }
}

class LoadMore {
    constructor(options) {
        if (options) {
            if (!options.element) {
                console.error('API:LoadMore:Error: Please provide a load more container')
                return
            }
            if (!options.input) {
                console.error('API:LoadMore:Error: Please provide a page input')
                return
            }
            if (!options.session) {
                console.error('API:LoadMore:Error: Please provide an API Session')
                return
            }
        } else {
            console.error('API:LoadMore:Error: No options provided')
            return
        }
        this.options = $.extend({
            text: 'Load More',
            classes: 'button'
        }, options);
        this.events = {
            before: () => {},
            after: () => {}
        }
    }
    on(event, callback) {
        this.events[event] = callback
    }
    render(page, total) {
        this.currentPage = page     
        this.totalPages = total
        this.options.element.empty()
        const button = $('<button/>', {
            text: this.options.text,
            class: this.options.classes,
            disabled: this.currentPage === this.totalPages
        })
        button.on('click', () => {
            this.newPage = this.currentPage + 1
            this.update.call(this)
        })
        this.options.element.append(button)
    }
    update() {
        this.options.input.val(this.newPage)
        this.options.session.connect()
    }
}

export {
    Session,
    Listing,
    Paginator,
    LoadMore
}