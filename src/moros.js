/******************************************************************************
 *                                  ~moros~                                   *
 *                                ‾‾‾‾‾‾‾‾‾‾‾                                 *
 * Set-based library for abstracting transformations on the DOM tree.         *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/

/// Module moros ///////////////////////////////////////////////////////////////
//

void function (root) {

    var __old, moros
      , __map   = [].map
      , __slice = [].slice
      , __class = {}.toString

    /// -Feature testing ///////////////////////////////////////////////////////
    var TEXT
    void function(){ var elm
        elm  = document.createElement('div')
        TEXT = 'innerText' in elm?  'innerText' : 'textContent'
    }()

    /// -Utilities /////////////////////////////////////////////////////////////
    //// Function nodelistp ////////////////////////////////////////////////////
    //
    // NodeList :: Object → Boolean
    //
    // Tests if an object is a NodeList.
    //
    // Uses [[Class]] for browsers that support it, and fallsback to
    // duck-typing on older browsers.
    //
    function nodelistp(object) {
        return /^(HTMLCollection|NodeList)$/.test(class_of(object))
            || (  object != null
               && typeof object.length   == 'number'
               && typeof object.item     == 'function'
               && typeof object.nextNode == 'function' )
    }

    //// Function sequencep ////////////////////////////////////////////////////
    //
    // Sequence :: Object → Boolean
    //
    // Tests if something is a sequence.
    //
    function sequencep(object) {
        return object != null
            && typeof object.length == 'number'
    }

    //// Function class_of /////////////////////////////////////////////////////
    //
    // :: Object → String
    //
    // Returns the internal [[Class]] of an object.
    //
    function class_of(object) {
        return __class.call(object).slice(8, -1)
    }

    //// Function curry_after //////////////////////////////////////////////////
    //
    // :: Fn, Any... → Fn
    //
    // Partially applies parameters to a function, in the right end.
    //
    function curry_after(fn) { var args
        args = slice(arguments, 1)
        return function() {
            return fn.apply(this, to_array(arguments).concat(args)) }
    }

    //// Function slice ////////////////////////////////////////////////////////
    //
    // :: Sequence, Number?, Number? → Array
    //
    // Returns part of a sequence
    //
    // :aliases:
    //   - to_array
    //
    var to_array = slice
    function slice(seq, start, end) {
        return __slice.call(seq, start, end)
    }

    //// Function map //////////////////////////////////////////////////////////
    //
    // :: Sequence, FMapper, Object → Array
    //
    // Maps the elements in the array using the mapping function.
    //
    function map(seq, mapper, context) {
        return __map.call(seq, mapper, context)
    }

    //// Function map_nodes ////////////////////////////////////////////////////
    //
    // :: NodeList, FMapper, Object → NodeList
    //
    // Maps the elements in a NodeList using the mapping function. This
    // is a destructive function, as the NodeList is modified in-place.
    //
    function map_nodes(nodes, mapper, context) { var index
        index = nodes.length
        while (index--)
            nodes[index] = mapper.call(context, nodes[index], index, nodes)
        return nodes
    }



    /// -General DOM manipulation //////////////////////////////////////////////

    /// Function text //////////////////////////////////////////////////////////
    //
    // :: Element → String
    // :: [Element] → [String]
    //
    // Returns the textContent of one or more Elements.
    //
    function text(element, value) {
        return sequencep(element)?  map(element, text)
             : /* Element? */       element[TEXT]
    }

    /// Function set_text //////////////////////////////////////////////////////
    //
    // :: Element, String → Element
    // :: [Element], String → [Element]
    //
    // Replaces the textContent of one or more Elements by the provided value.
    //
    function set_text(element, value) {
        return nodelistp(element)?  map_nodes(element, mapper)
             : sequencep(element)?  map(element, mapper)
             : /* Element? */       set(element, value)

        function mapper(e){ return set_text(e, value) }
        function set(e, v){ e[TEXT] = v; return e     }
    }

    /// Function html //////////////////////////////////////////////////////////
    //
    // :: Element → String
    // :: [Element] → [String]
    //
    // Returns the inner HTML representation of one or more Elements.
    //
    function html(element) {
        return sequencep(element)?  map(element, html)
             : /* Element? */       element.innerHTML
    }

    /// Function set_html //////////////////////////////////////////////////////
    //
    // :: Element, String → Element
    // :: [Element], String → [Element]
    //
    // Sets the HTML contents of one or more Elements, the internal DOM
    // parsing engine will create the appropriate DOM objects from this
    // serialised representation.
    //
    function set_html(element, value) {
        return nodelistp(element)?  map_nodes(element, mapper)
             : sequencep(element)?  map(element, mapper)
             : /* Element? */       set(element, value)

        function mapper(e){ return set_html(e, value) }
        function set(e, v){ e.innerHTML = v; return e }
    }

    /// Function attr //////////////////////////////////////////////////////////
    //
    // :: Element, String → String
    // :: [Element], String → [String]
    //
    // Returns the value of a given attribute in one or more Elements.
    //
    function attr(element, key) {
        return sequencep(element)?  map(element, mapper)
             : /* Element? */       element.getAttribute(key)

        function mapper(e){ return attr(e, key) }
    }

    /// Function set_attr //////////////////////////////////////////////////////
    //
    // :: Element, String, String → Element
    // :: [Element], String, String → [Element]
    //
    // Sets the value of a given attribute in one or more Elements.
    //
    function set_attr(element, key, value) {
        return nodelistp(element)?  map_nodes(element, mapper)
             : sequencep(element)?  map(element, mapper)
             : value == null?       remove(element, key)
             : /* Element? */       set(element, key, value)

        function mapper(e)   { return set_attr(e, key, value) }
        function remove(e, k){ e.removeAttribute(k); return e }
        function set(e, k, v){ e.setAttribute(k, v); return e }
    }

    /// Function data //////////////////////////////////////////////////////////
    //
    // :: Element, String → Element
    // :: [Element], String → [Element]
    //
    // Returns the value of a data-attribute in one or more Elements.
    //
    function data(element, name) {
        return attr(element, 'data-' + name)
    }

    /// Function set_data //////////////////////////////////////////////////////
    //
    // :: Element, String, String → Element
    // :: [Element], String, String → [Element]
    //
    // Sets the value of a data-attribute in one or more Elements.
    //
    function set_data(element, name, value){
        return set_attr(element, 'data-' + name, value)
    }



    //// Exports ///////////////////////////////////////////////////////////////
    if (typeof exports == 'undefined') {
        __old = root.moros
        moros = root.moros = {}

        //// Method make_local /////////////////////////////////////////////////
        moros.make_local = function() {
            root.moros = __old
            return moros }}
    else
        moros = exports

    //// -Properties under moros ///////////////////////////////////////////////
    moros.html     = html
    moros.set_html = set_html
    moros.text     = text
    moros.set_text = set_text
    moros.attr     = attr
    moros.set_attr = set_attr
    moros.data     = data
    moros.set_data = set_data

}(this)
