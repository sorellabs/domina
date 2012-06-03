/// event.js --- Binding events to the DOOM
//
// Copyright (c) 2012 Quildreen Motta
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/// Module moros.event

module.exports = function(event) {

  var e = document.createElement('div')

  var on    = 'addEventListener' in e?
  /* W3C */   function _on(el, event, handler) {
                return el.addEventListener(event, handler, false) }
            :
  /* IE */    function _on(el, event, handler) {
                return el.attachEvent('on' + event, handler) }


  var remove = 'removeEventListener' in e?
  /* W3C */    function _remove(el, event, handler) {
                 return el.removeEventListener(event, handler, false) }
             :
  /* IE */     function _remove(el, event, handler) {
                 return el.detachEvent('on' + event, handler) }


  return event
  ||     { on     : on
         , remove : remove }
}