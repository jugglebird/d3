/**
  * @public Returns the name of the renderer we're using -
  *
  * 'nativesvg' is the default - the native svg of the browser.
  * 'svgweb' is if we identify svgweb is there.
  */
function renderer(){
    return (typeof window.svgweb === "undefined") ? "nativesvg" : "svgweb";
}

// Checks if a given node is an svgweb _Node or just a standard dom node
function svgwebNode(node){
    return renderer() === 'svgweb' && (!!node._nodeXML || !!node._fakeNode);
}

// Override d3_select and d3_selectAll functions to work with proxy nodes 
// returned by svgweb.
function setup_select_functions(){
    // Pulled from svg.js in svgweb project

    // We don't create a NodeList class due to the complexity of subclassing
    // the Array object cross browser. Instead, we simply patch in the item()
    // method to a normal Array object
    function createNodeList() {
      var results = [];
      results.item = function(i) {
        if (i >= this.length) {
          return null; // DOM Level 2 spec says return null
        } else {
          return this[i];
        }
      };

      return results;
    }

    msie = navigator.appName === 'Microsoft Internet Explorer';

    if(typeof Sizzle != "function" && typeof jQuery != "function"){
        // Technically these aren't needed if using svgweb with browsers other
        // than IE, but why would you be using svgweb without IE anyways?
        alert('jQuery or Sizzle must be present to support svgweb');
    }

    var querySelectorAll = typeof Sizzle == 'function' ? Sizzle : jQuery;


    var _d3_selectAll = d3_selectAll;
    d3_selectAll = function(s, n){
        // svgweb returns an actual svg node created in the document for 
        // reasons I don't understand, but makes the proxy node available 
        // via _fakeNode
        if(msie && n._fakeNode){
            n = n._fakeNode;
        }
        if(!n._nodeXML){
            return _d3_selectAll(s, n);
            // throw('Could not find property _nodeXML');                
        }
        // svgweb proxy objects have a _nodeXML property containing an SVG 
        // document that is a representation of what the flash element is 
        // displaying. Each tag has an id that can be matched up to svgweb's 
        // internal DOM after finding matches
        var results = querySelectorAll(s, n._nodeXML);

        // now create or fetch _Elements representing these DOM nodes
        if(results){
            var nodes = createNodeList();
            for (var i = 0; i < results.length; i++) {
              var elem = n._handler._getNode(results[i], n._handler);
              n._getFakeNode(elem)._attached = n._attached;
              nodes.push(elem);
            }          
        }
        return nodes;
    };

    var _d3_select = d3_select;
    // Mostly the same as d3_selectAll above
    d3_select = function(s, n){
        if(!n._nodeXML){
            return _d3_select(s, n);
        }
        var result = querySelectorAll(s, n._nodeXML)[0];
        var elem = n._handler._getNode(result, n._handler);
        n._getFakeNode(elem)._attached = n._attached;
        return elem;
    };
    
    if (msie) {
      var _d3_selectionPrototype_text = d3_selectionPrototype.text;
      d3_selectionPrototype.text = function(value) {
        // If no value is specified, return the first value.
        if (arguments.length < 1) {
          return first(function() {
            return this.node().textContent;
          });
        }

        /** @this {Element} */
        function textConstant() {
          if (this.firstChild) {
            this.removeChild(this.firstChild);        
          }
          // call with second argument for svgweb. Doesn't affect normal rendering
          if (this._fakeNode) {
            this.appendChild(document.createTextNode(value, true));
          } else {
            this.appendChild(document.createTextNode(value));
          }
        }

        /** @this {Element} */
        function textFunction() {
          var x = value.apply(this, arguments);
          if (x != null) {
            if (this.firstChild) {
              this.removeChild(this.firstChild);        
            }
            // call with second argument for svgweb. Doesn't affect normal rendering
            if (this._fakeNode) {
              this.appendChild(document.createTextNode(x, true));
            } else {
              this.appendChild(document.createTextNode(x));
            }
          }
        }
        return this.each(typeof value === "function"
            ? textFunction : textConstant);
      };
    }
    
}

if(renderer() === 'svgweb'){
    setup_select_functions();
}

// Need this for MSIE
if (!('map' in Array.prototype)) {
    Array.prototype.map= function(mapper, that /*opt*/) {
        var other= new Array(this.length);
        for (var i= 0, n= this.length; i<n; i++) {
            if (i in this) {
                other[i]= mapper.call(that, this[i], i, this);
            }
        }
        return other;
    };
}

var d3_selectionRoot = d3_selection([[document]]);

d3_selectionRoot[0].parentNode = document.documentElement;

// TODO fast singleton implementation!
// TODO select(function)
d3.select = function(selector) {
  return typeof selector === "string"
      ? d3_selectionRoot.select(selector)
      : d3_selection([[selector]]); // assume node
};

// TODO selectAll(function)
d3.selectAll = function(selector) {
  return typeof selector === "string"
      ? d3_selectionRoot.selectAll(selector)
      : d3_selection([d3_array(selector)]); // assume node[]
};
