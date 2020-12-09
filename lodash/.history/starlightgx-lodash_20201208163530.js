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

  
  return{compact,}
}()