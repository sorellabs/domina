watch        = require \node-watch
http         = require \http-get
sequentially = require \cassie/src/sequencing
Promise      = require \cassie .Promise

_  = require \slake-build-utils
fs = _.fs

global <<< require \prelude-ls
defer = process.next-tick



# == Helpers ===========================================================
show = (x) ->
  | x is 'new'    => 'created'
  | x is 'delete' => 'removed'
  | x is 'change' => 'modified'


download(filename, uri, target) =
  p = Promise.make!
  _.header "—› Downloading #uri"
  http.get url: uri, "#target/#filename", (err, result) ->
    if err
      _.log-error \download [uri] err, "Error downloading #uri"
    else
      console.log (_.green "#uri downloaded successfully.")
    p.bind!
  p


# == Configuration =====================================================
defaults    = void

vendor-libs =
  bean:      download \bean.js      'https://raw.github.com/fat/bean/master/bean.js'
  sizzle:    download \sizzle.js    'https://raw.github.com/jquery/sizzle/master/sizzle.js'
  nwmatcher: download \nwmatcher.js 'http://nwevents.googlecode.com/files/nwmatcher-1.2.5.js'
  qwery:     download \qwery.js     'https://raw.github.com/ded/qwery/master/qwery.js'

environment =
  package: require \./package.json


# == Tasks =============================================================
task \clean 'Removes all build artifacts.' ->
  _.header "—› Removing build artifacts..."
  each fs.remove, <[ lib build dist test/build vendor ]>
  defer _.display-errors


task \build 'Builds JavaScript files out of the LiveScript ones.' ->
  defer _.display-errors
  _.tasks.compile-ls \src \lib compile: defaults, environment: environment


task \build:bundle 'Generates browserify bundles for Moros.' ->
  defer _.display-errors
  "moros"      |> _.tasks.bundle \build, {+bare, require: [moros: './']}, []
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
  invoke \test
  _.header "—› Watching `test/' and `src/' directories for changes..."
  watch.add \./test .add \./src .on-change (file, previous, current, action) ->
    console.log (_.yellow "‹#{action.toUpperCase!}› `#file' has been #{show action}.")
    invoke \test


task \deps:vendor 'Download vendor dependencies.' ->
  run(lib, action) = ->
    fs.initialise "vendor/#lib"
    action "vendor/#lib"

  defer _.display-errors
  fs.initialise \vendor
  _.header "—› Downloading vendor dependencies..."
  sequentially.apply null, [run lib, action for lib, action of vendor-libs]