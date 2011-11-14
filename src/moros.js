/// moros.js --- Pure set-based DOM tree transformation library
//
// Copyright (c) 2011 Quildreen Motta
// Licensed under the permissive MIT/X11 licence.

/// Module moros
void function(root, require_p, exports_p) {

  var __map      = [].map
  var __each     = [].forEach
  var __class_of = {}.toString

  //// Interface Mapper
  // A callback to pass to Array functional utilities.
  //
  // :: Any, Num, [Any] → Any



  //// -Feature testing
  var TEXT
  void function() { var elm
    elm = document.createElement('div')

    //// -Plain text representation
    //
    // =textContent= is the sepc'd standard, but =innerText= is the
    // /de-facto/ one. Most browsers implement both, old IEs only
    // implement the latter, and Mozilla/Gecko only implements the
    // former.
    TEXT = 'innerText' in elm?   'innerText'
         : /* spec-fag impl? */  'textContent'
  }()



  //// -Utilities

  ///// Function nodelist_p
  // Tests if an object looks like a NodeList.
  //
  // NodeList :: Obj → Bool
  function nodelist_p(object) {
    return object != null
        && typeof object.length == 'number'
        && typeof object.item   == 'function' }


  ///// Function sequence_p
  // Tests if an object looks like a sequence.
  //
  // Sequence :: Obj → Bool
  function sequence_p(object) {
    return object != null
        && typeof object.length == 'number' }


  ///// Function map
  // Maps the elements in the array using the provided mapper.
  //
  // :: Sequence, Mapper, Obj → [Any]
  function map(seq, mapper, context) {
    return __map.call(seq, mapper, context) }


  ///// Function each
  // Calls the provided iterator function for every element in the
  // array. 
  //
  // :: Sequence, Mapper, Obj → [Any]
  function each(seq, mapper, context) {
    return __each.call(seq, mapper, context) }



  //// -DOM representation and meta handling

  ///// Function text
  // Returns the =textContent= of one or more =Element=s.
  //
  // :: Element → Str
  // :: [Element] → [Str]
  function text(element, value) {
    return sequence_p(element)?  map(element, text)
         : /* Element? */        element[TEXT] }


  ///// Function set_text
  // Replaces the =textContent= of one or more =Element=s by the
  // provided value.
  //
  // :: Element, Str → Element
  // :: NodeList, Str → NodeList
  // :: [Element], Str → [Element]
  function set_text(element, value) {
    return nodelist_p(element)?  nl_set_text(element)
         : sequence_p(element)?  map(element, mapper)
         : /* Element? */        set(element, value)

    function mapper(e){ return set_text(e, value) }
    function set   (e){ e[TEXT] = value; return e }

    function nl_set_text(nodes) { var i
      i = nodes.length
      while (i--)  nodes[i][TEXT] = value
      return nodes }}


  ///// Function html
  // Returns the =innerHTML= representation of one or more =Element=s.
  //
  // :: Element → Str
  // :: [Element] → Str
  function html(element) {
    return sequence_p(element)?  map(element, html)
         : /* Element? */        element.innerHTML }


  ///// Function set_html
  // Sets the HTML contents of one or more =Element=s, the internal DOM
  // parsing engine will create the appropriate DOM objects from this
  // serialised representation.
  //
  // :note:
  //    Setting these values will destruct all previous DOM
  //    elements that were children of the element and recreate them. In
  //    this case, event handlers and the likes are not carried over.
  //
  // :: Element, Str → Element
  // :: NodeList, Str → NodeList
  // :: [Element], Str → [Element]
  function set_html(element, value) {
    return nodelist_p(element)?  nl_set_html(element)
         : sequence_p(element)?  map(element, mapper)
         : /* Element? */        set(element, value)

    function mapper(e){ return set_html(e, value)     }
    function set   (e){ e.innerHTML = value; return e }

    function nl_set_html(nodes) { var i
      i = nodes.length
      while (i--)  nodes[i].innerHTML = value
      return nodes }}


  ///// Function attr
  // Returns the value of a given attribute in one or more =Element=s.
  //
  // :: Element, Str → Str
  // :: [Element], Str → [Str]
  function attr(element, key) {
    return sequence_p(element)?  map(element, mapper)
         : /* Element? */        element.getAttribute(key)

    function mapper(e){ return attr(e, key) }}


  ///// Function set_attr
  // Sets the value of a given attribute in one or more =Element=s.
  //
  // If the value is =nil=, removes the attribute instead.
  //
  // :: Element, Str, Str → Element
  // :: NodeList, Str, Str → NodeList
  // :: [Element], Str, Str → [Element]
  function set_attr(element, key, value) {
    return nodelist_p(element)?  nl_set_attr(element)
         : sequence_p(element)?  map(element, mapper)
         : value == null?        remove(element, key)
         : /* Element? */        set(element, key, value)

    function mapper(e) { return set_attr(e, key, value)       }
    function remove(e) { e.removeAttribute(key);     return e }
    function set   (e) { e.setAttribute(key, value); return e }

    function nl_set_attr(nodes) { var i
      i = nodes.length
      while (i--)
        value == null?  nodes[i].removeAttribute(key)
        : /* set? */    nodes[i].setAttribute(key, value)

      return nodes }}


  ///// Function data
  // Returns the value of a data-attribute in one or more =Element=s.
  //
  // :: Element, Str → Element
  // :: [Element], Str → [Element]
  function data(element, name) {
    return attr(element, 'data-' + name) }


  ///// Function set_data
  // Sets the value of a data-attribute in one or more =Element=s.
  //
  // :: Element, Str, Str → Element
  // :: NodeList, Str, Str → NodeList
  // :: [Element], Str, Str → [Element]
  function set_data(element, name, value) {
    return set_attr(element, 'data-' + name, value) }



  //// -DOM tree manipulation

  ///// Function detach
  // Removes one or more =Element=s from the DOM.
  //
  // :: Element → Element
  // :: [Element] → Element
  function detach(element) {
    return nodelist_p(element)?  nl_detach(element)
         : sequence_p(element)?  map(element, detach)
         : /* Element? */        do_detach(element)

    function do_detach(e){ e.parentNode.removeChild(e); return e }

    function nl_detach(nodes) { var i
      i = nodes.length
      while (i--)  nodes[i].parentNode.removeChild(nodes[i])
      return nodes }}


  ///// Function insert_before
  // Inserts =elements= before another element.
  //
  // :: Element, Element → Element
  // :: Element, [Element] → Element
  function insert_before(node, elements) {
    ( nodelist_p(elements)?  nl_insert_before()
    : sequence_p(elements)?  each(elements, insert_element)
    : /* Element? */         do_insert(elements, node)
    )
    return node

    function insert_element(e){ return insert_before(node, e)             }
    function do_insert(e, n)  { n.parentNode.insertBefore(e, n); return n }

    function nl_insert_before() { var i, len, parent
      parent = node.parentNode
      for (i = 0, len = elements.length; i < len; ++i)
        parent.insertBefore(elements[i], node)
      return node }}


  ///// Function insert_after
  // Inserts =elements= after another element.
  //
  // :: Element, Element → Element
  // :: Element, [Element] → [Element]
  function insert_after(node, elements) {
    ( nodelist_p(elements)?  nl_insert_after()
    : sequence_p(elements)?  each(elements, do_insert)
    : /* Element? */         do_insert(elements)
    )
    return node

    function do_insert(e) {
      node.parentNode.insertBefore(e, node.nextSibling)
      return node }

    function nl_insert_after() { var i, parent, place
      i      = elements.length
      parent = node.parentNode
      place  = node.nextSibling
      while (i--)  parent.insertBefore(elements[i], place)
      return node }}


  ///// Function append
  // Appends one or more elements to a single =parent=.
  //
  // :: Element, Element → Element
  // :: Element, [Element] → Element
  function append(parent, childs) {
    ( nodelist_p(childs)?  nl_append()
    : sequence_p(childs)?  each(childs, append_child)
    : /* Element? */       parent.appendChild(childs)
    )
    return parent

    function append_child(child){ append(parent, child) }

    function nl_append() { var i, len
      for (i = 0, len = childs.length; i < len; ++i)
        parent.appendChild(childs[i])
      return parent }}


  ///// Function prepend
  // Prepends one or more elements to a single =parent=.
  //
  // :: Element, Element → Element
  // :: Element, [Element] → Element
  function prepend(parent, childs) {
    return insert_before(parent.firstChild, childs) }


  ///// Function replace
  // Replaces a single =element= by one or more =Element=s.
  //
  // :: Element, Element → Element
  // :: Element, [Element] → Element
  function replace(element, replacement) {
    ( sequence_p(replacement)?  replace_childs(element, replacement)
    : /* Element? */            do_replace(element, replacement)
    )
    return element

    function do_replace(e, r) { e.parentNode.replaceChild(e, r); return e }
    function replace_childs() {
      prepend(element.parentNode, replacement)
      detach(element) }}



  //// -Exports
  var moros
  if (exports_p)  moros = exports
  else { var old
    old   = root.moros
    moros = root.moros = {}

    moros.make_local = function() {
      root.moros = old
      return moros }}

  
  moros.html     = html
  moros.set_html = set_html
  moros.text     = text
  moros.set_text = set_text
  moros.attr     = attr
  moros.set_attr = set_attr
  moros.data     = data
  moros.set_data = set_data

  moros.detach        = detach
  moros.insert_before = insert_before
  moros.insert_after  = insert_after
  moros.append        = append
  moros.prepend       = prepend
  moros.replace       = replace

  moros.internals = { nodelist_p: nodelist_p
                    , sequence_p: sequence_p }

// -- moros.js ends here --
}
( this
, typeof require == 'function'
, typeof exports != 'undefined'
)