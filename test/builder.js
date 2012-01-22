var builder = require('./builder')

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
      expect(builder.make_node(node).nodeValue).to.equal('1')
//      expect(builder.make_node(node)).to.be(node)
    })
  })

  describe('make_element', function() {
    it('- Should create a new Element.')
    it('- Should set the given attributes on the new Element.')
    it('- Should append the given elements to the new Element.')
  })

  describe('html[tag-name]', function() {
    it('- Should create a new Element of <tag-name>.')
    it('- Should extend the given properties with the defaults for <tag-name>.')
    it('- Should append the given children to the new Element.')
    it('- Should treat the first argument as properties if it\'s a plain obj.')
  })
})