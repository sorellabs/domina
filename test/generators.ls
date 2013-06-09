# Should be moved into a proper module later on
claire = require 'claire'

# HTML elements (some deprecated/non-standard)
# From: https://developer.mozilla.org/en-US/docs/Web/HTML/Element
tags = <[ a abbr acronym address applet area article aside audio b base
          basefont bdi bdo bgsound big blink blockquote body br button
          canvas caption center cite code col colgroup command
          data datalist dd del details dfn dir div dl dt
          em embed fieldset figcaption figure font footer form frame
          frameset h1 h2 h3 h4 h5 h6 head header hgroup hr html i
          iframe img input ins isindex kbd keygen label legend li link
          listing main map mark marquee menu meta meter nav nobr
          noframes noscript object ol optgroup option output p param
          plaintext pre progress q rp rt ruby s samp script section
          select small source spacer span strike strong style sub
          summary sup table tbody td textarea tfoot th thead time title
          tr track tt u ul var video wbr xmp ]>

# Makes a node list
to-node-list = (xs) ->
  fragment = document.create-document-fragment!
  xs.for-each (x) -> fragment.append-child x
  fragment.child-nodes
          
# Picks an array item at random
choose-int = (a, b) -> Math.floor ((Math.random! * (b - a)) + a)
pick-one   = (xs) -> xs[choose-int 0, xs.length]
          
# Generates DOM elements
SmallStr  = claire.sized (-> 10), claire.data.Str
Text      = claire.transform (-> document.create-text-node it), SmallStr
Element   = claire.as-generator -> document.create-element (pick-one tags)
Node      = claire.choice Text, Element
NodeArray = claire.data.Array Node
NodeList  = claire.transform to-node-list, NodeArray

# Exports
module.exports = {
  Text
  Element
  Node
  NodeArray
  NodeList
}
