## Module presentation #################################################
#
# Core visual presentation handling.
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
{map, each} = require './collection'



### -- Aliases ---------------------------------------------------------
is-array = Array.is-array


### -- Helpers ---------------------------------------------------------

#### λ get-computed-style
# Returns the computed style of a given Element.
#
# :: Element -> { String -> String }
get-computed-style = let e = document.createElement \div
                     switch
                     | \currentStyle of e  => -> it.current-style
                     | otherwise           => (it, state) ->
                                                it.owner-document
                                                  .default-view
                                                  .get-computed-style it, state


#### λ make-class-re
# Creates a regular expression that matches space-separated classes.
#
# :: String -> RegExp
make-class-re = (name) ->
  escape = (re) -> do
                   re.trim!
                     .replace /([^\w\s])/g, '\\$1'
                     .replace /\s+/,        '|'

  new RegExp "\\s*\\b
              (#{escape normalise-classes name})
              \\b\\s*"
            , \gi


#### λ normalise-classes
# Normalises a Classes interface.
#
# :: Classes -> String
normalise-classes = ->
  | is-array it  => it.join ' '
  | otherwise    => String it



### -- Core implementation ---------------------------------------------

#### λ style
# Returns the value of a given style property set directly on the Node.
#
# If you need to grab styles that come from stylesheets or are otherwise
# computed by the browser, use :fun:`.computed-style` instead.
#
# :: String -> [Node] -> [String]
style = (name, xs) --> xs |> map ->
  it.style[name]


#### λ style1
# Returns the value of a given style property set directly on the first
# Node.
#
# If you need to grab styles that come from stylesheets or are otherwise
# computed by the browser, use :fun:`.computed-style` instead.
#
# :: String -> Coll Node -> String
style1 = (name, node) --> (head node).style[name]



#### λ computed-style
# Returns the value of a given style property as computed by the
# browser.
#
# :: String -> [Node] -> [Maybe String]
computed-style = (name, xs) --> xs |> map ->
  (get-computed-style it)[name]


#### λ computed-style1
# Returns the value of the given style property as computed by the
# browser.
#
# :: String -> Coll Node -> Maybe String
computed-style1 = (name, node) --> (get-computed-style (head node))[name]


#### λ set-style
# Gives a style's property a new value on each node.
#
# :: String -> String -> xs:[Node*] -> xs
set-style = (name, value, xs) --> xs |> each ->
  it.style[name] = value


#### λ classes
# Returns the list of classes for each Node.
#
# :: [Node] -> [[String]]
classes = map ->
  it.class-name.trim!.split /\s+/


#### λ add-class
# Adds new classes on each node.
#
# Multiple classes can be given either as words delimited by
# white-space, or as an array of strings.
#
# :: Classes -> xs:[Node*] -> xs
add-class = (name, xs) --> xs |> each ->
  remove-class name, it
  it.class-name += " #{normalise-classes name}"


#### λ remove-class
# Removes a set of classes from each node.
#
# Multiple classes can be given either as words delimited by white-space
# or as an array of strings.
#
# :: Classes -> xs:[Node*] -> xs
remove-class = (name, xs) -->
  re = make-class-re name
  xs |> each -> it.class-name = it.class-name.replace re, ''


#### λ has-class
# Does each node has any of the given set of classes?
#
# Multiple classes can be given either as words separated by white-space
# or as an array of strings.
#
# :: Classes -> [Node] -> [Bool]
has-class = (name, xs) -->
  re = make-class-re name
  xs |> map -> re.test it.class-name


#### λ toggle-class
# Toggles a set of classes in the given nodes.
#
# That is, classes that are set will be removed, and classes that don't
# exist will be added.
#
# :: String -> xs:[Node*] -> xs
toggle-class = (name, xs) -->
  has = has-class name
  xs |> each ->
         | has it .0  => remove-class name, it
         | otherwise  => add-class name, it

#### λ specify-class-state
# Adds or removes a bunch of classes on the given nodes.
#
# :: String -> Bool -> xs:[Node*] -> xs
specify-class-state = (name, should-add, xs) --> xs |> each ->
  | should-add  => add-class name, it
  | otherwise   => remove-class name, it


### -- Exports ---------------------------------------------------------
module.exports = {
  style
  style1
  computed-style
  computed-style1
  set-style
  classes
  add-class
  remove-class
  has-class
  toggle-class
  specify-class-state
}
