## Module collection
#
# Generic collection handling for DOM.
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



### -- Helpers ---------------------------------------------------------

#### λ to-array
#
# Converts a Collection to an Array. Only exists to guard on
# sequence-like host objects in engines like JScript.
#
# :: Coll a -> Array a
to-array = (xs) -> [x for x in xs]


#### λ is-collection
#
# Checks if something is a Collection.
#
# :: a -> Bool
is-collection = (a) ->
  a && (not a.node-type) \
    && a.length >= 0




### -- Accessing elements ----------------------------------------------

#### λ head
#
# Returns the first item of a collection.
#
# :: Coll a -> Maybe a
head = (xs) -> (as-collection xs).0


#### λ tail
#
# Returns a new collection without the first item.
#
# :: Coll a -> Coll a
tail = (xs) -> [x for x, i in (as-collection xs) when i > 0]


#### λ last
#
# Returns the last item of a collection.
#
# :: Coll a -> Maybe a
last = (xs) -> (as-collection xs)[*-1]



### -- Conversions -----------------------------------------------------

#### λ as-collection
#
# Turns anything into a collection.
#
# :: a -> Coll a
# :: Coll a -> Coll a
as-collection = (x) ->
  | is-collection x => x
  | otherwise       => [x]



### -- Iterators and folds ---------------------------------------------

#### λ each
#
# Applies a function to each item in the Collection.
#
# :: (a -> IO ()) -> xs:Coll a* -> xs
each = (f, xs) -->
  ys = as-collection xs
  for x, i in ys => f x
  ys


#### λ map
#
# Transforms a Collection by applying the given function to each item.
#
# :: (a -> b) -> Coll a -> Coll b
map = (f, xs) --> [(f x) for x in (as-collection xs)]


#### λ reduce
#
# Computes a value by incrementally reducing a collection with a binary
# function.
#
# :: (b, a -> b) -> b -> Coll a -> b
reduce = (f, initial, xs) -->
  result = initial
  for x in (as-collection xs) => result = (f result, x)
  result


#### λ concat
#
# Concatenates several collections together.
#
# :: Coll a... -> Coll a
concat = (...xs) ->
  append = (ys, a) ->
    ys.push.apply ys, a
    ys

  reduce append, [], (as-collection xs)


#### λ map-concat
#
# Maps over a collection concatenating the resulting collections.
#
# :: (a -> [b]) -> Coll a -> [b]
map-concat = (f, xs) -->
  flat-transform = (ys, a) ->
    ys.push.apply ys, (f a)
    ys

  reduce flat-transform, [], (as-collection xs)




### -- Exports ---------------------------------------------------------
module.exports = {
  to-array
  head
  tail
  last
  as-collection
  map
  each
  reduce
  concat
  map-concat
}
