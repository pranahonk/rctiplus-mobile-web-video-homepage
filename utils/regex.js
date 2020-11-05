export const urlRegex = (url) => {
  let src;
  if(url) src = url.replace(/[^\w\s]/gi, '').replace(/ +/g, '-').toLowerCase()
  return src
}