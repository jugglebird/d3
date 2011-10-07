function d3_selection(groups) {
  d3_arraySubclass(groups, d3_selectionPrototype);
  return groups;
}

var d3_select = function(s, n) { return n.querySelector(s); },
    d3_selectAll = function(s, n) { return n.querySelectorAll(s); };

// Prefer Sizzle, if available.
if (typeof Sizzle === "function") {
  d3_select = function(s, n) { return Sizzle(s, n)[0]; };
  d3_selectAll = function(s, n) { return Sizzle.uniqueSort(Sizzle(s, n)); };
}

var d3_selectionPrototype = [];

d3.selection = function() {
  return d3_selectionRoot;
};

d3.selection.prototype = d3_selectionPrototype;

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
  };

  window.d3_removeStyleProperty = function(style, name){
    if ('removeProperty' in style) {
      style.removeProperty(name);
    } else {
      // For IE < 9
      name = camelCase(name);
      style.removeAttribute(name);
    }
  };
})();
