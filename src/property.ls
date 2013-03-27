## Module property #####################################################
#
# Manipulates and retrieves properties of DOOM nodes.
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


### -- Dependencies ----------------------------------------------------
{head, each, map, to-array} = require './collection'


### -- Feature detection -----------------------------------------------
TEXT = let e = document.createElement \div
       switch
       | 'innerText' of e  => 'innerText'
       | otherwise         => 'textContent'


### -- Core implementation ---------------------------------------------

#### λ attributes
# Returns a list of Attributes set in the given nodes.
#
# :: [Node] -> [[Attribute]]
attributes = map ->
  to-array it.attributes


#### λ attribute
# Returns the value of the given attribute for each given node.
#
# :: String -> [Node] -> [Maybe String]
attribute = (name, xs) --> xs |> map ->
  it.get-attribute name


#### λ attribute1
# Returns the value of the given attribute for the first node.
#
# :: String -> [Node] -> Maybe String
attribute1 = (name, node) --> (head node).get-attribute name


#### λ set-attribute
# Gives the attribute a new value on each one of the given nodes.
#
# Passing a `Nil` value as the attribute's value will remove the
# attribute from the Node.
#
# :: String -> Maybe String -> xs:[Node*] -> xs
set-attribute = (name, value, xs) --> xs |> each ->
  | value === null => it.remove-attribute name
  | otherwise      => it.set-attribute name, value


#### λ text
# Returns the plain text representation of each Node's sub-tree.
#
# :: [Node] -> [String]
text = map -> it[TEXT]


#### λ text1
# Returns the plain text representation of the first Node's sub-tree.
#
# :: [Node] -> String
text1 = (node) -> (head node)[TEXT]


#### λ set-text
# Constructs a new sub-tree from a textual representation for each given
# node.
#
# The sub-tree will contain only a single Text node.
#
# :: String -> xs:[Node*] -> xs
set-text = (value, xs) --> xs |> each ->
  it[TEXT] = value


#### λ html
# Returns the HTML representation of each given Node's sub-tree.
#
# In short, this serialises the Node's children and returns such
# serialisation. Event listeners registered through `addEventListener`
# are, obviously, not serialised.
#
# :: [Node] -> [String]
html = map -> it.inner-HTML


#### λ html1
# Returns the HTML representation of the first Node's sub-tree.
#
# ## See also:
# - `html`
#
# :: [Node] -> String
html1 = (node) -> (head node).inner-HTML


#### λ set-html
# Constructs a new sub-tree from an HTML representation.
#
# While constructing sub-trees out of HTML is *fast*, it has its
# quirks. Make sure you're aware of them.
#
# :: String -> xs:[Node*] -> xs
set-html = (value, xs) --> xs |> each ->
  it.inner-HTML = value



### -- Exports ---------------------------------------------------------
module.exports = {
  attributes
  attribute
  attribute1
  set-attribute
  text
  text1
  set-text
  html
  html1
  set-html
}
