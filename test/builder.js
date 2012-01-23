void function() {
  var builder = require('./moros').builder

  function to_html(el) {
    var x = document.createElement('div')
    x.appendChild(el)
    return x.innerHTML.replace(/\s+/, '').toLowerCase() }


  describe('Module: builder', function() {
    describe('make_node', function() {
      it('- Should convert anything to a text node.', function() {
        expect(builder.make_node(1)    .nodeValue).to.equal('1')
        expect(builder.make_node('1')  .nodeValue).to.equal('1')
        expect(builder.make_node([1,2]).nodeValue).to.equal('1,2')
        expect(builder.make_node({a:1}).nodeValue).to.equal('[object Object]')
      })
      it('- Shouldn\'t modify things that are already nodes.', function() {
        var node = builder.make_node(1)
        expect(builder.make_node(node)).to.be(node)
      })
    })

    describe('make_element', function() {
      it('- Should create a new Element.', function() {
        var el = builder.make_element('div', {}, [])
        expect(el).to.have.property('tagName', 'DIV')
      })
      it('- Should set the given attributes on the new Element.', function() {
        var el = builder.make_element('a'
                                     , { title: 'foo'
                                       , target: '_blank'
                                       , 'data-foo': 'bar' }
                                     , [])
        expect(el).to.have.property('title', 'foo')
        expect(el).to.have.property('target', '_blank')
        expect(el.getAttribute('title')).to.equal('foo')
        expect(el.getAttribute('target')).to.equal('_blank')
        expect(el.getAttribute('data-foo')).to.equal('bar')
        expect(el).to.not.have.property('data-foo')
      })
      it('- Should append the given elements to the new Element.', function() {
        var b = builder.make_element('b', {}, [])
        var i = builder.make_element('i', {}, [])
        var span = builder.make_element('span', {}, [b, i])

        expect(span.childNodes[0]).to.equal(b)
        expect(span.childNodes[1]).to.equal(i)
        expect(span.childNodes).to.have.length(2)
      })
    })

    describe('html[tag-name]', function() {
      it('- Should create a new Element of <tag-name>.', function() {
        with(builder.html) {
          expect(span()).to.have.property('tagName', 'SPAN')
        }
      })
      it('- Should extend the given properties with the defaults for <tag-name>.', function() {
        with (builder.html) {
          expect(a({ target: '_blank' })).to.have.property('target', '_blank')
          expect(div({ 'data-foo': 'bar' }, 'foo').getAttribute('data-foo')).to.equal('bar')
        }
      })
      it('- Should append the given children to the new Element.', function() {
        with (builder.html) {
          expect(span(b(), i()).childNodes).to.have.length(2)
          expect(span(b(), i()).childNodes[0]).to.have.property('tagName', 'B')
          expect(span(b(), i()).childNodes[1]).to.have.property('tagName', 'I')
        }
      })
      it('- Should treat the first argument as properties if it\'s a plain obj.', function() {
        with (builder.html) {
          var __x = b()
          expect(span(__x).childNodes).to.have.length(1)
          expect(span({}).childNodes).to.have.length(0)
          expect(span({ 'title': 'foo' })).to.have.property('title', 'foo')
        }
      })
      it('- Should use the defaults for property, if defined.', function() {
        var a = builder.html.a
        builder.defaults.a = {}
        expect(a()).to.have.property('title', '')
        expect(a({ title: 'foo' })).to.have.property('title', 'foo')
        expect(a().hasAttribute('data-foo')).to.not.be.ok()

        builder.defaults.a = { title: 'foo', 'data-foo': 'bar' }
        expect(a()).to.have.property('title', 'foo')
        expect(a().hasAttribute('data-foo')).to.be.ok()
        expect(a().getAttribute('data-foo')).to.equal('bar')
        expect(a({ title: 'bar' })).to.have.property('title', 'bar')
      })
    })
  })
}()