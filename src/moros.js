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
      , __each  = [].forEach
      , __class = {}.toString


    /// -Feature testing ///////////////////////////////////////////////////////
    var TEXT
    void function(){ var elm
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

    /// -Utilities /////////////////////////////////////////////////////////////
    //// Function nodelistp ////////////////////////////////////////////////////
    //
    // NodeList :: Object → Boolean
    //
    // Tests if an object looks like a NodeList.
    //
    function nodelistp(object) {
        return object != null
            && typeof object.length == 'number'
            && typeof object.item   == 'function'
    }

    //// Function sequencep ////////////////////////////////////////////////////
    //
    // Sequence :: Object → Boolean
    //
    // Tests if something looks like a sequence.
    //
    function sequencep(object) {
        return object != null
            && typeof object.length == 'number'
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

    //// Function each /////////////////////////////////////////////////////////
    //
    // :: Sequence, Iterator, Object → Array
    //
    // Calls the iterator function in every element in the sequence.
    //
    function each(seq, mapper, context) {
        return __each.call(seq, mapper, context)
    }



    /// -DOM representation and meta handling //////////////////////////////////

    //// Function text /////////////////////////////////////////////////////////
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

    //// Function set_text /////////////////////////////////////////////////////
    //
    // :: Element, String → Element
    // :: NodeList, String → NodeList
    // :: [Element], String → [Element]
    //
    // Replaces the textContent of one or more Elements by the provided value.
    //
    function set_text(element, value) {
        return nodelistp(element)?  nl_set_text()
             : sequencep(element)?  map(element, mapper)
             : /* Element? */       set(element, value)

        function mapper(e){ return set_text(e, value) }
        function set   (e){ e[TEXT] = value; return e }

        function nl_set_text() { var i
            i = element.length
            while (i--)  element[i][TEXT] = value
            return element }
    }

    //// Function html /////////////////////////////////////////////////////////
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

    //// Function set_html /////////////////////////////////////////////////////
    //
    // :: Element, String → Element
    // :: NodeList, String → NodeList
    // :: [Element], String → [Element]
    //
    // Sets the HTML contents of one or more Elements, the internal DOM
    // parsing engine will create the appropriate DOM objects from this
    // serialised representation.
    //
    function set_html(element, value) {
        return nodelistp(element)?  nl_set_html()
             : sequencep(element)?  map(element, mapper)
             : /* Element? */       set(element, value)

        function mapper(e){ return set_html(e, value)     }
        function set   (e){ e.innerHTML = value; return e }

        function nl_set_html() { var i
            i = element.length
            while(i--)  element[i].innerHTML = value
            return element }
    }

    //// Function attr /////////////////////////////////////////////////////////
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

    //// Function set_attr /////////////////////////////////////////////////////
    //
    // :: Element, String, String → Element
    // :: NodeList, String, String → NodeList
    // :: [Element], String, String → [Element]
    //
    // Sets the value of a given attribute in one or more Elements.
    //
    // If the value is nil, remove the attribute instead.
    //
    function set_attr(element, key, value) {
        return nodelistp(element)?  nl_set_attr()
             : sequencep(element)?  map(element, mapper)
             : value == null?       remove(element, key)
             : /* Element? */       set(element, key, value)

        function mapper(e){ return set_attr(e, key, value)       }
        function remove(e){ e.removeAttribute(key);     return e }
        function set(e)   { e.setAttribute(key, value); return e }

        function nl_set_attr() { var index
            index = element.length
            while (index--)
                if (value == null)  element[index].removeAttribute(key)
                else                element[index].setAttribute(key, value)
            return element }
    }

    //// Function data /////////////////////////////////////////////////////////
    //
    // :: Element, String → Element
    // :: [Element], String → [Element]
    //
    // Returns the value of a data-attribute in one or more Elements.
    //
    function data(element, name) {
        return attr(element, 'data-' + name)
    }

    //// Function set_data /////////////////////////////////////////////////////
    //
    // :: Element, String, String → Element
    // :: NodeList, String, String → NodeList
    // :: [Element], String, String → [Element]
    //
    // Sets the value of a data-attribute in one or more Elements.
    //
    function set_data(element, name, value){
        return set_attr(element, 'data-' + name, value)
    }


    /// -DOM tree manipulation /////////////////////////////////////////////////

    //// Function detach ///////////////////////////////////////////////////////
    //
    // :: Element → Element
    // :: [Element] → Element
    //
    // Removes one or more elements from the DOM.
    //
    function detach(element) {
        return nodelistp(element)?  nl_detach()
             : sequencep(element)?  map(element, detach)
             : /* Element? */       do_detach(element)

        function do_detach(e){ e.parentNode.removeChild(e); return e }

        function nl_detach() { var i
            i = element.length
            while (i--)  element[i].parentNode.removeChild(element[i])
            return element }
    }

    //// Function insert_before ////////////////////////////////////////////////
    //
    // :: Element, Element → Element
    // :: Element, [Element] → Element
    //
    // Inserts elements before another element.
    //
    function insert_before(node, elements) {
        ( nodelistp(elements)?  nl_insert_before()
        : sequencep(elements)?  each(elements, insert_element)
        : /* Element? */        do_insert(elements, node)
        )
        return node

        function insert_element(e){ return insert_before(node, e)             }
        function do_insert(e, n)  { n.parentNode.insertBefore(e, n); return n }

        function nl_insert_before() { var i, len, parent
            parent = node.parentNode
            for (i = 0, len = elements.length; i < len; ++i)
                parent.insertBefore(elements[i], node)
            return node }
    }

    //// Function insert_after /////////////////////////////////////////////////
    //
    // :: Element, Element → Element
    // :: Element, [Element] → Element
    //
    // Inserts elements after another element.
    //
    function insert_after(node, elements) {
        ( nodelistp(elements)?  nl_insert_after()
        : sequencep(elements)?  each(elements, do_insert)
        : /* Element? */        do_insert(elements)
        )
        return node

        function do_insert(e){
            node.parentNode.insertBefore(e, node.nextSibling);
            return node }

        function nl_insert_after() { var i, parent, place
            i      = elements.length
            parent = node.parentNode
            place  = node.nextSibling
            while (i--)  parent.insertBefore(elements[i], place)
            return node }
    }

    //// Function append ///////////////////////////////////////////////////////
    //
    // :: Element, Element → Element
    // :: Element, [Element] → Element
    //
    // Appends one or more elements to a single parent.
    //
    function append(parent, childs) {
        ( nodelistp(childs)?  nl_append()
        : sequencep(childs)?  each(childs, append_child)
        : /* Element? */      parent.appendChild(childs)
        )
        return parent

        function append_child(child){ append(parent, child) }

        function nl_append() { var i, len
            for (i = 0, len = childs.length; i < len; ++i)
                parent.appendChild(childs[i])
            return parent }
    }

    //// Function prepend //////////////////////////////////////////////////////
    //
    // :: Element, Element → Element
    // :: Element, [Element] → Element
    //
    // Prepends one or more elements to a single parent.
    //
    function prepend(parent, childs) {
        return insert_before(parent.firstChild, childs)
    }

    //// Function replace //////////////////////////////////////////////////////
    //
    // :: Element, Element → Element
    // :: Element, [Element] → Element
    //
    // Replaces a single node by one or more Elements.
    //
    function replace(element, replacement) {
        ( sequencep(replacement)?  replace_childs(element, replacement)
        : /* Element? */           do_replace(element, replacement)
        )
        return element

        function do_replace(e, r) { e.parentNode.replaceChild(e, r); return e }

        function replace_childs() {
            prepend(element.parentNode, element)
            detach(element) }
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
    moros.internals = { nodelistp: nodelistp
                      , sequencep: sequencep
                      }

    // DOM representation and meta information handling
    moros.html     = html
    moros.set_html = set_html
    moros.text     = text
    moros.set_text = set_text
    moros.attr     = attr
    moros.set_attr = set_attr
    moros.data     = data
    moros.set_data = set_data

    // DOM tree manipulation
    moros.detach        = detach
    moros.insert_before = insert_before
    moros.insert_after  = insert_after
    moros.append        = append
    moros.prepend       = prepend
    moros.replace       = replace

}(this)
