(global ? window) <<< Describe: describe, It: it

original = document.get-element-by-id \xs

window.require = require
window.moros-reset-dom = ->
  prev   = document.get-element-by-id \xs
  if prev => prev.parent-node.remove-child prev

  actual = original.clone-node true
  document.document-element.append-child actual


require \./utils
require \./query
require \./event
require \./manipulation