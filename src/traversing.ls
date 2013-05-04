## Module traversing ###################################################
#
# Helpers for traversing `Collections` of DOM trees.
#
# 
# Copyright (c) 2013 Quildreen "Sorella" Motta <quildreen@gmail.com>
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

# :: SelectorEngine -> Module traversing
module.exports = (engine) ->

  {query, matches} = (require './query') engine
  {map, concat, map-concat} = require './collection'


  
  ### -- Helpers -------------------------------------------------------

  #### λ next-sibling
  #
  # Returns the next Element sibling for a given Element.
  #
  # :: Element -> Maybe Element
  next-sibling = (x) -> x.next-element-sibling or x.next-sibling

  #### λ previous-sibling
  #
  # Returns the previous Element sibling for a given Element.
  #
  # :: Element -> Maybe Element
  previous-sibling = (x) -> x.previous-element-sibling or x.previous-sibling


  #### λ first-stepping-with
  #
  # Retrieves the first Element that matches the selector, stepping
  # through the tree using the given Stepper function.
  #
  # :: (a -> a) -> Selector -> Element -> Maybe Element
  first-stepping-with = (stepper, selector, x) -->
    do
      if x => x := stepper x
    until x && (matches selector, x)
    x

  #### λ collect-stepping-with
  #
  # Retrieves a collection of Elements that matches the selector, while
  # stepping through the tree using the given Stepper function.
  #
  # :: (a -> a) -> Selector -> Element -> [Element]
  collect-stepping-with = (stepper, selector, x) -->
    while x
      if x && (matches selector, x)
        y = x
        x := stepper x
        y


  #### λ next-sibling-matching
  #
  # Returns the next sibling that matches the given Selector.
  #
  # :: Selector -> Element -> Maybe Element
  next-sibling-matching = first-stepping-with next-sibling


  #### λ previous-sibling-matching
  #
  # Returns the previous sibling that matches the given Selector.
  #
  # :: Selector -> Element -> Maybe Element
  previous-sibling-matching = first-stepping-with previous-sibling


  #### λ parent
  #
  # Returns the most immediate parent that matches the given Selector.
  #
  # :: Selector -> Element -> Maybe Element
  parent-matching = first-stepping-with (.parent-node)


  #### λ all-parents-matching
  #
  # Returns a collection of all parents that match the given Selector.
  #
  # :: Selector -> Element -> [Element]
  all-parents-matching = collect-stepping-with (.parent-node)



  
  ### -- Core implementation -------------------------------------------

  #### λ next
  #
  # Retrieves the next sibling of each element that matches the given
  # Selector.
  #
  # :: Selector -> Coll a -> Coll (Maybe a)
  next = (selector, xs) -->
    xs |> map (next-sibling-matching selector)


  #### λ previous
  #
  # Retrieves the previous sibling of each element that matches the
  # given Selector.
  #
  # previous :: Selector -> Coll a -> Coll (Maybe a)
  previous = (selector, xs) -->
    xs |> map (previous-sibling-matching selector)


  #### λ siblings
  #
  # Retrieves all siblings of each element that match the given
  # Selector.
  #
  # :: Selector -> Coll a -> Coll (Maybe a)
  siblings = (selector, xs) -->
    concat (next selector, xs), (previous selector, xs)


  #### λ parent
  #
  # Retrieves the immediate parent of each element that matches the
  # given Selector.
  #
  # :: Selector -> Coll a -> Coll (Maybe a)
  parent = (selector, xs) -->
    xs |> map (parent-matching selector)


  #### λ parents
  #
  # Retrieves all parents of each element that matches the given
  # Selector.
  #
  # :: Selector -> Coll a -> Coll a
  parents = (selector, xs) -->
    xs |> map-concat (all-parents-matching selector)


  #### λ children
  #
  # Retrieves all children of each element that matches the given
  # Selector.
  #
  # :: Selector -> Coll a -> Coll a
  children = (selector, xs) -->
    xs |> map-concat (-> query selector, it)


  
  ### -- Exports -------------------------------------------------------
  { next, previous, siblings, parent, parents, children }
