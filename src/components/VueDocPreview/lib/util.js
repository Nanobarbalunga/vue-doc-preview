const objectDeepMerge = (target, source) => {
  for (let key in source) {
    target[key] = target[key] && target[key].toString() === '[object Object]'
      ? objectDeepMerge(target[key], source[key]) : target[key] = source[key]
  }
  return target
}

const objectStyleToStringStyle = obj => {
  let styleNames = Object.keys(obj)
  let stringStyle = ``
  styleNames.forEach(item => {
    stringStyle += `${item} : ${obj[item]};`
  })
  return stringStyle
}

export {
  objectDeepMerge,
  objectStyleToStringStyle
}
