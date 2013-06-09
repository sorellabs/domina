g         = require '../generators'
spec      = (require 'brofist')!
{for-all} = require 'claire'

$ = require '../../lib/collection'


module.exports = spec '{} Collection' (it, spec) ->
  spec 'head()' ->
    it 'Given a Node, should return the Node.' do
       for-all(g.Node) .satisfy (x) ->
         ($.head x) is x
       .as-test!

    it 'Given an Array, should return the first item.' do
      for-all(g.NodeArray) .satisfy (xs) ->
        ($.head xs) is xs[0]
      .as-test!

    it 'Given a NodeList, should return the first item.' do
      for-all(g.NodeList) .satisfy (xs) ->
        ($.head xs) is xs[0]
      .as-test!
       
      
