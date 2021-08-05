const TextLength = (text, maxLength) => {
    if (text.length > maxLength) {
      text = text.substr(0, maxLength) + "...";
    }
    return text;
  };
  
export default TextLength;
  