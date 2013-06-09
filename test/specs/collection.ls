g         = require '../generators'
spec      = (require 'brofist')!
{for-all} = require 'claire'
{same-collection} = require '../operators'

$ = require '../../lib/collection'


module.exports = spec '{} Collection' (it, spec) ->
  spec 'asCollection()' ->
    it 'Given a Node, should return the Node.' do
       for-all(g.Node) .satisfy (x) ->
         ($.asCollection x).0 === x
       .as-test!

    it 'Given an Array, should return the first item.' do
      for-all(g.NodeArray) .satisfy (xs) ->
        same-collection ($.asCollection xs), xs
      .classify (xs) ->
        | xs.length == 0 => 'Empty'
        | xs.length == 1 => 'Trivial'
        | otherwise      => '> 1'
      .as-test!

    it 'Given a NodeList, should return the first item.' do
      for-all(g.NodeList) .satisfy (xs) ->
        same-collection ($.asCollection xs), xs
      .classify (xs) ->
        | xs.length == 0 => 'Empty'
        | xs.length == 1 => 'Trivial'
        | otherwise      => '> 1'
      .as-test!
       
  spec 'head()' ->
    it 'Given a list of nodes, should return the first.' do
      for-all(g.NodeList) .satisfy (xs) ->
        ($.head ($.asCollection xs)) === xs[0]
      .as-test!

  spec 'tail()' ->
    it 'Given a list of nodes, should return all but the first.' do
      for-all(g.NodeArray) .satisfy (xs) ->
        ($.tail ($.asCollection xs)) === xs.slice(1)
      .as-test!

  spec 'last()' ->
    it 'Given a list of nodes, should return the last one.' do
      for-all(g.NodeList) .satisfy (xs) ->
        ($.last ($.asCollection xs)) === xs[*-1]
      .as-test!
