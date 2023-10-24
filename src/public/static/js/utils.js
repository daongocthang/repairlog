/**
 * Remove item from an array by value
 * @param {...any} arguments
 */
Array.prototype.remove = function () {
  const arr = this;
  const itemList = [...arguments];
  itemList.forEach((v) => {
    const i = arr.indexOf(v);
    if (i > -1) arr.splice(i, 1);
  });
};

/**
 * Insert the specified values inside a string's placeholder,
 * it's defined using numbered indexs {0}
 * @param {...string|number} arguments
 * @returns {string}
 */
String.prototype.format = String.prototype.f = function () {
  let s = this;
  const itemList = [...arguments];
  itemList.forEach((v, i) => {
    s = s.replace(new RegExp("\\{" + i + "\\}", "gm"), v);
  });

  return s;
};
