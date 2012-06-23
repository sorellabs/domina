/** query.ls --- Selects a set of nodes using CSS selectors
 *
 * Version: -:version:-
 *
 * Copyright (c) 2012 Quildreen Motta
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


## Module moros.query ##################################################
module.exports = (engine) ->

  ### == Dependencies ==================================================
  {head}   = require \./util


  
  ### == Aliases =======================================================
  to-array = Function.call.bind [].slice


  
  ### == Core implementation ===========================================

  #### Function query
  # Returns a set of nodes that match the given CSS selector.
  #
  # Optionally, this function can restrict the returned set of elements
  # to a given ``context``, such that only nodes that are children of
  # such ``context`` will be returned.
  #
  # query :: Selector, Element? -> [Element]
  query = (selector, context = document) ->
    to-array context.querySelectorAll selector


  #### Function query-one
  # Returns the first node that matches the given CSS selector.
  #
  # Optionally, this function can restrict the returned set of elements
  # to a given ``context``, such that only nodes that are children of
  # such ``context`` will be returned.
  #
  # query-one :: Selector, Element? -> Maybe Element
  query-one = (selector, context = document) ->
    to-array context.querySelector selector


  
  ### Exports ##########################################################

  if engine     # A custom selector engine was provided
    query     : engine
    query-one : (selector, context) -> head (engine selector, context)

  else          # Otherwise uses the available DOM selection methods
    { query, query-one }