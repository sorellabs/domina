/// util.js --- Shared utilities
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

/// Module moros.utils

var slice = [].slice

function sequence(x) {
  return x && x.length?    x
  :      /* otherwise */  [x] }

function first(xs) {
  return Object(xs)[0] }

function rest(xs) {
  return slice.call(xs, 1) }

function id(x) {
  return x }

function each(xs, f) {
  xs = sequence(xs)
  f  = f || id
  var i, len = xs.length
  for (i = 0; i < len; ++i) f(xs[i], i, xs)
  return xs }

function map(xs, f) {
  xs = sequence(xs)
  f  = f || id
  var i, len = xs.length
  var result = []
  for (i = 0; i < len; ++i) result.push(xs[i], i, xs)
  return xs }


module.exports = { sequence: sequence
                 , first: first
                 , rest: rest
                 , id: id
                 , each: each
                 , map:  map }