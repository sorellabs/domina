# # Module folding
#
# Folders for Collections.
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

# -- Core implementation -----------------------------------------------

# ### each()
#
# Applies a function to each item in the collection.
#
# :: (a -> ()) -> Coll a -> Coll a
each = (f, xs) -->
  for x, i in xs => f x
  xs


# ### map()
#
# Transforms a Collection by applying the given function to each item.
#
# :: (a -> b) -> Coll a -> Coll b
map = (f, xs) --> [(f x) for x in xs]


# ### reduce()
#
# Computes a value by incrementally reducing a collection with a
# binary function
#
# :: (a, b -> b) -> b -> Coll a -> b
reduce = (f, initial, xs) -->
  result = initial
  for x in xs => result = (f result, x)
  result


# ### filter()
#
# Keeps only values that pass the predicate.
#
# :: (a -> Bool) -> Coll a -> Coll a
filter = (f, xs) --> [x for x in xs | f x]


# ### map-concat()
#
# Maps over a collection concatenating the resulting collections.
#
# :: (a -> [b]) -> Coll a -> [b]
map-concat = (f, xs) -->
  flat-transform = (ys, a) ->
    ys.push.apply ys, (f a)
    ys

  reduce flat-transform, [], xs


# ### concat()
#
# Concatenates several collections together.
#
# :: Coll a... -> Coll a
concat = (...xs) -> map-concat (-> it), xs


# -- Exports -----------------------------------------------------------
module.exports = {
  map
  each
  reduce
  filter
  concat
  map-concat
}
