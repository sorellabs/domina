Describe '{} manipulation' ->
  ensure = require \noire .ensure
  _      = require \../src/manipulation

  before-each moros.reset-dom
  get = (id)   -> document.get-element-by-id id
  tag = (name) -> document.create-element name


  Describe 'λ append' ->
    It 'should add all nodes at the end of the parent\'s children.' ->
      a = tag \div
      _.append (get \xs), a
      ensure (get \xs).child-nodes[*-1] .same a


  Describe 'λ prepend' ->
    It 'should add all nodes at the beginning of the parent\'s children.' ->
      a = tag \div
      _.prepend (get \xs), a
      ensure (get \xs).child-nodes.0 .same a


  Describe 'λ insert-before' ->
    It 'should add the nodes before the related target, at the same level.' ->
      a = tag \div
      b = tag \div
      (get \xs).append-child b
      _.insert-before b, a
      ensure b.previous-sibling .same a

  Describe 'λ insert-after' ->
    It 'should add the nodes after the related target, at the same level.' ->
      a = tag \div
      b = tag \div
      (get \xs).append-child a
      _.insert-after a, b
      ensure a.next-sibling .same b

  Describe 'λ detach' ->
    It 'should remove the nodes from the DOM tree.' ->
      xs = get (\xs)
      _.detach (get \xs)
      ensure ((not xs.parent-node) or (not xs.parent-node.tag-name)) .ok!

  Describe 'λ replace' ->
    It 'should replace the related target by the given nodes.' ->
      a = tag \div
      b = tag \div
      c = tag \div
      (get \xs).append-child a
      (get \xs).append-child b
      _.replace a, c
      ensure c.next-sibling .same b

  Describe 'λ wrap' ->
    It 'should wrap the related target into the given wrapper.' ->
      a = tag \div
      b = tag \div
      c = tag \div
      (get \xs).append-child a
      (get \xs).append-child b
      _.wrap a, c
      ensure c.child-nodes.0 .same a
      ensure c.next-sibling .same b

  Describe 'λ clear' ->
    It 'should remove all children from all given nodes.' ->
      _.clear (get \xs)
      ensure (get \xs) .empty

  Describe 'λ clone' ->
    a = b = c = null
    before-each ->
      a := tag \div
      b := tag \div
      c := tag \div
      a.append-child b
      b.append-child c

    It 'should return a list with the cloned nodes.' ->
      ensure (_.clone true, a) .type \Array

    It 'given a deep clone, should clone all the DOM subtree for that node.' ->
      clone = (_.clone true, a).0
      ensure clone .not!same a
      ensure clone.child-nodes.0 .not!same b
      ensure clone.child-nodes.0.child-nodes.0 .not!same c

    It 'given a shallow clone, should clone only the node itself.' ->
      clone = (_.clone false, a).0
      ensure clone .not!same a
      ensure clone.child-nodes .empty
