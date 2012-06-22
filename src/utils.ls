/** utils.ls --- Shared utilities
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


## Module moros.utils ##################################################


### == Core implementation =============================================

#### Function id
# Lambda calculus' Identity combinator.
#
# id :: a -> a
id = (x) -> x


#### Function k
# Lambda calculus' Constant combinator.
#
# k :: a -> b -> a
k = (x) -> -> x


#### Function head
# Returns the first item of a list.
#
# head :: [a] -> Maybe a
head = (xs) -> xs[0]


#### Function tail
# Returns a new list without the first item.
#
# tail :: [a] -> [a]
tail = (xs) -> xs.slice 1


#### Function sequence-p
# Does something match the Sequence interface?
#
# sequence? :: a -> Bool
sequence-p = (x) ->
  x && \length of x


#### Function sequence
# Casts something to a Sequence interface.
#
# as-sequence :: [a] -> [a]
# as-sequence :: a -> [a]
as-sequence = (x) ->
  | sequence-p x  => x
  | otherwise     => [x]


#### Function to-array
# Casts a Sequence into an Array.
#
# to-array :: [a] -> Array a
to-array = Function.call.bind [].slice


#### Function each
# Invokes a iteratee for each item in the sequence.
#
# each :: (a -> ()) -> xs:[a] -> xs
each(f, xs) =
  xs = as-sequence xs
  f  = f || id
  for x, i in xs
    f x
  xs


#### Function map
# Returns a new list, where each item is transformed by the given
# functor.
#
# map :: (a -> b) -> [a] -> [b]
map(f, xs) =
  xs = as-sequence xs
  f  = f || id
  [(f x) for x in xs]



#### Exports ###########################################################
module.exports =
  as-sequence : as-sequence
  to-array    : to-array
  head        : head
  tail        : tail
  id          : id
  k           : k
  each        : each
  map         : map