Describe '{} reflection' ->
  ensure = require \noire .ensure
  _      = require \../src/reflection

  {get, children} = moros
  before-each moros.reset-dom

  Describe 'λ attributes' ->
    It 'should return a list of Attributes for every Element.' ->
      ensure (_.attributes children (get \xs)) .property \length .same 4
      ensure (_.attributes (get \xs) .0) .type \Array
      ensure (_.attributes (get \xs) .0.some -> it.name is \id && it.value is \xs) .ok!

  Describe 'λ attribute' ->
    It 'should return the value of the given attribute for each node.' ->
      ensure (_.attribute \id (get \xs)) .equals [\xs]
      ensure (_.attribute \alt children (get \xs)).filter Boolean .equals [\bleh \blah]

  Describe 'λ set-attribute' ->
    It 'given a value, should set the value of the attribute to that.' ->
      xs = children (get \xs)
      _.set-attribute \data-lol \lol xs
      for x in xs => ensure (x.get-attribute \data-lol) .same \lol

    It 'given no value, should remove the attribute.' ->
      xs = children (get \xs)
      _.set-attribute \data-lol \lol xs
      _.set-attribute \data-lol void xs
      for x in xs => ensure (x.get-attribute \data-lol) .not!ok!

  Describe 'λ text' ->
    It 'should return the textual representation of a node\'s contents.' ->
      ensure (_.text (get \xs)) .equals ['--12--']

  Describe 'λ set-text' ->
    It 'should construct a DOM subtree for the node from a singe TextNode.' ->
      xs = get \xs
      _.set-text \foo xs
      ensure xs.child-nodes.0.data .same \foo


  Describe 'λ html' ->
    It 'should return the HTML serialisation of the node\'s contents.' ->
      h = _.html (get \xs)
      ensure h .matches /<\s*img/i
      ensure h .matches /<\s*a/i
      ensure h .matches /<\s*div/i
      ensure h .matches /data-boo\s*=\s*"1"/i

  Describe 'λ set-html' ->
    It 'should construct a DOM subtree for the node from an HTML serialisation.' ->
      x = get \xs
      _.set-html '<a><b>1</b></a>' x
      ensure x.child-nodes.0.tag-name .same \A
      ensure x.child-nodes.0.child-nodes.0.tag-name .same \B
