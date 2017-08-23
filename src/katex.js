const katexOptions = {
  delimiters: [
    {left: '$$', right: '$$', display: true},
    {left: '\\[', right: '\\]', display: true},
    {left: '\\(', right: '\\)', display: false},
    {left: '$', right: '$', display: false}
  ],
  throwOnError: false
};

export { katexOptions };

export default elem => {
  if (!elem) return;
  renderMathInElement(elem, katexOptions);
};
