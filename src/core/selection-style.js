d3_selectionPrototype.style = function(name, value, priority) {
  if (arguments.length < 3) priority = "";

  // If no value is specified, return the first value.
  if (arguments.length < 2) return window
      .getComputedStyle(this.node(), null)
      .getPropertyValue(name);

  function styleNull() {
    window.d3_removeStyleProperty(this.style, name);
  }

  function styleConstant() {
    window.d3_setStyleProperty(this.style, name, value, priority);
  }

  function styleFunction() {
    var x = value.apply(this, arguments);
    if (x == null) window.d3_removeStyleProperty(this.style, name);
    else window.d3_setStyleProperty(this.style, name, x, priority);
  }

  return this.each(value == null
      ? styleNull : (typeof value === "function"
      ? styleFunction : styleConstant));
};
