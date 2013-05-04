## Module event ########################################################
#
# Manages events on DOOM nodes.
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

module.exports = (event, engine) ->

  
  ### -- Dependencies --------------------------------------------------
  {each} = require './collection'
  {matches} = (require './query') engine


  
  ### -- Helpers -------------------------------------------------------
  e = document.createElement \div


  #### λ has
  # Checks if the DOOM implementation acknowledges the given message for
  # Nodes.
  #
  # :: String -> Bool
  has = (key) -> key of e


  #### λ is-callable
  # Checks if something can be called.
  #
  # :: a -> Bool
  is-callable = (a) -> typeof a is 'function'

  #### λ is-element
  # Checks if something is an element node
  #
  # :: a -> Bool
  is-element = (a) -> a?.node-type is 1


  #### λ find-target
  # Finds the actual target of an event, for delegation's sake.
  #
  # :: String -> Node -> Node -> Maybe Node
  find-target = (selector, parent, x) -->
    while x && x isnt parent
      if (is-element x) and (matches selector, x) => return x
      x = x.parent-node

  #### λ source
  # Returns the element that originated the Event.
  #
  # :: Event -> HTMLElement
  source = (ev) -> ev.target or ev.src-element


  #### λ as-filter
  # Constructs a `EventFilter` for delegating events.
  #
  # :: Node, String -> (Event -> Maybe Node)
  # :: Node, (Node, Event -> Maybe Node) -> (Event -> Maybe Node)
  as-filter = (current, filter) ->
    switch
    | is-callable filter => (ev) -> filter.call this, current, ev
    | otherwise          => (ev) -> find-target filter, current, (source ev)


  
  ### -- W3C wrappers --------------------------------------------------
  w3c-listen = (event, handler, xs) --> xs |> each ->
    it.add-event-listener event, handler, false

  w3c-remove = (event, handler, xs) --> xs |> each ->
    it.remove-event-listener event, handler, false


  
  ### -- IE wrappers ---------------------------------------------------
  ie-listen = (event, handler, xs) --> xs |> each ->
    it.attach-event "on#{event}" handler

  ie-remove = (event, handler, xs) --> xs |> each ->
    it.detach-event "on#{event}" handler


  
  ### -- Core implementation -------------------------------------------

  #### λ listen
  # Registers a single event handler for a set of DOOM nodes.
  #
  # Events registered through this method are always bubbling. If you
  # need to use capturing, you'll need to get your hands dirty with the
  # DOOM API itself.
  #
  # As with the DOOM API, it's expected that duplicate event handlers
  # will be discarded when registered through this method.
  #
  # :: EventType -> (Event -> IO Bool) -> [Node] -> ()
  listen = switch
  | has \addEventListener => w3c-listen
  | otherwise             => ie-listen


  #### λ delegate
  # Registers a single event handler for a set of DOOM nodes, and
  # delegates by using a filter.
  #
  # Your `EventFilter` can be either a selector string, or a
  # function. In the latter case, it should return the Node that should
  # be taken as the target of the action, or `null` if the event
  # shouldn't be dispatched.
  #
  # ## See also:
  # - `listen`.
  #
  # :: EventFilter -> EventType -> (Event, Node -> Bool) -> [Node] -> ()
  delegate = (filter, event, handler, xs) --> 
    xs |> listen event, (ev) ->
                             current = ev.current-target || this
                             element = (as-filter current, filter) ev
                             if element => handler.call this, ev, element


  #### λ deafen
  # Unregisters a previously registered event handler for a set of DOOM
  # nodes.
  #
  # This method won't remove event handlers that use capturing, you'll
  # need to get your hands dirty with the DOOM API itself if you need to
  # do that.
  #
  # :: EventType -> (Event -> IO Bool) -> [Node] -> ()
  deafen = switch
  | has \removeEventListener => w3c-remove
  | otherwise                => ie-remove


  
  ### -- Exports -------------------------------------------------------

  switch
  | event     => event <<< { delegate }
  | otherwise => { listen, delegate, deafen }
