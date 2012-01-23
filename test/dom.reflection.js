void function() {
  var _ = require('./moros').dom.reflection

  describe('Module: dom.reflection', function() {
    describe('attributes', function() {
      it('- Should return a list of Attributes in the Element.')
    })

    describe('attribute', function() {
      it('- Should return the value of the given key.')
      it('- Should return undefined if the key isn\'t set.')
    })

    describe('attribute_set', function() {
      it('- Should modify the attribute on the Element.')
      it('- Should remove the attribute if the value is `null`.')
    })

    describe('text', function() {
      it('- Should return a textual serialisation of the DOM subtree.')
    })

    describe('text_set', function() {
      it('- Should set the node value to the given text.')
    })

    describe('html', function() {
      it('- Should return the DOM subtree as serialised HTML.')
    })

    describe('html_set', function() {
      it('- Should construct a DOM subtree from a serialised HTML.')
    })
  })
}()