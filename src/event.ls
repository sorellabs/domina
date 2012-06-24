/** event.ls --- Manages events on DOOM nodes
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

## Module moros.event ##################################################

module.exports = (event) ->

  
  ### == Dependencies ==================================================
  {each} = require \./utils


  
  ### == Helpers =======================================================
  e = document.createElement \div


  #### Function has-p
  # Checks if the DOOM implementation acknowledges the given message for
  # Nodes.
  #
  # has? :: String -> Bool
  has-p = (key) -> key of e


  
  ### == W3C wrappers ==================================================
  w3c-listen(event, handler, xs) = xs |> each ->
    it.add-event-listener event, handler, false

  w3c-remove(event, handler, xs) = xs |> each ->
    it.remove-event-listener event, handler, false


  
  ### == IE wrappers ===================================================
  ie-listen(event, handler, xs) = xs |> each ->
    it.attach-event "on#{event}" handler

  ie-remove(event, handler, xs) = xs |> each ->
    it.detach-event "on#{event}" handler


  
  ### == Core implementation ===========================================

  #### Function listen
  # Registers a single event handler for a set of DOOM nodes.
  #
  # Events registered through this method are always bubbling. If you
  # need to use capturing, you'll need to get your hands dirty with the
  # DOOM API itself.
  #
  # As with the DOOM API, it's expected that duplicate event handlers
  # will be discarded when registered through this method.
  #
  # listen! :: EventType -> (Event -> IO Bool) -> [Node] -> ()
  listen = switch
  | has-p \addEventListener => w3c-listen
  | otherwise               => ie-listen


  #### Function deafen
  # Unregisters a previously registered event handler for a set of DOOM
  # nodes.
  #
  # This method won't remove event handlers that use capturing, you'll
  # need to get your hands dirty with the DOOM API itself if you need to
  # do that.
  #
  # deafen! :: EventType -> (Event -> IO Bool) -> [Node] -> ()
  deafen = switch
  | has-p \removeEventListener => w3c-remove
  | otherwise                  => ie-remove


  
  ### Exports ##########################################################

  if event    # Uses the provided custom event manager
    event

  else        # Uses the standard DOM APIs
    { listen, deafen }
