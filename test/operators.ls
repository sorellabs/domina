same-collection = (xs, ys) ->
  for , i in xs
    if xs[i] !== ys[i] => return false
  return true


module.exports = {
  same-collection
}
