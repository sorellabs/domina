/** reflection.ls --- Provides information about nodes.
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


## Module moros.reflection #############################################

### == Dependencies ====================================================
{each, map, to-array} = require \./utils


### == Feature detection ===============================================
TEXT = let e = document.createElement \div
       switch
       | 'innerText' of e  => 'innerText'
       | otherwise         => 'textContent'


### == Core implementation =============================================

#### Function attributes
# Returns a list of Attributes set in the given nodes.
#
# attributes :: [Node] -> [[Attribute]]
attributes = map ->
  to-array it.attributes


#### Function attribute
# Returns the value of the given attribute for each given node.
#
# attribute :: String -> [Node] -> [Maybe String]
attribute = (name) -> map ->
  it.get-attribute name


#### Function set-attribute
# Gives the attribute a new value on each one of the given nodes.
#
# Passing a ``Nil`` value as the attribute's value will remove the
# attribute from the Node.
#
# set-attribute! :: String -> Maybe String -> xs:[Node*] -> xs
set-attribute(name, value) = each ->
  | value === null => it.remove-attribute name
  | otherwise      => it.set-attribute name, value


#### Function text
# Returns the plain text representation of each Node's sub-tree.
#
# text :: [Node] -> [String]
text = map ->
  it[TEXT]


#### Function set-text
# Constructs a new sub-tree from a textual representation for each given
# node.
#
# The sub-tree will contain only a single Text node.
#
# set-text! :: String -> xs:[Node*] -> xs
set-text = (value) -> each ->
  it[TEXT] = value


#### Function html
# Returns the HTML representation of each given Node's sub-tree.
#
# In short, this serialises the Node's children and returns such
# serialisation. Event listeners registered through ``addEventListener``
# are, obviously, not serialised.
#
# html :: [Node] -> [String]
html = map ->
  it.innerHTML


#### Function set-html
# Constructs a new sub-tree from an HTML representation.
#
# While constructing sub-trees out of HTML is *fast*, it has its
# quirks. Make sure you're aware of them.
#
# set-html! :: String -> xs:[Node*] -> xs
set-html = (value) -> each ->
  it.innerHTML = value



### Exports ############################################################
module.exports = {
  attributes
  attribute
  set-attribute
  text
  set-text
  html
  set-html
}