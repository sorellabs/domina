Describe '{} utils' ->
  {each, map} = require \../src/utils
  ensure      = require \noire .ensure

  spy = ys = null
  beforeEach ->
    spy := sinon.spy!
    ys  := moros.children moros.get \xs

  Describe 'λ each' ->
    It 'Should curry the arguments.' ->
      ensure (each ->)      .type \function
      ensure (each ->, [1]) .equals [1]

    It 'Should treat non-sequences as a singleton sequence.' ->
      each spy, 1
      ensure spy .property \calledOnce .ok!

    It 'Should apply the iteratee to each item in the sequence.' ->
      each spy, [1 2 3]
      ensure spy .property \callCount .same 3
      ensure (spy.calledWith [1]) .ok
      ensure (spy.calledWith [2]) .ok
      ensure (spy.calledWith [3]) .ok

    It 'Should return the original sequence.' ->
      xs = [1 2 3]
      ensure (each spy, spy) .same spy
      ensure (each ->, xs) .same xs
      ensure (each ->, ys) .same ys

  Describe 'λ map' ->
    It 'Should curry the arguments.' ->
      ensure (map ->)    .type \function
      ensure (map (x) -> x, [1]) .equals [1]

    It 'Should treat non-sequences as a singleton sequence.' ->
      ensure (map (x) -> (x), 1) .equals [1]

    It 'Should return an array with each item mapped by the functor.' ->
      ensure (map (* 2), [1 2 3]) .equals [2 4 6]
      ensure (map ((x) -> x.node-name), ys) .equals <[ A IMG IMG DIV ]>