var starlightgx = function () {
  function compact(ary) {
    var result = []
    for (let i = 0; i < ary.length; i++){
      if (ary[i]) {
        result.push(ary[i])
      }
    }
    return result
  }

  function join(ary, separator) {
    var result = ''
    for (let i = 0; i < ary.length; i++) {
      if (i == ary.length - 1) {
        result += ary[i]
      }else{
        result += ary[i] + separator
      }
    }
    return result
  }

  function last(ary) {
    if(ary == []){return ary}
    return ary [ary.length-1]
  }

  function lastIndexOf(ary, val, index) {
    index = ary.length - 1
    for (let i = ary.length - 1; i >= 0; i--){
      if (ary[i] == val) {
        return i
      }
    }
    return -1
  }


  return {
    compact,
    join,
    last,
    lastIndexOf,
  }
}()