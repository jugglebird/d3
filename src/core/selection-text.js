d3_selectionPrototype.text = function(value) {
  if (this.node()._fakeNode) {
    if (arguments.length < 1) {
      return this.node().textContent;
    } else {
      return this.each(typeof value === "function"
        ? function() { this.appendChild(document.createTextNode(value.apply(this, arguments), true)); }
        : function() { this.appendChild(document.createTextNode(value, true)); }
      );
    }
  } else {
    return arguments.length < 1 ? this.node().textContent
        : (this.each(typeof value === "function"
        ? function() { this.textContent = value.apply(this, arguments); }
        : function() { this.textContent = value; }));
  }
};
