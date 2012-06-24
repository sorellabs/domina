glob  = require \glob .sync
watch = require \nodewatch

_  = require \slake-build-utils
fs = _.fs

global <<< require \prelude-ls

defer = process.next-tick

defaults    = void
environment =
  package: require \./package.json


show = (x) ->
  | x is 'new'    => 'created'
  | x is 'delete' => 'removed'
  | x is 'change' => 'modified'



task \clean 'Removes all build artifacts.' ->
  each fs.remove, <[ lib build dist ]>
  defer _.display-errors


task \build 'Builds JavaScript files out of the LiveScript ones.' ->
  defer _.display-errors
  _.tasks.compile-ls \src \lib compile: defaults, environment: environment



task \build:bundle 'Generates browserify bundles for Moros.' ->
  defer _.display-errors
  "moros"      |> _.tasks.bundle \build, {+bare, require: [\moros]}, []
  "browserify" |> _.tasks.bundle \build, {+bare, +prelude}, []


task \build:all 'Runs all build tasks.' ->
  defer _.display-errors
  invoke \build
  invoke \build:bundle


task \package 'Packages Moros in a nice .tar.gz package.' ->
  version = environment.package.version
  fs.initialise \dist
  fs.copy \build "dist/moros-#version"
  _.tasks.pack \dist "moros-#version" ["moros-#version"] _.display-errors


task \test 'Generates test artifacts for Mocha.' ->
  defer _.display-errors
  "suite" |> _.tasks.bundle \test/build {+bare, +prelude} [\test/suite.ls]

task \test:continuous 'Continuously generates test artifacts for Mocha.' ->
  _.header "—› Watching `test/' and `src/' directories for changes..."
  watch.add \./test .add \./src .on-change (file, previous, current, action) ->
    console.log (_.yellow "‹#{action.toUpperCase!}› `#file' has been #{show action}.")
    invoke \test
