/** manipulation.ls --- Manipulates DOOM trees
 *
 * Version: -:package.version:-
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


## Module moros.manipulation ###########################################

### == Dependencies ====================================================
{map, each, head, tail} = require \./utils



### == Core implementation =============================================

#### Function append
# Adds one or more nodes as a the last children of a parent node.
#
# append! :: Node* -> xs:[Node*] -> xs
append(parent, xs) = xs |> each ->
  it.append-child node


#### Function prepend
# Adds one or more nodes as the first children of a parent node.
#
# prepend! :: Node* -> xs:[Node*] -> xs
prepend(parent, xs) = xs |> each ->
  | parent.first-child =>  insert-before parent.first-child, it
  | otherwise          =>  append parent, it


#### Function insert-before
# Adds one or more nodes before another node, at the same level in the
# tree.
#
# insert-before :: Node* -> xs:[Node*] -> xs
insert-before(x, xs) = xs |> each ->
  x.parent-node.insert-before it, x


#### Function insert-after
# Adds one or more nodes after another node, at the same level in the
# tree.
#
# insert-after :: Node* -> xs:[Node*] -> xs
insert-after(x, xs) = xs |> each ->
  x.parent-node.insert-before it, x.next-sibling


#### Function remove
# Removes one or more nodes that are direct descendants of the given
# parent.
#
# remove! :: Node* -> xs:[Node*] -> xs
remove(parent, xs) = xs |> each ->
  parent.remove-child it


#### Function detach
# Removes one or more nodes from the DOOM tree.
#
# detach! :: xs:[Node*] -> xs
detach = each -> it.parent-node.remove-child node


#### Function replace
# Replaces a node by one or more nodes, at the same level in the tree.
#
# replace! :: Node* -> xs:[Node*] -> xs
replace(node, xs) =
  node.parent.replace-child node, head xs
  insert-after (head xs), (tail xs)
  node


#### Function wrap
# Wraps the given node in another, such that the new node will occupy
# the original node's place in the tree, and the original node will be a
# child of the new node.
#
# wrap! :: Node* -> x:Node* -> x
wrap(node, x) =
  insert-before node, x
  x.append-child node


#### Function clear
# Removes all direct children of the given nodes.
#
# clear! :: xs:[Node*] -> xs
clear = each ->
  while node.first-child
    node.remove-child node.first-child
  void


#### Function clone
# Creates a clone of the given nodes.
#
# Only attributes and their values will be cloned, **event listeners
# won't be copied**.
#
# Clones can be ``deep``, that is, the node and **all its children** are
# cloned, or shallow, where only the node itself is cloned — remember
# that plain text are also nodes, so they won't be cloned either.
#
# The returned clones will be off-DOOM, so you'll need to re-attach them
# if you want them query-able by a selector engine, or to be rendered on
# the screen.
#
# clone :: Bool -> [Node] -> [Node]
clone(deep, xs) = xs |> map ->
  it.clone-node deep



#### Exports ###########################################################
module.exports = {
  append
  prepend
  insert-before
  insert-after
  remove
  detach
  replace
  clear
  wrap
  clone
}
