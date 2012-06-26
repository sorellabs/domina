(global ? window) <<< Describe: describe, It: it

original = document.get-element-by-id \xs

window.require = require
window.moros =
  reset-dom: ->
    prev = document.get-element-by-id \xs
    if prev => prev.parent-node.remove-child prev

    actual = original.clone-node true
    document.document-element.append-child actual

  elements: (xs) ->
    [].filter.call xs, -> \tagName of it

  get: (id) ->
    document.get-element-by-id id

  children: (x) ->
    moros.elements x.child-nodes



require \./utils
require \./query
require \./event
require \./manipulation
require \./reflection
require \./presentation