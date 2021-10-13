export const urlRegex = (url) => {
  let src;
  if(url) src = url.replace(/[^\w\s]/gi, '').replace(/ +/g, '-').toLowerCase()
  return src
}

export const titleStringUrlRegex = (title) => {
  if (!title) return ""
  return title.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-')
}