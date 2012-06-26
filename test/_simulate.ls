### Some simulation utilities for testing

event(kind, name, element, options = {+bubbles, +cancelable}) =
  if document.create-event
    ev = document.create-event kind
    ev.init-event name, options.bubbles, options.cancelable
    element.dispatch-event ev

  else
    ev = document.create-event-object! <<< options
    element.fire-event "on#name" ev


mouse = event \MouseEvents


########################################################################
module.exports = {
  event
  mouse
  click: mouse \click
}
