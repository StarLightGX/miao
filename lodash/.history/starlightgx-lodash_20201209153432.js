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

  function lastIndexOf(ary, val, index = ary.length - 1) {
    for (let i = index; i >= 0; i--){
      if (ary[i] == val) {
        return i
      }
    }
    return -1
  }

  function fill(ary,val,start = 0,end = ary.length){
    for (let i = start; i < end; i++){
      ary[i] = val
    }
    return ary
  }


  function flatten(ary){
    for (let i = 0; i < ary.length; i++){
      if (Arrary.isArray(ary[i]) ) {
        
      }
    }
  }




  function fromPairs(ary){
    let result = {}
    for (let j = 0; j < ary.length; j++){
      result[ary[j][0]] = ary[j][1]
    }
    return result
  } 

  function head(ary) {
    if(ary == []){return ary}
    return ary [0]
  }

  function indexOf(ary, val, index = 0) {
    if (index < 0) {
      for (let i = ary.length - 1; i >= 0; i--){
      if (ary[i] == val) {
        return i
      }
    }
    return -1
    }
    for (let i = index; i < ary.length; i++){
      if (ary[i] == val) {
        return i
      }
    }
    return -1
  }


  function initial(ary){
    let result = []
    if(ary == []){return []}
    for (let i = 0; i < ary.length - 1; i++){
      result.push(ary[i])
    }
    return result
  }

  function drop(ary, n = 0) {
    if (n >= ary.length) {
      return []
    }
    let result = []
    if (n == 0) {
      for (let i = 1; i < ary.length; i++){
      result.push(ary[i])
      }
    }else{
    for (let i = n; i < ary.length; i++){
      result.push(ary[i])
      }
    }
    return result
  }



  function dropRight(ary, n = 1) {
    if (n >= ary.length) {
      return []
    }
    let result = []
    if (n == 0) {
      return ary
    }else{
    for (let i = 0; i < ary.length - n; i++){
      result.push(ary[i])
      }
    }
    return result
  }

  function reverse(ary) {
    let result = []
    for (let i = ary.length - 1; i >= 0; i--){
      result.push(ary[i])
    }
    return result
  }

  function max(ary) {
    if(ary == []){return undefined}
    let max = ary[0]
    for (let i = 1; i < ary.length; i++){
      max >= ary[i] ? max : max = ary[i]
    }
    return max
  }


  function min(ary) {
    if(ary == []){return undefined}
    let min = ary[0]
    for (let i = 1; i < ary.length; i++){
      min <= ary[i] ? min : min = ary[i]
    }
    return min
  }

  function sum(ary) {
    if(ary == []){return undefined}
    let sum = ary[0]
    for (let i = 1; i < ary.length; i++){
      sum += ary[i]
    }
    return sum
  }

  function findindex(ary,f,index = 0){
  }
  function findLastindex(ary,f,index = 0){
  }
  function flattenDeep(){
  }
  function flattenDepth(){
  }
  function chunk(){
  }
  function sortedindex(){
  }
  function filter(ary,f){
  }
  function find(ary,f){
  }
  function toArray(val){
  }

  function maxBy(aryobj, f) {
    if(f)
    let max = f(aryobj[0])
    let point = 0
    for (let i = 1; i < aryobj.length; i++) {
      
      if (max < f(aryobj[i])) {
        max = f(aryobj[i])
        point = i
      }  
    }
    return aryobj[point]
  }


  function minBy(obj, f) {
  }

  return {
    compact,
    join,
    last,
    lastIndexOf,
    fill,
    fromPairs,
    head,
    indexOf,
    initial,
    drop,
    dropRight,
    reverse,
    max,
    min,
    sum,



  }
}()