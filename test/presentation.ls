Describe '{} presentation' ->
  ensure = require \noire .ensure
  _      = require \../src/presentation

  {get, children} = moros
  before-each moros.reset-dom

  Describe 'λ style' ->
    It 'should retrieve the style property set in the node.' ->
      x = get \xs
      ensure (_.style \textAlign x) .equals [\left]
      ensure (_.style \display x) .equals ['']

  Describe 'λ computed-style' ->
    It 'should retrieve the computed value for a property in the node.' ->
      x = get \xs
      ensure (_.computed-style \display x) .equals [\none]
      ensure (_.computed-style \textAlign x) .equals [\left]

  Describe 'λ set-style' ->
    It 'should define the style property directly in the node.' ->
      x = get \xs
      _.set-style \textAlign \right x
      ensure x.style.textAlign .same \right

  Describe 'λ classes' ->
    It 'should return the list of classes for each node.' ->
      x = (get \xs) .child-nodes.4
      ensure (_.classes x) .equals [<[ x y z ]>]

  Describe 'λ add-class' ->
    It 'should add a new class to the node.' ->
      x = get \xs
      _.add-class \foo x
      ensure x.class-name.trim! .same "foo"
    It 'should do nothing if the class already exists.' ->
      x = get \xs
      _.add-class \foo x
      _.add-class \foo x
      ensure x.class-name.trim! .same "foo"

  Describe 'λ remove-class' ->
    It 'should remove the class from the node.' ->
      x = get \xs
      x.class-name = "foo bar"
      _.remove-class \bar x
      ensure x.class-name.trim! .same "foo"

  Describe 'λ has-class-p' ->
    It 'should check if the class exists for each node.' ->
      x = get \xs
      x.class-name = "foo bar"
      ensure (_.has-class-p \foo x) .equals [true]
      ensure (_.has-class-p \bleh x) .equals [false]

  Describe 'λ toggle-class' ->
    It 'Given the class exists, should remove the class.' ->
      x = get \xs
      x.class-name = "foo bar"
      _.toggle-class \foo x
      ensure x.class-name.trim! .same "bar"

    It 'Given the class doesn\'t exist, should add the class' ->
      x = get \xs
      x.class-name = "foo"
      _.toggle-class \bar x
      ensure x.class-name .matches /\bbar\b/

  Describe 'λ specify-class-state' ->
    It 'Given a truthy state, should add the class.' ->
      x = get \xs
      x.class-name = "foo bar"
      _.specify-class-state \bar true x
      _.specify-class-state \baz true x
      ensure x.class-name .matches /\bbar\b/
      ensure x.class-name .matches /\bbaz\b/

    It 'Given a falsy state, should remove the class.' ->
      x = get \xs
      x.class-name = "foo bar"
      _.specify-class-state \bar false x
      _.specify-class-state \baz false x
      ensure x.class-name.trim! .same "foo"
