void function() {
  var _ = require('./moros').dom.manipulation

  function e(tag) {
    return document.createElement(tag)
  }

  describe('Module: dom.manipulation', function() {
    var e1, e2, e3, e4
    beforeEach(function() {
      e1 = e('b')
      e2 = e('i')
      e3 = e('u')
      e4 = e('div')
    })


    describe('append', function() {
      it('- Should insert the Node as the last child.', function() {
        _.append(e4, e1)
        expect(e4.childNodes).to.have.length(1)
        expect(e4.childNodes[e4.childNodes.length-1]).to.be(e1)

        _.append(e4, e2)
        _.append(e4, e3)
        expect(e4.childNodes[1]).to.be(e2)
        expect(e4.childNodes[2]).to.be(e3)
        expect(e4.childNodes).to.have.length(3)
      })
    })

    describe('prepend', function() {
      it('- Should insert the Node as the first child.', function() {
        _.prepend(e4, e1)
        _.prepend(e4, e2)
        expect(e4.childNodes).to.have.length(2)
        expect(e4.childNodes[0]).to.be(e2)
        expect(e4.childNodes[1]).to.be(e1)
      })
    })

    describe('insert_before', function() {
      it('- Should insert the Node before the target.', function() {
        e4.appendChild(e1)
        _.insert_before(e1, e2)
        _.insert_before(e1, e3)

        expect(e4.childNodes).to.have.length(3)
        expect(e4.childNodes[0]).to.be(e2)
        expect(e4.childNodes[1]).to.be(e3)
        expect(e4.childNodes[2]).to.be(e1)
      })
    })

    describe('insert_after', function() {
      it('- Should insert the Node after the target.', function() {
        e4.appendChild(e1)
        _.insert_after(e1, e2)
        _.insert_after(e1, e3)

        expect(e4.childNodes).to.have.length(3)
        expect(e4.childNodes[0]).to.be(e1)
        expect(e4.childNodes[1]).to.be(e3)
        expect(e4.childNodes[2]).to.be(e2)
      })
    })

    describe('remove', function() {
      it('- Should remove the node from the parent.', function() {
        e4.appendChild(e1)
        e4.appendChild(e2)
        e4.appendChild(e3)

        _.remove(e4, e2)
        expect(e4.childNodes).to.have.length(2)
        expect(e4.childNodes[0]).to.be(e1)
        expect(e4.childNodes[1]).to.be(e3)
        expect(e2.parentNode).to.be(null)
      })
    })

    describe('detach', function() {
      it('- Should remove the node from the parent.', function() {
        e4.appendChild(e1)
        e4.appendChild(e2)
        e4.appendChild(e3)

        _.detach(e2)
        expect(e4.childNodes).to.have.length(2)
        expect(e4.childNodes[0]).to.be(e1)
        expect(e4.childNodes[1]).to.be(e3)
        expect(e2.parentNode).to.be(null)
      })
    })

    describe('wrap', function() {
      it('- Should wrap the node in the given wrapper.', function() {
        e4.appendChild(e1)
        _.wrap(e1, e2)

        expect(e4.childNodes).to.have.length(1)
        expect(e2.childNodes).to.have.length(1)
        expect(e4.childNodes[0]).to.be(e2)
        expect(e2.childNodes[0]).to.be(e1)
      })
      it('- Should place the wrapper at the same position.', function() {
        e4.appendChild(e1)
        e4.appendChild(e3)
        _.wrap(e1, e2)

        expect(e4.childNodes[0]).to.be(e2)
      })
    })

    describe('clear', function() {
      it('- Should remove all the children of a node.', function() {
        e4.appendChild(e1)
        e4.appendChild(e2)
        _.clear(e4)

        expect(e4.childNodes).to.have.length(0)
        expect(e1.parentNode).to.be(null)
        expect(e2.parentNode).to.be(null)
      })
    })

    describe('clone', function() {
      it('- Should create shallow clones.', function() {
        e4.appendChild(e1)
        e1.appendChild(e2)
        var x = _.clone(e4)
        e3.appendChild(x)
        e4.setAttribute('title', 'foo')
        e1.setAttribute('title', 'bar')

        expect(e3.childNodes[0]).to.not.be(e4)
        expect(e4.childNodes[0]).to.be(e1)
        expect(x.childNodes).to.have.length(0)
        expect(e4).to.have.property('title', 'foo')
        expect(x).to.not.have.property('title', 'foo')
        expect(e1).to.have.property('title', 'bar')
      })
      it('- Should create deep clones when given `deep=true`', function() {
        e4.appendChild(e1)
        e1.appendChild(e2)
        e2.setAttribute('title', 'baz')
        var x = _.clone(e4, true)
        e3.appendChild(x)
        e4.setAttribute('title', 'foo')
        e1.setAttribute('title', 'bar')

        expect(e3.childNodes[0]).to.not.be(e4)
        expect(e4.childNodes[0]).to.be(e1)
        expect(x.childNodes).to.have.length(1)
        expect(x.childNodes[0].childNodes).to.have.length(1)
        expect(e4).to.have.property('title', 'foo')
        expect(x).to.not.have.property('title', 'foo')
        expect(e1).to.have.property('title', 'bar')
        expect(x.childNodes[0]).to.not.have.property('title', 'bar')
        expect(x.childNodes[0].childNodes[0]).to.have.property('title', 'baz')
      })
    })
  })
}()