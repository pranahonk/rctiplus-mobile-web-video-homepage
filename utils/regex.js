export const urlRegex = (url) => {
  let src;
  if(url) src = url.replace(/[\/ !@#$%^&*(),.?":{}|<>-]/g, '-').replace(/(-+)/g, '-').toLowerCase()
  return src
}