# # Module collection
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

# -- Helpers -----------------------------------------------------------

# ### Function is-collection
#
# Checks if something can be treated as a collection.
#
# :: a -> Bool
is-collection = (a) ->
  a && (not ('nodeType' in a)) \
    && a.length >= 0


# -- Core implementation -----------------------------------------------

# ### Function head
#
# Returns the first item of a collection.
#
# :: Coll a -> Maybe a
head = (xs) -> (as-collection xs).0


# ### Function tail
# 
# Returns the rest of the items in a collection.
#
# :: Coll a -> Coll a
tail = (xs) -> 
  result = new Array (xs.length - 1)
  for x, i in (as-collection xs) when i > 0
    result[i-1] = xs[i]
  result


# ### Function last
#
# Returns the last item in a collection.
#
# :: Coll a -> Maybe a
last = (xs) -> (as-collection xs)[*-1]


# ### Function as-collection
#
# Turns anything into a collection.
#
# :: a -> Coll a
# :: NodeList a -> Coll a
# :: [a] -> Coll a
as-collection = (xs) ->
  | is-collection xs => xs
  | otherwise        => [xs]



# -- Exports -----------------------------------------------------------
module.exports = {
  head
  tail
  last
  as-collection
}
