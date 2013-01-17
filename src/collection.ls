### collection.ls --- Generic collection handling for DOM
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

### Module moros.collection


#### -- Helpers --------------------------------------------------------

##### Function to-array
#
# Converts a Collection to an Array. Only exists to guard on
# sequence-like host objects in engines like JScript.
#
# to-array :: Coll a -> Array a
to-array = (xs) -> [x for x in xs]


##### Function collection-p
#
# Checks if something is a Collection.
#
# collection-p :: a -> Bool
collection-p = (a) ->
  a && (not 'nodeType' of a) \
    && a.length >= 0




#### -- Core implementation --------------------------------------------

##### Function head
#
# Returns the first item of a collection.
#
# head :: Coll a -> Maybe a
head = (xs) -> xs.0


##### Function tail
#
# Returns a new collection without the first item.
#
# tail :: Coll a -> Coll a
tail = (xs) -> [x for x, i in xs when i > 0]


##### Function last
#
# Returns the last item of a collection.
#
# last :: Coll a -> Maybe a
last = (xs) -> xs[*-1]


##### Function as-collection
#
# Turns anything into a collection.
#
# as-collection :: a -> Coll a
# as-collection :: Coll a -> Coll a
as-collection = (x) ->
  | collection-p x => x
  | otherwise      => [x]


##### Function each
#
# Applies a function to each item in the Collection.
#
# each :: (a -> IO ()) -> xs:Coll a* -> xs
each = (f, xs) -->
  ys = as-collection xs
  for x, i in ys => f x
  ys


##### Function map
#
# Transforms a Collection by applying the given function to each item.
#
# map :: (a -> b) -> Coll a -> Coll b
map = (f, xs) --> [(f x) for x in (as-collection xs)]


##### Function reduce
#
# Computes a value by incrementally reducing a collection with a binary
# function.
#
# reduce :: (b, a -> b) -> b -> Coll a -> b
reduce = (f, initial, xs) -->
  result = initial
  for x in xs => result = (f result, x)
  result


##### Function concat
#
# Concatenates several collections together.
#
# concat :: Coll a... -> Coll a
concat = (xs...) ->
  append = (ys, a) ->
    ys.push.apply ys, a
    ys
  reduce append, [], xs


##### Function map-concat
#
# Maps over a collection concatenating the resulting collections.
#
# map-concat :: (a -> [b]) -> Coll a -> [b]
map-concat = (f, xs) -->
  flat-transform = (ys, a) ->
    ys.push.apply ys, (f a)
    ys

  reduce flat-transform, [], xs




#### -- Exports --------------------------------------------------------
module.exports = {
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