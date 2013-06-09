g    = require '../generators'
spec = (require 'brofist')!
{same-collection} = require '../operators'
{for-all}:claire = require 'claire'


$ = require '../../lib/folding'
id = (a) -> a
is-text-node = (a) -> a.nodeType is 3
flatten = (xs) -> xs.reduce ((a, b) -> a.concat b), []

module.exports = spec '{} Folding' (it, spec) ->
  spec 'each()' ->
    it 'Should apply a function to each item in the list.' do
      for-all(g.NodeList) .satisfy (xs) ->
        c = 0
        $.each (-> ++c), xs
        c === xs.length
      .as-test!

    it 'Should return the original list.' do
      for-all(g.NodeList) .satisfy (xs) ->
        ($.each id, xs) === xs
      .as-test!

  spec 'map()' ->
    it 'Should transform each item by the transformation function.' do
      for-all(g.NodeList) .satisfy (xs) ->
        same-collection ($.map (.nodeType), xs), [x.nodeType for x in xs]
      .as-test!

    it 'Given identity, should return the same list.' do
      for-all(g.NodeList) .satisfy (xs) ->
        same-collection ($.map id, xs), xs
      .as-test!

  spec 'reduce()' ->
    it 'Should fold a list with a binary function.' do
      for-all(g.NodeList) .satisfy (xs) ->
        ($.reduce (+ 1), 0, xs) === xs.length
      .as-test!

  spec 'filter()' ->
    it 'Should keep only items that pass the predicate.' do
      for-all(g.NodeList) .satisfy (xs) ->
        same-collection do
          * $.filter is-text-node, xs
          * [x for x in xs | is-text-node x]
      .as-test!

  spec 'mapConcat()' ->
    it 'map followed by flatten.' do
      for-all(g.NodeList) .satisfy (xs) ->
        same-collection do
          * $.map-concat ((a) -> [a, a]), xs
          * flatten ($.map ((a) -> [a, a]), xs)
      .as-test!

  spec 'concat()' ->
    it 'Should concatenate all collections.' do
      for-all(g.NodeArray, g.NodeArray) .satisfy (xs, ys) ->
        same-collection do
          * $.concat xs, ys
          * xs.concat(ys)
      .as-test!
