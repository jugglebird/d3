// TODO append(node)?
// TODO append(function)?
d3_selectionPrototype.append = function(name) {
  name = d3.ns.qualify(name);

  function append() {
    return this.appendChild(document.createElement(name));
  }

  var appendNS;

  if (name.local === 'svg' && renderer() === 'svgweb' && !svgwebNode(parent)) {
    appendNS = function () {
      var svg = document.createElementNS(name.space, name.local);
      // set auto dimensions until set latter in viz document
      svg.setAttribute('width', 300);
      svg.setAttribute('height', 300);
      var frag = document.createDocumentFragment(true);
      svg.addEventListener('SVGLoad', function() {
          this.appendChild(frag);
          // set the dimensions if they have been set in the viz 
          // definition
          if(dims['width']){
              this._handler.flash.setAttribute('width', dims['width']);
              this.setAttribute('width', dims['width']);                    
          }
          if(dims['height']){
              this._handler.flash.setAttribute('height', dims['height']);
              this.setAttribute('height', dims['height']);                    
          }
      });
      svgweb.appendChild(svg, this);
      // for MSIE
      if(frag._fakeNode){
          frag = frag._fakeNode;
      }
      var dims = {};
      frag.setAttribute = function(name, attr){
          // Keep these handy to resize the flash and svg elements after
          // rendering
          if(name === 'width' || name === 'height'){
              dims[name] = attr;
          }
      };
      return frag;
    };
  } else {
    // Nothing out of the ordinary
    appendNS = function () {
      return this.appendChild(document.createElementNS(name.space, name.local));
    };
  }

  return this.select(name.local ? appendNS : append);
};
