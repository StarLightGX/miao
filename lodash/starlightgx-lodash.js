var starlightgx = function () {


  //类型转换

  function get(obj, path, defaultValue = undefined) {
    let names = path
    if (typeJudge(path) == "[object String]") {
      names = toPath(path)
    }
    for (let name of names) {
      if (name in Object(obj)) {
        obj = obj[name]
      } else {
        return defaultValue
      }
    }
    return obj
  }

  function property(path) {
    return bind(get, null, window, path)
    let names = path.split(".")

    return function (obj) {
      for (let name of names) {
        if (name in Object(obj)) {
          obj = obj[name]
        } else {
          return
        }
      }
      return obj
    }
  }

  function isMatch(obj, src) {
    if (Array.isArray(src)) {
      let cache = {}
      for (let i = 0; i < src.length; i++) {
        cache[src[i]] = src[i + 1]
        i++
      }
      src = cache
    }

    for (let key in src) {
      if (src[key] && typeof src[key] == "object") {
        if (!isMatch(obj[key], src[key])) {
          return false
        }
      } else {
        if (src[key] !== obj[key]) {
          return false
        }
      }
    }

    return true
  }

  function matches(src) {
    return bind(isMatch, null, window, src)
    // return function (obj) {
    //   for (let key in source) {
    //     if (source[key] !== obj[key]) {
    //       return false
    //     }
    //   }
    //   return true
    // }
  }

  function matchesProperty(path, srcValue) {

    // return function (obj) {
    //   if (path in obj && obj[path] == srcValue){
    //     return true
    //   }
    //   return false
    // }

    return bind(matches, null, window, srcValue)
  }

  function bind(f, thisArg, ...patials) {
    return function (...args) {
      let copy = patials.slice()
      for (let i = 0; i < copy.length; i++) {
        if (copy[i] === window) {
          copy[i] = args.shift()
        }
      }
      return f.call(thisArg, ...copy, ...args)
    }
  }

  function iteratee(predicate) {
    if (typeof predicate === 'function') {
      return predicate
    }
    if (typeof predicate === 'string') {
      return property(predicate)
    }
    if (typeof predicate === 'object') {
      return matches(predicate)
    }
    if (Array.isArray(predicate)) {
      return matchesProperty(predicate)
    }
  }

  function transformType(iteratee) {
    if (typeUtils.isString(iteratee)) {
      let splited = iteratee.split(".");
      if (splited.length === 1) {
        return val => val[iteratee];
      }
      // return val => {
      //   let ret = val;
      //   for (let prop of splited) {
      //     ret = ret[prop];
      //   }
      //   return ret;
      // }
      // 简洁是简洁了，不过不好做错误处理
      return val => splited.reduce((ret, cur) => ret[cur], val);
    }
    if (typeUtils.isFunction(iteratee)) {
      return iteratee;
    }
    if (typeUtils.isNull(iteratee) || typeUtils.isUndefined(iteratee)) {
      return val => val;
    }

    if (typeUtils.isObject(iteratee)) {
      // return iterateeEqual(iteratee);
      // return deepEqual.bind(null, iteratee);
      return matches(iteratee);
    } else if (typeUtils.isArray(iteratee)) {
      return function (obj) {
        return obj[iteratee[0]] === iteratee[1];
      }
    } else if (typeUtils.isRegExp(iteratee)) {
      return val => iteratee.test(val);
    }
  }

  // function iterateeEqual(source) {
  //   return function compare(target) {
  //     return deepEqual(source, target);
  //   }
  // }


  ////////////////////////////////////////////////////////////////////////////////////////

  //默认函数 + 类型判断
  function identity(val) {
    return val
  }

  function typeJudge(val) {
    var judge = Object.prototype.toString
    return judge.call(val)
  }

  // if (typeJudge(val) == "[object Function]") { return res}
  // if (typeJudge(val) == "[object Object]") { return res}
  // if (typeJudge(val) == "[object Array]") { return res}
  // if (typeJudge(val) == "[object String]") { return res}
  // if (typeJudge(val) == "[object Number]") {return res}

  // if (typeJudge(val) == "[object Boolean]") { return }
  // if (typeJudge(val) == "[object Null]") {return }
  // if (typeJudge(val) == "[object Undefined]") {return }

  function re(x) {
    let str = x.replace("é", "e")
    return str.replace("à", "a")
  }
  /////////////////////////////////////////////////////////////////////////////////////////

  function compact(ary) {
    var result = []
    for (let i = 0; i < ary.length; i++) {
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
      } else {
        result += ary[i] + "" + separator
      }
    }
    return result
  }

  function last(ary) {
    if (ary == []) { return ary }
    return ary[ary.length - 1]
  }

  function lastIndexOf(ary, val, index = ary.length - 1) {
    for (let i = index; i >= 0; i--) {
      if (ary[i] == val) {
        return i
      }
    }
    return -1
  }

  function fill(ary, val, start = 0, end = ary.length) {
    for (let i = start; i < end; i++) {
      ary[i] = val
    }
    return ary
  }

  function flatten(ary) {
    var res = []
    for (let i = 0; i < ary.length; i++) {
      if (Array.isArray(ary[i])) {
        for (let j = 0; j < ary[i].length; j++) {
          res.push(ary[i][j])
        }
      } else { res.push(ary[i]) }
    }
    return res
  }

  function fromPairs(ary) {
    let result = {}
    for (let j = 0; j < ary.length; j++) {
      result[ary[j][0]] = ary[j][1]
    }
    return result
  }

  function head(ary) {
    if (ary == []) { return ary }
    return ary[0]
  }

  function initial(ary) {
    let result = []
    if (ary == []) { return [] }
    for (let i = 0; i < ary.length - 1; i++) {
      result.push(ary[i])
    }
    return result
  }

  function drop(ary, n = 1) {
    if (n >= ary.length) {
      return []
    }
    let result = []
    if (n == 0) {
      for (let i = 0; i < ary.length; i++) {
        result.push(ary[i])
      }
    } else {
      for (let i = n; i < ary.length; i++) {
        result.push(ary[i])
      }
    }
    return result
  }

  function dropWhile(ary, predicate = identity) {
    predicate = iteratee(predicate)
    for (var i = 0; i < ary.length; i++) {
      if (!predicate(ary[i])) {
        break
      }
    }
    return ary.slice(i)
  }

  function dropRight(ary, n = 1) {
    if (n >= ary.length) {
      return []
    }
    let result = []
    if (n == 0) {
      return ary
    } else {
      for (let i = 0; i < ary.length - n; i++) {
        result.push(ary[i])
      }
    }
    return result
  }

  function dropRightWhile(ary, predicate = identity) {
    predicate = iteratee(predicate)
    for (var i = ary.length - 1; i >= 0; i--) {
      if (!predicate(ary[i])) {
        break
      }
    }
    return ary.slice(0, i + 1)
  }

  function reverse(ary) {
    let result = []
    for (let i = ary.length - 1; i >= 0; i--) {
      result.push(ary[i])
    }
    return result
  }

  function max(ary) {
    if (ary == []) { return undefined }
    let max = ary[0]
    for (let i = 1; i < ary.length; i++) {
      max >= ary[i] ? max : max = ary[i]
    }
    return max
  }

  function maxBy(ary, item = identity) {
    item = iteratee(item)
    let max = item(ary[0])
    let res = ary[0]
    for (let i = 1; i < ary.length; i++) {
      if (item(ary[i]) > max) {
        max = item(ary[i])
        res = ary[i]
      }
    }
    return res
  }

  function min(ary) {
    if (ary == []) { return undefined }
    let min = ary[0]
    for (let i = 1; i < ary.length; i++) {
      min <= ary[i] ? min : min = ary[i]
    }
    return min
  }

  function minBy(ary, item) {
    item = iteratee(item)
    let min = item(ary[0])
    let res = ary[0]
    for (let i = 1; i < ary.length; i++) {
      if (item(ary[i]) < min) {
        min = item(ary[i])
        res = ary[i]
      }
    }
    return res
  }

  function sum(ary) {
    if (ary == []) { return undefined }
    let sum = ary[0]
    for (let i = 1; i < ary.length; i++) {
      sum += ary[i]
    }
    return sum
  }

  function chunk(ary, size = 1) {
    let res = []
    while (ary.length != 0) {
      let cache = []
      for (let i = 0; i < size; i++) {
        if (ary.length == 0) { break }
        cache.push(ary.shift())
      }
      res.push(cache)
    }
    return res
  }

  function difference(ary, ...vals) {
    let res = []
    let val = []
    for (let i = 0; i < vals.length; i++) {
      val.push(...vals[i])
    }
    for (let i = 0; i < val.length; i++) {
      for (let j = 0; j < ary.length; j++) {
        if (ary[j] == val[i]) {
          ary[j] = undefined
        }
      }
    }
    for (let k = 0; k < ary.length; k++) {
      if (ary[k] != undefined) {
        res.push(ary[k])
      }
    }
    return res
  }

  function differenceBy(ary, ...val) {
    let res = []
    let itee
    let valcopy
    let str
    if (typeJudge(val[val.length - 1]) == "[object String]") {
      str = val[val.length - 1]
      for (let i = 0; i < ary.length; i++) {
        if (flattenDeep(val.slice(0, val.length - 1))[0][str] !== ary[i][str]) {
          res.push(ary[i])
        }
      }
      return res
    } else
      if (typeJudge(val[val.length - 1]) == "[object Array]") {
        itee = identity
        valcopy = flattenDeep(val.slice())
      } else {
        itee = iteratee(val[val.length - 1])
        valcopy = flattenDeep(val.slice(0, val.length - 1))
      }

    let mapary = {}
    let mapval = {}
    for (let i = 0; i < ary.length; i++) {
      mapary[itee(ary[i])] = ary[i];
    }
    for (let i = 0; i < valcopy.length; i++) {
      mapval[itee(valcopy[i])] = valcopy[i];
    }
    for (let key in mapary) {
      if (!(key in mapval)) {
        if (Number(mapary[key]) == NaN) {
          res.push(mapary[key])
        } else {
          res.push(Number(mapary[key]))
        }
      }
    }
    return res
  }

  function differenceWith(ary, val, comparator) {
    let res = []
    str = val[val.length - 1]
    for (let i = 0; i < ary.length; i++) {
      if (!comparator(val[0], ary[i])) {
        res.push(ary[i])
      }
    }
    return res
  }

  function flattenDeep(ary, res = []) {
    if (!Array.isArray(ary)) {
      res.push(ary)
      return
    }
    for (let i = 0; i < ary.length; i++) {
      if (Array.isArray(ary[i])) {
        flattenDeep(ary[i], res)
      } else { res.push(ary[i]) }
    }
    return res
  }

  function flattenDepth(ary, depth = 1, res = []) {
    if (!Array.isArray(ary)) {
      res.push(ary)
      return
    }
    for (let i = 0; i < ary.length; i++) {
      if (Array.isArray(ary[i])) {
        if (depth == 0) {
          res.push(ary[i])
          continue
        }
        depth--
        flattenDepth(ary[i], depth, res)
      } else { res.push(ary[i]) }
    }
    return res
  }

  function filter(collection, predicate = identity, fromIndex = 0) {
    predicate = iteratee(predicate)
    let res = []
    // if (typeJudge(predicate) == "[object Function]") {
    for (let i = 0; i < collection.length; i++) {
      if (predicate(collection[i], i, collection)) {
        res.push(collection[i])
      }
    }
    return res
    // }
    // if (typeJudge(predicate) == "[object Object]") {
    //   for (let i = 0; i < collection.length; i++){
    //     let flag = true
    //     for (let key in predicate) {
    //       if (collection[i][key] !== predicate[key]) {
    //        flag = false
    //      }
    //     }
    //     if (flag == true) {
    //       res.push(collection[i]) 
    //     }

    //   }
    //   return res
    // }

    // if (typeJudge(predicate) == "[object Array]") {
    //   let cache = {}
    //   for (let i = 0; i < predicate.length; i++){
    //       cache[predicate[i]] = predicate[i + 1]
    //       i = i + 1
    //   }
    //   return filter(collection,cache)
    // }

    // if (typeJudge(predicate) == "[object String]") {
    //   let cache = {}
    //   cache[predicate] = true
    //   return filter(collection,cache)
    // }
  }

  function find(collection, predicate = identity, fromIndex = 0) {
    predicate = iteratee(predicate)
    // if (typeJudge(predicate) == "[object Function]") {
    for (let i = 0; i < collection.length; i++) {
      if (predicate(collection[i], i, collection)) {
        return collection[i]
      }
    }
    // }
    // if (typeJudge(predicate) == "[object Object]") {
    //   for (let i = 0; i < collection.length; i++){
    //     let flag = true
    //     for (let key in predicate) {
    //       if (collection[i][key] !== predicate[key]) {
    //        flag = false
    //      }
    //     }
    //     if (flag == true) {
    //       return collection[i]
    //     }

    //   }
    //   return null
    // }

    // if (typeJudge(predicate) == "[object Array]") {
    //   let cache = {}
    //   for (let i = 0; i < predicate.length; i++){
    //       cache[predicate[i]] = predicate[i + 1]
    //       i = i + 1
    //   }
    //   return find(collection,cache)
    // }

    // if (typeJudge(predicate) == "[object String]") {
    //   let cache = {}
    //   cache[predicate] = true
    //   return find(collection,cache)
    // }
  }

  function findLast(collection, predicate = identity, fromIndex = 0) {
    predicate = iteratee(predicate)
    collection = reverse(collection)
    for (let i = 0; i < collection.length; i++) {
      if (predicate(collection[i], i, collection)) {
        return collection[i]
      }
    }
  }

  function toArray(val) {
    if (typeJudge(val) == "[object Object]") {
      let res = []
      for (let key in val) {
        res.push(val[key])
      }
      return res
    }
    if (typeJudge(val) == "[object String]") {
      let res = []
      for (let i = 0; i < val.length; i++) {
        res.push(val[i])
      }
      return res
    }
    if (typeJudge(val) == "[object Number]") { return [] }
    if (typeJudge(val) == "[object Null]") { return [] }

  }

  function forEach(collection, predicate = identity) {
    if (typeJudge(collection) == "[object Object]") {
      let res = {}
      for (let key in collection) {
        predicate(collection[key], key, collection)
        res[key] = collection[key]
      }
      return res
    }
    if (typeJudge(collection) == "[object Array]") {
      let res = []
      for (let i = 0; i < collection.length; i++) {
        predicate(collection[i], i, collection)
        res.push(collection[i])
      }
      return res
    }
  }

  function forEachRight(collection, predicate = identity) {
    for (let i = collection.length - 1; i >= 0; i--) {
      predicate(collection[i], i, collection)

    }
    return collection
  }

  function findIndex(ary, predicate = identity, index = 0) {
    predicate = iteratee(predicate)
    for (let i = index; i < ary.length; i++) {
      if (predicate(ary[i])) {
        return i
      }
    }
    return null
  }

  function findLastIndex(ary, predicate = identity, index = ary.length - 1) {
    predicate = iteratee(predicate)
    for (let i = index; i >= 0; i--) {
      if (predicate(ary[i])) {
        return i
      }
    }
    return null
  }

  function groupBy(ary, iteratee = identity) {
    let res = {}
    let key
    if (typeJudge(iteratee) == "[object String]") {
      for (let i = 0; i < ary.length; i++) {
        key = (ary[i])[iteratee]
        if (key in res) {
          res[key].push(ary[i])
        }
        else {
          let cache = []
          cache.push(ary[i])
          res[key] = cache
        }
      }
    } else {
      for (let i = 0; i < ary.length; i++) {
        key = iteratee(ary[i], i, ary)
        if (key in res) {
          res[key].push(ary[i])
        }
        else {
          let cache = []
          cache.push(ary[i])
          res[key] = cache
        }
      }
    }
    return res
  }

  function map(ary, iteratee = identity) {
    let res = []
    if (typeJudge(iteratee) == "[object String]") {
      for (let i = 0; i < ary.length; i++) {
        if (typeJudge(ary[i]) == "[object Object]") {
          res.push(ary[i][iteratee])
        } else res.push(ary[i][iteratee])
      }
    } else {
      for (let i = 0; i < ary.length; i++) {
        if (typeJudge(ary[i]) == "[object Object]") {
          for (let key in ary[i]) {
            res.push(iteratee(ary[i][key]))
          }
        } else res.push(iteratee(ary[i], i, ary))
      }
    }
    if (typeJudge(ary) == "[object Object]") {
      for (let key in ary) {
        res.push(iteratee(ary[key]))
      }
    }
    return res
  }

  function reduce(collection, iteratee = identity, accumulator) {
    if (typeJudge(collection) == "[object Object]") {
      if (accumulator == undefined) {
        accumulator = {}
      }
      for (let key in collection) {
        accumulator = iteratee(accumulator, collection[key], key, collection)
      }

    }
    if (typeJudge(collection) == "[object Array]") {
      if (accumulator == undefined) {
        accumulator = 0
      }
      for (let i = 0; i < collection.length; i++) {
        accumulator = iteratee(accumulator, collection[i], i, collection)

      }
    }
    return accumulator
  }

  function reduceRight(collection, iteratee = identity, accumulator) {
    if (accumulator == undefined) {
      accumulator = 0
    }
    for (let i = collection.length - 1; i >= 0; i--) {
      accumulator = iteratee(accumulator, collection[i], i, collection)

    }
    return accumulator
  }

  function indexOf(ary, val, fromIndex = 0) {
    if (fromIndex < 0 && fromIndex + ary.length >= 0) {
      for (let i = ary.length - 1; i >= fromIndex; i--) {
        if (ary[i] == val) {
          return i
        }
      }
    } else {
      for (let i = fromIndex; i < ary.length; i++) {
        if (ary[i] == val) {
          return i
        }
      }
    }
    return -1
  }

  function sortedIndex(ary, val) {
    let left = 0
    let right = ary.length
    while (left < right) {
      let mid = (left + right) >>> 1
      if (ary[mid] < val) {
        left = mid + 1
      } else {
        right = mid
      }
    }
    return right
  }

  function sortedIndexBy(ary, val, itee = identity) {
    itee = iteratee(itee)
    let left = 0
    let right = ary.length
    while (left < right) {
      let mid = (left + right) >>> 1
      if (itee(ary[mid]) < val) {
        left = mid + 1
      } else {
        right = mid
      }
    }
    return right
  }

  function sortedIndexOf(ary, val) {
    let left = 0
    let right = ary.length - 1
    while (right > left) {
      let mid = (right + left >>> 1)
      if (ary[mid] < val) {
        left = mid + 1
      } else {
        right = mid
      }
    }
    if (ary[left] === val) {
      return left
    }
    return -1
  }

  function sortedLastIndex(ary, val) {
    let left = 0
    let right = ary.length
    while (left < right) {
      let mid = (left + right) >>> 1
      if (ary[mid] <= val) {
        left = mid + 1
      } else {
        right = mid
      }
    }
    return right
  }

  function sortedLastIndexBy(ary, val, itee = identity) {
    itee = iteratee(itee)
    let left = 0
    let right = ary.length
    while (left < right) {
      let mid = (left + right) >>> 1
      if (itee(ary[mid]) <= val) {
        left = mid + 1
      } else {
        right = mid
      }
    }
    return right + 1
  }

  function sortedLastIndexOf(ary, val) {
    let index = sortedLastIndex(ary, val)
    if (ary[index - 1] === val) {
      return index - 1
    }
    return -1
  }

  function intersection(...args) {
    let map = {}
    let res = []
    for (let ary of args) {
      for (let i = 0; i < ary.length; i++) {
        map[ary[i]] = (~~map[ary[i]]) + 1
      }
    }
    for (let key in map) {
      if (map[key] == args.length) {
        res.push(Number(key))
      }
    }
    return res
  }

  function intersectionBy(ary, ...args) {
    let res = []
    let itee = iteratee(args[args.length - 1])
    let valcopy = flattenDeep(args.slice(0, args.length - 1))
    let mapary = {}
    let mapval = {}
    if (typeJudge(args[args.length - 1]) == "[object String]") {
      str = args[args.length - 1]
      for (let i = 0; i < args.length; i++) {
        if (valcopy[i][str] == ary[0][str]) {
          res.push(ary[0])
        }
      }
      return res
    }
    for (let i = 0; i < ary.length; i++) {
      mapary[itee(ary[i])] = ary[i];
    }
    for (let i = 0; i < valcopy.length; i++) {
      mapval[itee(valcopy[i])] = valcopy[i];
    }
    for (let key in mapary) {
      if (key in mapval) {
        if (Number(mapary[key]) == NaN) {
          res.push(mapary[key])
        } else {
          res.push(Number(mapary[key]))
        }
      }
    }
    return res
  }

  function intersectionWith(ary, val, comparator) {
    let res = []
    str = val[val.length - 1]
    for (let i = 0; i < ary.length; i++) {
      if (comparator(val[1], ary[i])) {
        res.push(ary[i])
      }
    }
    return res
  }

  function pull(ary, ...vals) {
    while (vals[0] !== undefined) {
      let same = vals.shift()
      for (let i = 0; i < ary.length; i++) {
        if (ary[i] == same) {
          ary.splice(i, 1)
          i--
        }
      }
    }
    return ary
  }

  function pullAll(ary, vals) {
    while (vals[0] !== undefined) {
      let same = vals.shift()
      for (let i = 0; i < ary.length; i++) {
        if (ary[i] == same) {
          ary.splice(i, 1)
          i--
        }
      }
    }
    return ary
  }

  function pullAllBy(ary, vals, itee = identity) {
    itee = iteratee(itee)
    while (vals[0] !== undefined) {
      let same = itee(vals.shift())
      for (let i = 0; i < ary.length; i++) {
        if (itee(ary[i]) == same) {
          ary.splice(i, 1)
          i--
        }
      }
    }
    return ary
  }

  function pullAllWith(ary, vals, itee = identity) {
    itee = iteratee(itee)
    while (vals[0] !== undefined) {
      let same = vals.shift()
      for (let i = 0; i < ary.length; i++) {
        if (itee(same, ary[i])) {
          ary.splice(i, 1)
          i--
        }
      }
    }
    return ary
  }

  function union(...arys) {
    return [...new Set(flattenDeep([...arys]))]
    let map = {}
    let res = []
    for (let i = 0; i < ary.length; i++) {
      for (let j = 0; j < ary[i].length; j++) {
        map[ary[i][j]] = 1
      }
    }
    for (let key in map) {
      res.push(Number(key))
    }
    return res
  }

  function unionBy(...arys) {
    itee = iteratee(arys[arys.length - 1])
    let ary = flattenDeep(arys.slice(0, arys.length - 1))
    let set = new Set()
    let res = []
    for (let i = 0; i < ary.length; i++) {
      if (set.has(itee(ary[i]))) {
        continue
      }
      res.push(ary[i])
      set.add(itee(ary[i]))
    }
    return res
  }

  function unionWith(obj, ...arys) {
    itee = iteratee(arys[arys.length - 1])
    let ary = flattenDeep(arys.slice(0, arys.length - 1))
    let res = obj
    for (let i = 0; i < obj.length; i++) {
      for (let j = 0; j < ary.length; j++) {
        if (!itee(obj[i], ary[j])) {
          res.push(ary[j])
          ary.splice(j - 1, 1)
        }
        ary.splice(j - 1, 1)
      }
    }
    return res
  }

  function zip(...ary) {
    let res = []
    for (let j = 0; j < ary[0].length; j++) {
      let item = []
      item.push(ary[0][j])
      res.push(item)
    }
    for (let i = 1; i < ary.length; i++) {
      for (let j = 0; j < ary[i].length; j++) {
        res[j].push(ary[i][j])
      }
    }
    return res
  }

  function zipObject(ary = [], val = []) {
    let res = {}
    for (let i = 0; i < ary.length; i++) {
      res[ary[i]] = val[i]
    }
    return res
  }

  function zipObjectDeep(ary = [], val = []) {
    let path = []
    for (let i = 0; i < ary.length; i++) {
      const element = ary[i];
      path.push(toPath(ary[i]))
    }
    let cache = []
    let cache2 = {}
    for (let i = 0; i < path.length; i++) {
      cache2[path[i][path[i].length - 1]] = val[i]
      cache.push(deepCopy(cache2))
      cache2 = {}
    }
    let cache3 = {}
    for (let i = 0; i < path.length; i++) {
      cache3[path[i][1]] = cache
    }
    let res = {}
    for (let i = 0; i < path.length; i++) {
      res[path[i][0]] = cache3
    }
    return res
  }

  function unzip(ary) {
    let res = []

    for (let i = 0; i < ary[0].length; i++) {
      let item = []
      item.push(ary[0][i])
      res.push(item)
    }

    for (let i = 1; i < ary.length; i++) {
      for (let j = 0; j < ary[i].length; j++) {
        res[j].push(ary[i][j])
      }
    }
    return res
  }

  function unzipWith(ary, itee = identity) {
    let res = []
    for (let i = 0; i < ary[0].length; i++) {
      let cache = []
      for (let item of ary) {
        cache.push(item[i])
      }
      res.push(itee(...cache))
    }
    return res
  }

  function zipWith(...arys) {
    let itee = arys[arys.length - 1]
    let ary = arys.slice(0, arys.length - 1)
    let num = ary[0].length
    let cache = []
    let res = []
    for (let i = 0; i < num; i++) {
      for (let j = 0; j < ary.length; j++) {
        cache.push(ary[j][i])
      }
    }
    res.push(itee(...cache.slice(0, cache.length / 2)))
    res.push(itee(...cache.slice(cache.length / 2)))
    return res
  }

  function add(augend, addend) {
    return augend + addend
  }

  function without(ary, ...val) {
    for (let i = 0; i < val.length; i++) {
      for (let j = 0; j < ary.length; j++) {
        if (ary[j] == val[i]) {
          ary.splice(j, 1)
          j--
        }
      }
    }
    return ary
  }

  function xor(...ary) {
    let res = []
    let map = {}
    for (let i = 0; i < ary.length; i++) {
      for (let j = 0; j < ary[i].length; j++) {
        map[ary[i][j]] = (~~map[ary[i][j]]) + 1
      }
    }
    for (let key in map) {
      if (map[key] == 1) {
        res.push(Number(key))
      }
    }
    return res
  }

  function xorBy(...ary) {
    return d(...ary)
    function d(ary, ...val) {
      let res = []
      let itee
      let valcopy
      let str
      if (typeJudge(val[val.length - 1]) == "[object String]") {
        str = val[val.length - 1]
        for (let i = 0; i < val.length; i++) {
          if (flattenDeep(ary.slice(0, val.length - 1))[0][str] !== val[i][str]) {
            res.push(val[i][0])
          }
        }
        return [res[0]]
      } else
        if (typeJudge(val[val.length - 1]) == "[object Array]") {
          itee = identity
          valcopy = flattenDeep(val.slice())
        } else {
          itee = iteratee(val[val.length - 1])
          valcopy = flattenDeep(val.slice(0, val.length - 1))
        }

      let mapary = {}
      let mapval = {}
      for (let i = 0; i < ary.length; i++) {
        mapary[itee(ary[i])] = ary[i];
      }
      for (let i = 0; i < valcopy.length; i++) {
        mapval[itee(valcopy[i])] = valcopy[i];
      }
      for (let key in mapary) {
        if (!(key in mapval)) {
          if (Number(mapary[key]) == NaN) {
            res.push(mapary[key])
          } else {
            res.push(Number(mapary[key]))
          }
        }
      }
      for (let key in mapval) {
        if (!(key in mapary)) {
          if (Number(mapval[key]) == NaN) {
            res.push(mapval[key])
          } else {
            res.push(Number(mapval[key]))
          }
        }
      }
      return res
    }
  }

  function xorWith(ary, val, comparator) {
    let res = []
    str = val[val.length - 1]
    for (let i = 0; i < ary.length; i++) {
      if (!comparator(val[1], ary[i])) {
        res.push(ary[i])
        res.push(val[0])
      }
    }
    return res
  }

  function countBy(collection, itee = identity) {
    itee = iteratee(itee)
    let map = {}
    for (let i = 0; i < collection.length; i++) {
      map[itee(collection[i])] = (~~map[itee(collection[i])]) + 1
    }
    return map
    // let map = new Map()
    // for (let i = 0; i < collection.length; i++) {
    //   if (map.get(itee(collection[i])) == undefined) {
    //     map.set(itee(collection[i]), 1)
    //   } else (map.set(itee(collection[i]), map.get(itee(collection[i])) + 1))
    // }
    // return map
  }

  function every(collection, predicate = identity) {
    predicate = iteratee(predicate)
    for (let i = 0; i < collection.length; i++) {
      if (!predicate(collection[i])) return false
    }
    return true
  }

  function flatMap(collection, itee = identity) {
    itee = iteratee(itee)
    let res = []
    for (let i = 0; i < collection.length; i++) {
      res.push(itee(collection[i]))
    }
    return res = flattenDeep(res)
  }

  function flatMapDeep(collection, itee = identity) {
    itee = iteratee(itee)
    let res = []
    for (let i = 0; i < collection.length; i++) {
      res.push(itee(collection[i]))
    }
    return res = flattenDeep(res)
  }

  function flatMapDepth(collection, itee = identity, depth = 1) {
    itee = iteratee(itee)
    let res = []
    for (let i = 0; i < collection.length; i++) {
      res.push(flattenDepth(itee(collection[i]), depth))
    }
    return res
  }

  function keyBy(collection, itee = identity) {
    itee = iteratee(itee)
    let res = {}
    for (let i = 0; i < collection.length; i++) {
      res[itee(collection[i])] = collection[i]
    }
    return res
  }

  function partition(collection, predicate = identity) {
    predicate = iteratee(predicate)
    let res = []
    let t = []
    let f = []
    if (typeJudge(collection) == "[object Object]") {
      for (let key in collection) {
        if (predicate(collection[key]) == true) {
          t.push(collection[key])
        }
        if (predicate(collection[key]) == false) {
          f.push(collection[key])
        }
      }
    }

    if (typeJudge(collection) == "[object Array]") {
      for (let i = 0; i < collection.length; i++) {
        if (predicate(collection[i]) == true) {
          t.push(collection[i])
        }
        if (predicate(collection[i]) == false) {
          f.push(collection[i])
        }
      }
    }
    res.push(t)
    res.push(f)
    return res
  }

  function reject(collection, predicate = identity) {
    predicate = iteratee(predicate)
    let res = []
    for (let i = 0; i < collection.length; i++) {
      if (predicate(collection[i]) == false) {
        res.push(collection[i])
      }
    }
    return res
  }

  function sample(collection) {
    return collection[Math.floor(Math.random() * collection.length)]
  }

  function sampleSize(collection, n = 1) {
    let res = []

    while (n !== res.length && collection.length !== 0) {
      res.push(...collection.splice(Math.floor(Math.random() * collection.length), 1))
    }

    return res
  }

  function shuffle(collection) {
    return sampleSize(collection, collection.length);
  }

  function size(collection) {
    if (typeof collection == "object") {
      let count = 0
      for (let key in collection) {
        count++
      }
      return count
    } else {
      return collection.length
    }
  }

  function some(collection, predicate = identity) {
    predicate = iteratee(predicate)
    if (typeof collection == "object") {
      for (let key in collection) {
        if (predicate(collection[key]) == true) {
          return true
        }
      }
    } else {
      for (let i = 0; i < collection.length; i++) {
        if (predicate(collection[i]) == true) {
          return true
        }
      }
    }
    return false
  }

  function ary(func, n = func.length) {
    return function (...args) {
      return func(...args.slice(0, n))
    }
  }

  function before(n, func) {
    let count = 0
    let res
    return function (...args) {
      if (count < n) {
        return res = func.call(this, ...args)
        count++
      } else {
        return res
      }
    }
  }

  function after(n, func) {
    let count = 0
    return function (...args) {
      count++
      if (count > n) {
        return res = func.call(this, ...args)
      }
    }
  }

  function flip(func) {
    return function (...args) {
      return func(...args.reverse())
    }
  }

  function negate(predicate) {
    return function (...args) {
      return !predicate(...args)
    }
  }

  function spread(func, start = 0) {
    return function (args) {
      return func.apply(this, args)
    }
  }

  function isBoolean(val) {
    return typeJudge(val) == "[object Boolean]"
  }
  function isFunction(val) {
    return typeJudge(val) == "[object Function]"
  }
  function isObject(val) {
    return typeJudge(val) == "[object Object]" || typeJudge(val) == "[object Array]" || typeJudge(val) == "[object Function]"
  }
  function isArray(val) {
    return typeJudge(val) == "[object Array]"
  }
  function isNumber(val) {
    return typeJudge(val) == "[object Number]"
  }
  function isString(val) {
    return typeJudge(val) == "[object String]"
  }
  function isNull(val) {
    return typeJudge(val) == "[object Null]"
  }
  function isNull(val) {
    return typeJudge(val) == "[object Null]"
  }
  function isNil(val) {
    return typeJudge(val) == "[object Undefined]" || typeJudge(val) == "[object Null]"
  }
  function isNaN(val) {
    if (typeJudge(val) == "[object Number]") {
      val = val.valueOf()
    }
    return val !== val
  }
  function isElement(val) {
    return typeJudge(val) == "[object HTMLBodyElement]"
  }
  function isDate(val) {
    return typeJudge(val) == "[object Date]"
  }
  function isArguments(value) {
    return typeJudge(value) == "[object Arguments]"
  }
  function isArrayBuffer(value) {
    return typeJudge(value) === "[object ArrayBuffer]"
  }
  function isError(value) {
    return typeJudge(value) == "[object Error]"
  }
  function isFinite(value) {
    if (typeJudge(value) !== "[object Number]" || value == Infinity || value == -Infinity) {
      return false
    }
    return true
  }
  function isRegExp(value) {
    return typeJudge(value) === "[object RegExp]"
  }
  function isUndefined(value) {
    return typeJudge(value) === "[object Undefined]"
  }
  // function isMatch(object, source) {
  //   for (let key in object) {
  //     if (typeJudge(object[key]) == "[object Object]") {
  //       if (isMatch(object[key], source)) {
  //         return true
  //       }
  //     }
  //     if (source[key] && object[key] == source[key]) {
  //       return true
  //     }
  //   }
  //   return false
  // }

  function noop() { }

  function defaultStatus(object, ...sources) {
    for (let i = 0; i < sources.length; i++) {
      for (let key in sources[i]) {
        if (key in object) {
        } else {
          object[key] = sources[i][key]
        }
      }
    }
    return object
  }

  function findKey(object, predicate = identity) {
    predicate = iteratee(predicate)
    for (key in object) {
      if (predicate(object[key]) == true) {
        return key
      }
    }
    return undefined
  }

  function findLastKey(object, predicate = identity) {
    predicate = iteratee(predicate)
    let cache = []
    let cacheobj = {}
    for (let key in object) {
      cache.push(object[key])
      cache.push(key)
    }
    for (let i = cache.length - 1; i >= 0; i--) {
      cacheobj[cache[i]] = cache[i - 1]
      i--
    }
    return findKey(cacheobj, predicate)
  }

  function forIn(object, itee = identity) {
    for (let key in object) {
      if (itee(object[key], key, object) == false) {
        break
      }
    }
    return object
  }

  function forInRight(object, itee = identity) {
    let cache = []
    let cacheobj = {}
    for (let key in object) {
      cache.push(object[key])
      cache.push(key)
    }
    for (let i = cache.length - 1; i >= 0; i--) {
      cacheobj[cache[i]] = cache[i - 1]
      i--
    }
    for (let key in cacheobj) {
      if (itee(cacheobj[key], key, cacheobj) == false) {
        break
      }
    }
    return object
  }

  function forOwn(object, itee = identity) {
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        if (itee(object[key], key, object) == false) {
          break
        }
      }
    }
    return object
  }

  function forOwnRight(object, itee = identity) {
    let cache = []
    let cacheobj = {}
    for (let key in object) {
      cache.push(object[key])
      cache.push(key)
    }
    for (let i = cache.length - 1; i >= 0; i--) {
      cacheobj[cache[i]] = cache[i - 1]
      i--
    }
    for (let key in cacheobj) {
      if (object.hasOwnProperty(key)) {
        if (itee(cacheobj[key], key, cacheobj) == false) {
          break
        }
      }
    }
    return object
  }

  function functions(object) {
    let res = []
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        res.push(key)
      }
    }
    return res
  }

  function curry(func, length = func.length) {
    return function (...args) {
      if (args.length < length) {
        return curry(func.bind(null, ...args), length - args.length)
      } else {
        return func(...args)
      }
    }
  }

  function toPath(value) {
    return value.match(/\w+/g)
    let cache = val.split(/\[|\]|\./)
    let res = []
    for (let i = 0; i < cache.length; i++) {
      if (cache[i] != "") {
        res.push(cache[i])
      }
    }
    return res
  }

  function invert(object) {
    let reverse = {}
    for (let key in object) {
      reverse[object[key]] = key
    }
    return reverse
  }

  function invertBy(object, iteratee = identity) {
    let reverse = {}
    for (let key in object) {
      if (iteratee(object[key]) in reverse) {
        reverse[iteratee(object[key])].push(key)
      } else {
        reverse[iteratee(object[key])] = new Array(1).fill(key)
      }
    }
    return reverse
  }

  function create(prototype, properties) {
    let c = properties.constructor
    return c.prototype = prototype
  }

  function has(object, path) {
    let obj = deepCopy(object)
    if (typeJudge(path) == "[object String]") {
      path = toPath(path)
    }
    for (let i = 0; i < path.length; i++) {
      if (!(obj[path[i]])) {
        return false
      }
      if (path.length > 1) {
        obj = obj[path[i]]
      }
    }
    return true
  }

  function hasIn(object, path) {
    let obj = deepCopy(object)
    if (typeJudge(path) == "[object String]") {
      path = toPath(path)
    }
    for (let i = 0; i < path.length; i++) {
      if (!(obj[path[i]])) {
        return false
      }
      if (path.length > 1) {
        obj = obj[path[i]]
      }
    }
    return true
  }

  function deepCopy(obj) {
    let result
    let type = typeJudge(obj);

    if (type == "[object Object]") result = {}; //判断传入的如果是对象，继续遍历
    else if (type == "[object Array]") result = []; //判断传入的如果是数组，继续遍历
    else return obj; //如果是基本数据类型就直接返回

    for (let key in obj) {
      if (!((obj).hasOwnProperty(key))) {
        break
      }
      let copy = obj[key];
      if (typeJudge(copy) == "[object Object]") result[key] = deepCopy(copy); //递归方法 ，如果对象继续变量obj[key],下一级还是对象，就obj[key][key]
      else if (typeJudge(copy) == "[object Array]") result[key] = deepCopy(copy); //递归方法 ，如果对象继续数组obj[key],下一级还是数组，就obj[key][key]
      else result[key] = copy; //基本数据类型则赋值给属性
    }

    return result;
  }

  function isEqual(value, other) {
    if (typeJudge(value) !== typeJudge(other)) {
      return false
    }
    if (typeJudge(value) == "[object Object]") {
      if (Object.getOwnPropertyNames(value).length !== Object.getOwnPropertyNames(other).length) {
        return false
      }
      for (let key in value) {
        if (other[key] == undefined) {
          return false
        }
        if (!(isEqual(value[key], other[key]))) {
          return false
        }
      }
    } else if (typeJudge(value) == "[object Array]") {
      if (value.length !== other.length) {
        return false
      }
      for (let i = 0; i < value.length; i++) {
        if (other[i] == undefined) {
          return false
        }
        if (!(isEqual(value[i], other[i]))) {
          return false
        }
      }
    } else {
      if (value !== other) {
        return false
      }
    }
    return true
  }

  function isEmpty(value) {
    if (typeJudge(value) == "[object Object]") {
      if (Object.getOwnPropertyNames(value).length > 0) {
        return false
      }
    }
    else if (typeJudge(value) == "[object Array]") {
      if (value.length > 0) {
        return false
      }
    }
    else if (typeJudge(value) == "[object String]") {
      if (value.length > 0) {
        return false
      }
    }
    return true
  }

  function round(number, precision = 0) {
    if (precision == 0) {
      return Math.round(number)
    }
    return Math.round(number * (10 ** precision)) / 10 ** precision

  }

  function subtract(minuend, subtrahend) {
    return minuend - subtrahend;
  }

  function assignIn(object, ...sources) {
    for (let i = 0; i < sources.length; i++) {
      for (let key in sources[i]) {
        object[key] = sources[i][key]
      }
    }
    return object
  }

  function assign(object, ...sources) {
    for (let i = 0; i < sources.length; i++) {
      for (let key in sources[i]) {
        if (sources[i].hasOwnProperty(key)) {
          object[key] = sources[i][key]
        } else {
          object.__proto__[key] = sources[i][key]
        }
      }
    }
    return object
  }

  function defaults(object, ...sources) {
    for (let i = 0; i < sources.length; i++) {
      for (let key in sources[i]) {
        if (object[key]) { continue }
        if (sources[i].hasOwnProperty(key)) {
          object[key] = sources[i][key]
        } else {
          object.__proto__[key] = sources[i][key]
        }
      }
    }
    return object
  }

  function defaultsDeep(object, ...sources) {
    for (let i = 0; i < sources.length; i++) {
      for (let key in sources[i]) {
        if (typeJudge(sources[i][key]) == "[object Object]" && typeJudge(object[key]) == "[object Object]") {
          defaultsDeep(object[key], sources[i][key])
        }
        if (object[key]) { continue }
        if (sources[i].hasOwnProperty(key)) {
          object[key] = sources[i][key]
        } else {
          object.__proto__[key] = sources[i][key]
        }
      }
    }
    return object
  }

  function invoke(object, path, ...args) {
    path = toPath(path)
    let obj = deepCopy(object)
    for (let i = 0; i < path.length - 1; i++) {
      if (obj[path[i]]) { obj = obj[path[i]] }
    }
    return obj[path[path.length - 1]](...args)
  }

  function keys(object) {
    let keyAry = []
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        keyAry.push(key)
      }
    }
    return keyAry
  }

  function keysIn(object) {
    let keyAry = []
    for (let key in object) {
      keyAry.push(key)
    }
    return keyAry
  }

  function mapKeys(object, iteratee = identity) {
    let mapkey = {}
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        mapkey[iteratee(object[key], key)] = object[key]
      }
    }
    return mapkey
  }

  function mapValues(object, itee = identity) {
    itee = iteratee(itee)
    let mapval = {}
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        mapval[key] = itee(object[key])
      }
    }
    return mapval
  }

  function nth(ary, n = 0) {
    let num = n
    if (n >= 0) {
      for (let i = 0; i < ary.length; i++) {
        if (i == n) {
          return ary[i];
        }
      }
    } else {
      for (let i = ary.length - 1; i > 0; i--) {
        num++
        if (num == 0) {
          return ary[i]
        }
      }
    }
  }

  function sortedUniq(ary) {
    let res = []
    let map = {}
    for (let i = 0; i < ary.length; i++) {
      map[ary[i]] = (~~map[ary[i]]) + 1
    }
    for (let key in map) {
      res.push(Number(key))
    }
    return res
  }

  function sortedUniqBy(ary, itee = identity) {
    let res = []
    let map = {}
    for (let i = 0; i < ary.length; i++) {
      if (itee(ary[i]) in map) {
        continue
      } else {
        map[itee(ary[i])] = [ary[i]]
      }
    }
    for (let key in map) {
      res.push(Number(map[key]))
    }
    return res
  }

  function tail(ary) {
    return ary.slice(1)
  }

  function take(ary, n = 1) {
    return ary.slice(0, n)
  }

  function takeRight(ary, n = 1) {
    if (n == 0) { return [] }
    return ary.slice(-n)
  }

  function takeRightWhile(ary, predicate = identity) {
    predicate = iteratee(predicate)
    let res = []
    for (let i = ary.length - 1; i >= 0; i--) {
      if (!predicate(ary[i], i, ary)) {
        break
      }
      res.push(ary[i])
    }
    return reverse(res)
  }

  function takeWhile(ary, predicate = identity) {
    predicate = iteratee(predicate)
    let res = []
    for (let i = 0; i < ary.length; i++) {
      if (!predicate(ary[i], i, ary)) {
        break
      }
      res.push(ary[i])
    }
    return res
  }

  function uniq(ary) {
    return union(ary)
  }

  function uniqBy(...ary) {
    return unionBy(...ary)
  }

  function uniqWith(...arys) {
    itee = iteratee(arys[arys.length - 1])
    let ary = flattenDeep(arys.slice(0, arys.length - 1))
    let res = []
    for (let i = 0; i < ary.length; i++) {
      for (let j = i + 1; j < ary.length; j++) {
        if (!itee(ary[i], ary[j])) {
          res.push(ary[i])
          res.push(ary[j])
        }
      }
      return res
    }
  }

  function includes(collection, val, Idx = 0) {
    if (typeJudge(collection) == "[object Array]") {
      if (Idx >= 0) {
        for (let i = Idx; i < collection.length; i++) {
          if (collection[i] == val) {
            return true
          }
        }
      } else {
        for (let i = collection.length - Idx; i >= 0; i--) {
          if (collection[i] == val) {
            return true
          }
        }
      }

    }
    if (typeJudge(collection) == "[object Object]") {
      for (let key in collection) {
        if (collection[key] == val) {
          return true
        }
      }
    }
    if (typeJudge(collection) == "[object String]") {
      let reg = new RegExp(val)
      return reg.test(collection)
    }
    return false
  }

  function invokeMap(collection, path, ...args) {
    let res = []
    for (let i = 0; i < collection.length; i++) {
      if (typeof path == "string") {

        res.push(collection[i][path]())
      } else {
        res.push(path.call(collection[i], ...args))
      }
    }
    return res
  }

  function floor(number, precision = 0) {
    if (precision == 0) {
      return Math.floor(number)
    }
    return Math.floor(number * (10 ** precision)) / 10 ** precision
  }

  function castArray(val = []) {
    if (val == null) {
      return [null]
    }
    if (val == undefined) {
      return [undefined]
    }
    if (Array.isArray(val)) {
      return val
    } else {
      return [val]
    }
  }

  function conformsTo(object, source) {
    for (let key in source) {
      return source[key](object[key])
    }
  }

  function eq(value, other) {
    if (isNaN(value) && isNaN(other)) {
      return true
    } else
      return value === other
  }

  function gt(value, other) {
    return value > other
  }
  function gte(value, other) {
    return value >= other
  }
  function isArrayLike(value) {
    return typeof value !== "function" && value.length % 1 == 0 && value.length < Number.MAX_SAFE_INTEGER
  }
  function isArrayLikeObject(value) {
    return typeof value == "object" && value.length % 1 == 0 && value.length < Number.MAX_SAFE_INTEGER
  }

  function isInteger(value) {
    return typeof value == "number" && value % 1 == 0
  }
  function isLength(value) {
    return isInteger(value)
  }

  function isMap(value) {
    return value instanceof Map
  }

  function isNative(value = "") {
    return /\[native code]/.test(value.toString())
  }

  function isObjectLike(value) {
    return value !== null && typeof value == "object"
  }

  function isPlainObject(value) {
    let val = value
    return typeJudge(val) == "[object Object]" && val.__proto__ == Object.prototype
  }

  function isSafeInteger(value) {
    return isInteger(value)
  }

  function isSet(value) {
    return typeJudge(value) == "[object Set]";
  }

  function isSymbol(value) {
    return typeJudge(value) == "[object Symbol]";
  }
  function isTypedArray(value) {
    return typeJudge(value) == "[object Uint8Array]";
  }
  function isWeakMap(value) {
    return typeJudge(value) == "[object WeakMap]";
  }
  function isWeakSet(value) {
    return typeJudge(value) == "[object WeakSet]";
  }
  function lt(value, other) {
    return value < other;
  }
  function lte(value, other) {
    return value <= other;
  }
  function toFinite(value) {
    if (isNaN(value)) {
      return NaN
    }
    if (value === Infinity) {
      return Number.MAX_VALUE
    } else if (value === -Infinity) {
      return -Number.MAX_VALUE
    } else {
      return Number(value)
    }
  }
  function toInteger(value) {
    let val = toFinite(value)
    return Math.floor(val)
  }

  function toLength(value) {
    if (value == Infinity || value == -Infinity) {
      return 4294967295
    } else {
      return toInteger(value)
    }
  }

  function toNumber(value) {
    return Number(value)
  }

  function toSafeInteger(value) {
    if (value == Infinity) {
      return Number.MAX_SAFE_INTEGER
    } else
      return toInteger(value)
  }

  function ceil(number, precision = 0) {
    return Math.ceil(number * (10 ** precision)) / (10 ** precision)
  }

  function divide(dividend, divisor) {
    return dividend / divisor
  }

  function mean(array) {
    return array.reduce((res, item, idx) => (res * idx + item) / (idx + 1))
  }

  function meanBy(array, itee) {
    itee = iteratee(itee)
    return array.reduce((res, item, idx) => (res * idx + itee(item)) / (idx + 1), 0)
  }

  function multiply(multiplier, multiplicand) {
    return multiplier * multiplicand
  }

  function sumBy(array, itee) {
    itee = iteratee(itee)
    return array.reduce((sum, it) => sum + itee(it), 0)
  }

  function clamp(number, lower, upper) {
    if (number < lower) {
      return lower;
    } else if (number > upper) {
      return upper;
    } else
      return number;
  }

  function inRange(number, start, end) {
    if (end == undefined) {
      end = start
      start = 0
    }
    if (number > 0) {
      return number > start && number < end
    } else return number < start && number > end
  }

  function constant(value) {
    return function () {
      return value
    }
  }

  function functionsIn(object) {
    let res = [];
    for (let key in object) {
      if (isFunction(object[key])) {
        res.push(key);
      }
    }
    return res;
  }

  function times(n, itee = identity) {
    itee = iteratee(itee)
    let res = []
    for (let i = 0; i < n; i++) {
      res.push(itee(i))
    }
    return res
  }

  function at(object, paths) {
    let path = []
    let res = []

    for (let i = 0; i < paths.length; i++) {
      path.push(toPath(paths[i]))
    }

    for (let i = 0; i < path.length; i++) {
      let obj = deepCopy(object)
      for (let j = 0; j < path[i].length; j++) {
        obj = obj[path[i][j]];
      }
      res.push(obj)
    }
    return res
  }

  function deburr(str) {
    str = re(str)
    return str
  }

  function omit(object, ary) {
    let res = {}
    let flag = false
    for (let key in object) {
      for (let i = 0; i < ary.length; i++) {
        if (ary[i] == key) {
          flag = true
          break
        }
      }
      if (flag == false) {
        res[key] = object[key]
      }
      flag = false
    }
    return res
  }

  function omitBy(object, predicate = identity) {
    let res = {}
    for (let key in object) {
      if (predicate(object[key]) == false) {
        res[key] = object[key]
      }
    }
    return res
  }

  function pick(object, props) {
    let res = {}
    for (let key of props) {
      if (object[key] !== undefined) {
        res[key] = object[key]
      }
    }
    return res
  }

  function pickBy(object, predicate = identity) {
    let res = {}
    for (let key in object) {
      if (predicate(object[key])) {
        res[key] = object[key]
      }
    }
    return res
  }

  function result(object, path, defaultValue) {
    let res = get(object, path, defaultValue)
    if (typeJudge(res) === "[object Function]") {
      return res.bind(null)()
    }
    return res
  }

  function set(object, path, value) {
    let obj = object
    if (!Array.isArray(path)) { path = toPath(path) }
    for (var i = 0; i < path.length - 1; i++) {
      if (object[path[i]] == undefined) {
        if (!(isNaN(Number(path[i + 1]))) && i + 1 < path.length - 1) {
          object[path[i]] = []
        } else {
          object[path[i]] = {}
        }
      }
      object = object[path[i]]
    }
    object[path[i]] = value
    return obj
  }

  function setWith(object, path, value, customizer) {
    let obj = object
    if (!Array.isArray(path)) { path = toPath(path) }
    for (var i = 0; i < path.length - 1; i++) {
      if (object[path[i]] == undefined) {
        object[path[i]] = new customizer(object[path[i]], path[i], object)
      }
      object = object[path[i]]
    }
    object[path[i]] = value
    return obj
  }

  function unset(object, path) {
    let obj = object
    if (!Array.isArray(path)) { path = toPath(path) }
    for (var i = 0; i < path.length - 2; i++) {
      if (obj[path[i]] == undefined) {
        return false
      }
      obj = obj[path[i]]
    }
    obj[path[i]] = {}
    return true
  }

  function toPairs(object) {
    let res = []
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        res.push([key, object[key]])
      }
    }
    return res
  }

  function toPairsIn(object) {
    let res = []
    for (let key in object) {
      res.push([key, object[key]])
    }
    return res
  }

  function update(object, path, updater) {
    let obj = object
    if (!Array.isArray(path)) { path = toPath(path) }
    for (var i = 0; i < path.length - 1; i++) {
      if (object[path[i]] == undefined) {
        if (!(isNaN(Number(path[i + 1]))) && i + 1 < path.length - 1) {
          object[path[i]] = []
        } else {
          object[path[i]] = {}
        }
      }
      object = object[path[i]]
    }
    object[path[i]] = updater(object[path[i]])
    return obj
  }

  function updateWith(object, path, value, customizer) {
    let obj = object
    if (!Array.isArray(path)) { path = toPath(path) }
    for (var i = 0; i < path.length - 1; i++) {
      if (object[path[i]] == undefined) {
        object[path[i]] = new customizer(object[path[i]], path[i], object)
      }
      object = object[path[i]]
    }
    object[path[i]] = value(object[path[i]])
    return obj
  }

  function values(object) {
    let res = []
    // if (typeof object == "string") {
    //   return object.split("")
    // }
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        res.push(object[key])
      }
    }
    return res
  }

  function valuesIn(object) {
    let res = []
    for (let key in object) {
      res.push(object[key])
    }
    return res
  }

  function capitalize(string = '') {
    return string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase()
  }

  function endsWith(string = '', target, position = string.length) {
    let cache = string.split("")
    return cache[position - 1] == target
  }

  function escape(string = "") {
    return string.replace(/[\&\>\<\"\']/g, match => {
      switch (match) {
        case "&":
          return '&amp;'
        case '"':
          return '&quot';
        case "'":
          return '&apos;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt';
        default:
          return match;
      }
    });
  }

  function escapeRegExp(string = "") {
    let reg = /[\^\$\.\*\+\,\?\,\(\)\[\]\{\}\|]/g
    return string.replace(reg, match => `\\${match}`)
  }

  function defer(func, ...args) {
    var id = setTimeout(func, 5000, ...args);
    return id - 1
  }

  function delay(func, wait, ...args) {
    var id = setTimeout(func, wait, ...args);
    return id - 1
  }

  function range(start = 0, end, step = 1) {
    let res = []
    if (start == 0 && end == undefined) {
      return res
    }
    if (end == undefined) {
      end = start
      start = 0
    }
    if (step == 0) {
      step
    }
    if (step < 0) {
      step = -step
    }
    res.push(start)
    if (step == 0) {
      end = end - 1
    }
    while (Math.abs(end) > res.length) {
      if (end > 0) {
        start = start + step
      } else {
        start = start - step
      }
      if (end == start) {
        break
      }
      res.push(start)
    }
    return res
  }

  function rangeRight(start = 0, end, step = 1) {
    let res = []
    if (start == 0 && end == undefined) {
      return res
    }
    if (end == undefined) {
      end = start
      start = 0
    }
    if (step == 0) {
      step
    }
    if (step < 0) {
      step = -step
    }
    res.push(start)
    if (step == 0) {
      end = end - 1
    }
    while (Math.abs(end) > res.length) {
      if (end > 0) {
        start = start + step
      } else {
        start = start - step
      }
      if (end == start) {
        break
      }
      res.push(start)
    }
    return reverse(res)
  }

  function defaultTo(value, defaultValue) {
    if (isNaN(value) || value == null || value == undefined) {
      return defaultValue
    } else return value
  }

  function words(string = '', pattern = /[^\W]+/g) {
    return string.match(pattern)
  }

  function unary(func) {
    return ary(func, 1)
  }

  function stringifyJson(json) {
    return JSON.stringify(json)
  }

  function parseJson(json) {
    return JSON.parse(json)
  }

  function cloneDeep(val,) {
    if (isRegExp(val)) {
      return new RegExp(val)
    }
    return deepCopy(val)
  }

  function swap(ary, a, b) {
    let cache = ary[a]
    ary[a] = ary[b]
    ary[b] = cache
  }

  function merge(object, sources) {
    let res = []
    for (let key in sources) {
      res.push(object[key])
      res.push(sources[key])
      res = flattenDepth(res, 2)
      object[key] = [[res[0]], [res[1], res[3]]]
    }
    return object
  }

  function pad(string = '', length = 0, chars = ' ') {
    if (length == string.length) {
      return string
    }
    length = length - string.length
    let cache1 = string.split("")
    let cache2 = chars.split("")
    if (length % 2 == 0) {
      let num2 = length / 2
      let i = 0
      while (i < num2) {
        for (let j = cache2.length - 1; j >= 0; j--) {
          if (i == num2) { break }
          cache1.unshift(cache2[j])
          i++
        }
      }
      i = 0
      while (i < num2) {
        for (let j = 0; j < cache2.length; j++) {
          if (i == num2) { break }
          cache1.push(cache2[j])
          i++
        }
      }
      return cache1.join("")
    } else {
      let num2 = (length - 1) / 2
      let i = 0
      while (i < num2) {
        for (let j = cache2.length - 1; j >= 0; j--) {
          if (i == num2) { break }
          cache1.unshift(cache2[j])
          i++
        }
      }
      i = 0
      while (i < num2 + 1) {
        for (let j = 0; j < cache2.length; j++) {
          if (i == num2 + 1) { break }
          cache1.push(cache2[j])
          i++
        }
      }
      return cache1.join("")
    }
  }

  function padEnd(string = '', length = 0, chars = ' ') {
    if (length == string.length) {
      return string
    }
    length = length - string.length
    let cache1 = string.split("")
    let cache2 = chars.split("")
    let num2 = length
    let i = 0
    while (i < num2) {
      for (let j = 0; j < cache2.length; j++) {
        if (i == num2) { break }
        cache1.push(cache2[j])
        i++
      }
    }
    return cache1.join("")
  }

  function padStart(string = '', length = 0, chars = ' ') {
    if (length == string.length) {
      return string
    }
    length = length - string.length
    let cache1 = string.split("")
    let cache2 = chars.split("")
    let num2 = length
    let i = 0
    while (i < num2) {
      for (let j = 0; j < cache2.length; j++) {
        if (i == num2) { break }
        cache1.unshift(cache2[j])
        i++
      }
    }
    return cache1.join("")
  }

  function parseInt(str, radix = 10) {
    return Number.parseInt(str, radix)
  }

  function repeat(string = '', n = 1) {
    if (n == 1) {
      return string
    }
    let res = ""
    for (let i = 0; i < n; i++) {
      res = res + string
    }
    return res
  }

  function replace(string = "", pattern, replacement) {
    return string.replace(pattern, replacement)
  }

  function split(string = "", separator, limit) {
    return string.split(separator).slice(0, limit)
  }

  function toLower(string) {
    return string.toLowerCase()
  }

  function toUpper(string) {
    return string.toUpperCase()
  }

  function trim(string = '', chars = " ") {
    return string.replace(new RegExp("[" + chars + "]", "g"), "")
  }

  function trimEnd(string = '', chars = " ") {
    return string.replace(new RegExp("[" + chars + "]+$", "g"), "")
  }

  function trimStart(string = '', chars = " ") {
    return string.replace(new RegExp("^[" + chars + "]+", "g"), "")
  }

  function unescape(string = "") {
    const regexp = /(&amp;)|(&lt;)|(&gt;)|(&quot;)|(&#39;)/g;
    return string.replace(regexp, match => {
      switch (match) {
        case "&amp;":
          return "&";
        case "&lt;":
          return "<";
        case "&gt;":
          return ">";
        case "&quot;":
          return '"';
        case "&#39;":
          return "'";
        default:
          return match;
      }
    });
  }

  function upperCase(string = '') {
    let cache1 = string.match(/[A-Z]/g)
    let cache2 = string.replace(/[A-Z]/g, " " + cache1)
    let cache3 = cache2.match(/[a-zA-Z]+/g)
    let res = ""
    for (var i = 0; i < cache3.length - 1; i++) {
      res += toUpper(cache3[i]) + " "
    }
    res += toUpper(cache3[i])
    return res
  }

  function upperFirst(string) {
    return string.replace(/^\w/, str => str.toUpperCase())
  }

  function kebabCase(string = '') {
    let cache1 = string.match(/([?:[a-z][A-Z])/g)
    if (cache1) {
      cache1 = cache1[0].split("")
      string = string.replace(/([?:[a-z][A-Z])/g, cache1[0]
        + " " + cache1[1])
    }
    let cache3 = string.match(/[a-zA-Z]+/g)
    let res = ""
    for (var i = 0; i < cache3.length - 1; i++) {
      res += toLower(cache3[i]) + "-"
    }
    res += toLower(cache3[i])
    return res
  }

  function lowerCase(string = '') {
    let cache1 = string.match(/([?:[a-z][A-Z])/g)
    if (cache1) {
      cache1 = cache1[0].split("")
      string = string.replace(/([?:[a-z][A-Z])/g, cache1[0]
        + " " + cache1[1])
    }
    let cache3 = string.match(/[a-zA-Z]+/g)
    let res = ""
    for (var i = 0; i < cache3.length - 1; i++) {
      res += toLower(cache3[i]) + " "
    }
    res += toLower(cache3[i])
    return res
  }

  function lowerFirst(string) {
    return string.replace(/^\w/, str => str.toLowerCase())
  }

  function snakeCase(string = '') {
    let cache1 = string.match(/([?:[a-z][A-Z])/g)
    if (cache1) {
      cache1 = cache1[0].split("")
      string = string.replace(/([?:[a-z][A-Z])/g, cache1[0]
        + " " + cache1[1])
    }
    let cache3 = string.match(/[a-zA-Z]+/g)
    let res = ""
    for (var i = 0; i < cache3.length - 1; i++) {
      res += toLower(cache3[i]) + "_"
    }
    res += toLower(cache3[i])
    return res
  }

  function startCase(string = '') {
    let cache1 = string.match(/([?:[a-z][A-Z])/g)
    if (cache1) {
      cache1 = cache1[0].split("")
      string = string.replace(/([?:[a-z][A-Z])/g, cache1[0]
        + " " + cache1[1])
    }
    let cache3 = string.match(/[a-zA-Z]+/g)
    let res = ""
    for (var i = 0; i < cache3.length - 1; i++) {
      res += cache3[i].replace(/^\w/, toUpper(cache3[i].match(/^\w/)[0])) + " "
    }
    res += cache3[i].replace(/^\w/, toUpper(cache3[i].match(/^\w/)[0]))
    return res
  }

  function startsWith(string = '', target, position = 0) {
    return string.match(/\w/g)[position] == target
  }

  function pullAt(array, ...indexes) {
    indexes = flattenDeep(indexes)
    let res = []
    let cache = []
    let map = {}
    for (let i = 0; i < array.length; i++) {
      map[i] = array[i]
    }
    for (let i = 0; i < array.length; i++) {
      if (indexes[i] in map) {
        map[indexes[i]] = false
        res.push(array[indexes[i]])

      }
    }
    for (key in map) {
      if (map[key] !== false) {
        cache.push(array[key])
      }
    }
    array = cache
    return res
  }

  function isEqualWith(value, other, customizer) {
    if (customizer !== undefined) {
      for (let i = 0; i < value.length; i++) {
        if (customizer(value[i], other[i]) === false) {
          return false
        }
      }
      return true
    } else {
      return isEqual(value, other)
    }
  }

  function method(path, ...args) {
    return function (object) {
      return get(object, path)(...args)
    }
  }

  function methodOf(object, ...args) {
    return function (path) {
      return get(object, path)(...args)
    }
  }

  function nthArg(n = 0) {
    return function (...args) {
      return nth(args, n)
    }
  }

  function propertyOf(object) {
    return function (path) {
      return get(object, path)
    }
  }

  function flow(...funcs) {
    let that = this
    funcs = flattenDeep(funcs)
    return function () {
      let res = Array.from(arguments)
      for (let i = 0; i < funcs.length; i++) {
        res = [funcs[i].apply(that, res)]
      }
      return res[0]
    }
  }

  function uniqueId(prefix = "") {
    return prefix + (Date.now());
  }


  return {
    uniqueId,
    flow,
    propertyOf,
    nthArg,
    methodOf,
    method,
    isEqualWith,
    pullAt,
    startsWith,
    startCase,
    snakeCase,
    lowerFirst,
    lowerCase,
    kebabCase,
    upperFirst,
    upperCase,
    unescape,
    trimStart,
    trimEnd,
    trim,
    toUpper,
    toLower,
    split,
    replace,
    repeat,
    parseInt,
    swap,
    padStart,
    padEnd,
    pad,
    merge,
    cloneDeep,
    parseJson,
    stringifyJson,
    unary,
    words,
    defaultTo,
    rangeRight,
    range,
    delay,
    defer,
    escapeRegExp,
    escape,
    endsWith,
    capitalize,
    valuesIn,
    values,
    updateWith,
    update,
    toPairsIn,
    toPairs,
    unset,
    setWith,
    set,
    result,
    pickBy,
    pick,
    omitBy,
    omit,
    deburr,
    at,
    times,
    constant,
    inRange,
    clamp,
    multiply,
    meanBy,
    mean,
    divide,
    ceil,
    toSafeInteger,
    toNumber,
    toLength,
    toInteger,
    toFinite,
    lte,
    lt,
    isWeakSet,
    isWeakMap,
    isTypedArray,
    isSymbol,
    isSet,
    isSafeInteger,
    isPlainObject,
    isObjectLike,
    isNative,
    isMap,
    isLength,
    isInteger,
    isArrayLikeObject,
    isArrayLike,
    gte,
    gt,
    eq,
    conformsTo,
    castArray,
    floor,
    invokeMap,
    includes,
    uniq,
    uniqBy,
    uniqWith,
    takeWhile,
    takeRightWhile,
    takeRight,
    take,
    tail,
    sortedUniqBy,
    sortedUniq,
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
    dropWhile,
    dropRight,
    dropRightWhile,
    reverse,
    max,
    maxBy,
    min,
    minBy,
    sum,
    sumBy,
    chunk,
    difference,
    differenceBy,
    differenceWith,
    flatten,
    flattenDeep,
    flattenDepth,
    groupBy,
    map,
    reduce,
    reduceRight,
    isBoolean,
    isFunction,
    isObject,
    isArray,
    isNumber,
    isString,
    isNull,
    isNil,
    isNaN,
    isElement,
    isDate,
    isArguments,
    isArrayBuffer,
    isError,
    isFinite,
    isRegExp,
    isUndefined,
    toArray,
    find,
    filter,
    forEach,
    forEachRight,
    noop,
    property,
    get,
    isMatch,
    matches,
    bind,
    matchesProperty,
    iteratee,
    findIndex,
    findLast,
    findLastIndex,
    sortedIndex,
    sortedIndexBy,
    sortedIndexOf,
    sortedLastIndex,
    sortedLastIndexBy,
    sortedLastIndexOf,
    intersection,
    intersectionBy,
    intersectionWith,
    pull,
    pullAll,
    pullAllBy,
    pullAllWith,
    union,
    unionBy,
    unionWith,
    zip,
    zipObject,
    zipObjectDeep,
    unzip,
    unzipWith,
    zipWith,
    add,
    without,
    xor,
    xorBy,
    xorWith,
    countBy,
    every,
    flatMap,
    flatMapDeep,
    flatMapDepth,
    keyBy,
    partition,
    reject,
    sample,
    sampleSize,
    shuffle,
    size,
    some,
    before,
    after,
    ary,
    flip,
    negate,
    spread,
    defaultStatus,
    findKey,
    findLastKey,
    forIn,
    forInRight,
    forOwn,
    forOwnRight,
    functions,
    functionsIn,
    isEmpty,
    round,
    subtract,
    assignIn,
    assign,
    defaults,
    defaultsDeep,
    invoke,
    keys,
    keysIn,
    mapKeys,
    mapValues,
    nth,

    isEqual,
    curry,
    invert,
    invertBy,
    toPath,
    has,
    hasIn,
    create,
    deepCopy,
    identity,
    typeJudge,
  }
}()