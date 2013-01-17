### query.ls --- Selects a Collection of Nodes using CSS selectors
#
# Copyright (c) 2013 The Orphoundation
#
# Permission is hereby granted, free of charge, to any person
# obtaining a copy of this software and associated documentation files
# (the "Software"), to deal in the Software without restriction,
# including without limitation the rights to use, copy, modify, merge,
# publish, distribute, sublicense, and/or sell copies of the Software,
# and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


### Module moros.query
module.exports = (engine) ->

  #### -- Dependencies -------------------------------------------------
  {head, to-array}   = require './collection'


  #### -- Helpers ------------------------------------------------------

  # Test which implementation of ``matchesSelector`` is available, so we
  # can just keep using it everytime without paying for the additional
  # checks :3
  internal-matches-p = let el = document.create-element 'div'
                       return el.matches-selector        \
                           || el.o-matches-selector      \
                           || el.ms-matches-selector     \
                           || el.moz-matches-selector    \
                           || el.webkit-matches-selector \


  
  #### -- Core implementation ------------------------------------------

  ##### Function query
  #
  # Returns a set of nodes that match the given CSS selector.
  #
  # Optionally, this function can restrict the returned set of elements
  # to a given ``context``, such that only nodes that are children of
  # such ``context`` will be returned.
  #
  # query :: Selector, Element? -> Coll Element
  query = (selector, context = document) ->
    to-array (context.query-selector-all selector)


  ##### Function matches
  #
  # Checks if an Element matches the given CSS selector.
  #
  # matches :: Selector -> Element -> Bool
  matches-p = (selector, node) -->
    internal-matches-p.call node, selector


  
  #### -- Exports ------------------------------------------------------

  if engine     # A custom selector engine was provided
    query     : engine.query-selector-all or query
    matches-p : engine.matches-selector or matches-p

  else          # Otherwise uses the available DOM selection methods
    { query, matches-p }