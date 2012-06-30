ensure = require \noire .ensure

selectors =
  '#xs *': 5
  '#xs a': 2
  '#xs a[data-boo]': 0
  '#xs img[data-boo="1"]': 1
  '#xs img[data-boo="2"]': 0
  '#xs div[class~="y"]': 1
  '#xs div[class~="a"]': 0
  '#xs img[alt^="bl"]': 2
  '#xs img[alt^="ah"]': 0
  '#xs img[alt$="ah"]': 1
  '#xs img[alt$="bl"]': 0
  '#xs img[alt*="la"]': 1
  '#xs img[alt*="gb"]': 0
  '#xs a[lang|="en"]': 1
  '#xs > a[lang|="pt"]': 0


test-set(ensure, query) =
  for pattern, len of selectors
    ensure (query pattern) .property \length .same len

test-single(ensure, query) =
  for pattern, len of selectors
    assertion = ensure (query pattern)
    if not len then assertion = assertion.not!
    assertion.ok!

test-selector-engine(name, engine) =
  Describe "{} query ‹#{name}›" ->
    {query, query-one}  = engine

    before-each moros.reset-dom

    Describe 'λ query' ->
      It 'Should return a set of elements.' ->
        ensure (query \a) .type \Array
        ensure (query \html) .type \Array
        ensure (query \*) .type \Array

      It 'Should select elements using CSS selectors.' ->
        test-set ensure, query

      It 'Given a context, should return only elements descending from that context.' ->
        ensure (query \div, document.get-element-by-id \xs) .property \length .same 1

    Describe 'λ query-one' ->
      It 'Should return a single element.' ->
        ensure (query-one \a) .type \HTMLAnchorElement
        ensure (query-one \html) .type \HTMLHtmlElement
        ensure (query-one \*) .type \HTMLHtmlElement

      It 'Should select elements using CSS selectors.' ->
        test-single ensure, query-one

      It 'Given a context, should return only elements descending from that context.' ->
        ensure (query-one \a, document.get-element-by-id \xs).get-attribute \lang .same \en-gb

### Engine tests
query = require \../src/query
test-selector-engine \Native query!

if Sizzle? => test-selector-engine \Sizzle    query Sizzle
if NW?     => test-selector-engine \NWMatcher query NW.match
if qwery?  => test-selector-engine \Qwery     query qwery