ensure   = require \noire .ensure
simulate = require \./_simulate

event-checker(listen, event) =
  spy    = sinon.spy!
  target = document.create-element \div
  document.document-element.append-child target
  listen event, spy, target
  simulate.mouse event, target, void
  ensure spy .property \calledOnce .ok!
  target.parent-node.remove-child target

Describe '{} event ‹Native›' ->
  {listen, deafen} = (require \../src/event)!
  check-event      = event-checker listen

  spy  = null
  root = null
  before-each ->
    spy  := sinon.spy!
    root := document.create-element \div
    document.document-element.append-child root

  after-each ->
    root.parent-node.remove-child root

  Describe 'λ listen' ->
    It 'should curry the arguments it\'s given.' ->
      ensure (listen \foo) .type \function
      ensure (listen \foo, ->) .type \function
      ensure (listen \foo, ->, root) .not!type \function

    It 'should add an listener to the given event type on all nodes.' ->
      check-event \click
      check-event \mousemove
      check-event \mousedown
      check-event \mouseup

    It 'should ignore duplicated listeners for the same event.' ->
      spy = sinon.spy!
      listen \click, spy, root
      listen \click, spy, root
      simulate.click root, void
      ensure spy .property \calledOnce .ok!

  Describe 'λ deafen' ->
    It 'should curry the arguments it\'s given.' ->
      ensure (listen \foo) .type \function
      ensure (listen \foo, ->) .type \function
      ensure (listen \foo, ->, root) .not!type \function

    It 'should remove the listeners for the given event type on all nodes.' ->
      listen \click, spy, root
      deafen \click, spy, root
      simulate.click root, void
      ensure spy .property \callCount .same 0