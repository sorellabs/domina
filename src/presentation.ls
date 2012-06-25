/** presentation.ls --- Core visual presentation handling
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



## Module moros.presentation ###########################################

### == Dependencies ====================================================
{map, each} = require \./utils



### == Aliases =========================================================
array-p = Array.is-array


### == Helpers =========================================================

#### Function get-computed-style
# Returns the computed style of a given Element.
#
# get-computed-style :: Element -> { String -> String }
get-computed-style = let e = document.createElement \div
                     switch
                     | \currentStyle of e  => -> it.current-style
                     | otherwise           => (it, state) ->
                                                it.owner-document
                                                  .default-view
                                                  .get-computed-style it, state


#### Function make-class-re
# Creates a regular expression that matches space-separated classes.
#
# make-class-re :: String -> RegExp
make-class-re = (name) ->
  escape = (re) -> do
                   re.trim!
                     .replace /([^\w\s])/g, '\\$1'
                     .replace /\s+/,        '|'

  new RegExp "\\s*\\b
              (#{escape normalise-classes name})
              \\b\\s*"
            , \gi


#### Function normalise-classes
# Normalises a Classes interface.
#
# normalise-classes :: Classes -> String
normalise-classes = ->
  | array-p it  => it.join ' '
  | otherwise   => String it



### == Core implementation =============================================

#### Function style
# Returns the value of a given style property set directly on the Node.
#
# If you need to grab styles that come from stylesheets or are otherwise
# computed by the browser, use :fun:`.computed-style` instead.
#
# style :: String -> [Node] -> [String]
style(name, xs) = xs |> map ->
  it.style[name]


#### Function computed-style
# Returns the value of a given style property as computed by the
# browser.
#
# computed-style :: String -> [Node] -> [Maybe String]
computed-style(name, xs) = xs |> map ->
  (get-computed-style it)[name]


#### Function set-style
# Gives a style's property a new value on each node.
#
# set-style! :: String -> String -> xs:[Node*] -> xs
set-style(name, value, xs) = xs |> each ->
  it.style[name] = value


#### Function classes
# Returns the list of classes for each Node.
#
# classes :: [Node] -> [[String]]
classes = map ->
  it.class-name.trim!.split /\s+/


#### Function add-class
# Adds new classes on each node.
#
# Multiple classes can be given either as words delimited by
# white-space, or as an array of strings.
#
# add-class! :: Classes -> xs:[Node*] -> xs
add-class(name, xs) = xs |> each ->
  remove-class name, it
  it.class-name += " #{normalise-classes name}"


#### Function remove-class
# Removes a set of classes from each node.
#
# Multiple classes can be given either as words delimited by white-space
# or as an array of strings.
#
# remove-class! :: Classes -> xs:[Node*] -> xs
remove-class(name, xs) =
  re = make-class-re name
  xs |> each -> it.class-name = it.class-name.replace re, ''


#### Function has-class-p
# Does each node has any of the given set of classes?
#
# Multiple classes can be given either as words separated by white-space
# or as an array of strings.
#
# has-class-p :: Classes -> [Node] -> [Bool]
has-class-p(name, xs) =
  re = make-class-re name
  xs |> map -> re.test it.class-name


#### Function toggle-class
# Toggles a set of classes in the given nodes.
#
# That is, classes that are set will be removed, and classes that don't
# exist will be added.
#
# toggle-class! :: String -> xs:[Node*] -> xs
toggle-class(name, xs) =
  has-p = has-class-p name
  debugger
  xs |> each ->
         | has-p it .0  => remove-class name, it
         | otherwise    => add-class name, it

#### Function specify-class-state
# Adds or removes a bunch of classes on the given nodes.
#
# specify-class-state! :: String -> Bool -> xs:[Node*] -> xs
specify-class-state(name, should-add-p, xs) = xs |> each ->
  | should-add-p  => add-class name, it
  | otherwise     => remove-class name, it


### Exports ############################################################
module.exports = {
  style
  computed-style
  set-style
  classes
  add-class
  remove-class
  has-class-p
  toggle-class
  specify-class-state
}