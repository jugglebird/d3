d3_selectionPrototype.style = function(name, value, priority) {
  if (arguments.length < 3) priority = "";

  // If no value is specified, return the first value.
  if (arguments.length < 2) return window
      .getComputedStyle(this.node(), null)
      .getPropertyValue(name);

  function styleNull() {
    d3_removeStyleProperty(this.style, name);
  }

  function styleConstant() {
    d3_setStyleProperty(this.style, name, value, priority);
  }

  function styleFunction() {
    var x = value.apply(this, arguments);
    if (x == null) d3_removeStyleProperty(this.style, name);
    else d3_setStyleProperty(this.style, name, x, priority);
  }

  return this.each(value == null
      ? styleNull : (typeof value === "function"
      ? styleFunction : styleConstant));
};

(function(){
  // CamelCase code copied from jQuery
  var rdashAlpha = /-([a-z])/ig;
  var fcamelCase = function( all, letter ) {
  	return letter.toUpperCase();
  };

  function camelCase( string ) {
    return string.replace( rdashAlpha, fcamelCase );
  }

  // IE < 9 does not support the style.setProperty method. These workarounds
  // can be used to ensure that at least IE 8 (untested in earlier versions)
  // can support calls to the d3 .style('att', 'value') method
  window.d3_setStyleProperty = function(style, name, value, priority){
    if ('setProperty' in style) {
      style.setProperty(name, value, priority);
    } else {
      // For IE < 9
      name = camelCase(name); // for properties like background-color
      style.setAttribute(name, value, priority);
    }
  }

  window.d3_removeStyleProperty = function(style, name){
    if ('removeProperty' in style) {
      style.removeProperty(name);
    } else {
      // For IE < 9
      name = camelCase(name);
      style.removeAttribute(name);
    }
  }
})()
