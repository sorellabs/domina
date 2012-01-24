void function() {
  var _ = require('./moros').dom.reflection

  function e(tag) {
    return document.createElement(tag) }

  function html(x) {
    var _ = e('div')
    _.innerHTML = x
    return _ }

  function to_html(x) {
    return x.replace(/\s+/g, '').toLowerCase() }

  var d

  beforeEach(function() {
    d = e('a')
    d.setAttribute('title', 'foo')
    d.setAttribute('target', '_blank')
    d.setAttribute('data-foo', 'bar')
  })

  describe('Module: dom.reflection', function() {
    describe('attributes', function() {
      it('- Should return a list of Attributes in the Element.', function() {
        var attrs = _.attributes(d)
        var all   = { title: 'foo'
                    , target: '_blank'
                    , 'data-foo': 'bar' }
        expect(attrs).to.have.length(3)
        for (var i = 0; i < attrs.length; ++i) {
          expect(all).to.have.property(attrs[i].name)
          expect(all[attrs[i].name]).to.be(attrs[i].value)
          delete all[attrs[i].name]
        }
      })
    })

    describe('attribute', function() {
      it('- Should return the value of the given key.', function() {
        expect(_.attribute(d, 'title')).to.be('foo')
        expect(_.attribute(d, 'target')).to.be('_blank')
        expect(_.attribute(d, 'data-foo')).to.be('bar')
      })
      it('- Should return undefined if the key isn\'t set.', function() {
        expect(_.attribute(d, 'data-bar')).to.be(undefined)
      })
    })

    describe('attribute_set', function() {
      it('- Should modify the attribute on the Element.', function() {
        _.attribute_set(d, 'title', 'bar')
        _.attribute_set(d, 'data-foo', 'foo')

        expect(d.getAttribute('title')).to.be('bar')
        expect(d.getAttribute('data-foo')).to.be('foo')
      })
      it('- Should remove the attribute if the value is `null`.', function() {
        _.attribute_set(d, 'title', null)
        _.attribute_set(d, 'data-foo', null)

        expect(d.hasAttribute('target')).to.be.ok()
        expect(d.hasAttribute('title')).to.not.be.ok()
        expect(d.hasAttribute('data-foo')).to.not.be.ok()
      })
    })

    describe('text', function() {
      it('- Should return a textual serialisation of the DOM subtree.', function() {
        var e = html('<b>foo<i>bar</i>baz</b>')
        expect(_.text(e)).to.be('foobarbaz')
      })
    })

    describe('text_set', function() {
      it('- Should set the node value to the given text.', function() {
        var e = html('<b>foo<i>bar</i>baz</b>')
        _.text_set(e, 'lol')
        expect(e.childNodes).to.have.length(1)
        expect(e.childNodes[0].nodeValue).to.be('lol')
        expect(_.text(e)).to.be('lol')
      })
    })

    describe('html', function() {
      it('- Should return the DOM subtree as serialised HTML.', function() {
        var e = html('<b>foo<i>bar</i>baz</b>')
        expect(_.html(e)).to.be('<b>foo<i>bar</i>baz</b>')
      })
    })

    describe('html_set', function() {
      it('- Should construct a DOM subtree from a serialised HTML.', function() {
        var d = e('div')
        _.html_set(d, '<b>foo<i>bar</i>baz</b>')
        expect(d.childNodes).to.have.length(1)
        expect(d.childNodes[0]).to.have.property('tagName', 'B')
        expect(d.childNodes[0].childNodes).to.have.length(3)
        expect(d.childNodes[0].childNodes[0].nodeValue).to.be('foo')
        expect(d.childNodes[0].childNodes[1]).to.have.property('tagName', 'I')
        expect(d.childNodes[0].childNodes[1].childNodes[0].nodeValue).to.be('bar')
        expect(d.childNodes[0].childNodes[2].nodeValue).to.be('baz')
      })
    })
  })
}()