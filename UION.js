function UI(name, components, style) {
  this.name = name;
  this.components = components;
  if (!window.AJAX) {
    window.AJAX = {
    	get: function(url,onGet) {
        	var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                onGet(this.responseText);
              }
            };
            xhttp.open("GET", url, true);
            xhttp.send();

        },
        post: function(url,onPost,header,data) {
        	var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                onPost(this.responseText);
              }
            };
            xhttp.open("POST", url, true);
            if (typeof header == "string") {
                xhttp.setRequestHeader(header);
            } else if (Array.isArray(header)) {
                for (var i = 0; i < header.length; i++) {
                    xhttp.setRequestHeader(header[i]);
                }
            }
            xhttp.send(data?data:null);
        }
    };
  }
  this.processComponent = (component, parameters) => {
    var comp = ([]).concat(component);
    for (var k = 0; k < comp.length; k++) {
      for (var kk in comp[k]) {
        if (typeof comp[k][kk] == "string") {
          for (var l in parameters) {
            if (comp[k][kk].split("$"+l).join("")=="") {
              comp[k][kk] = parameters[l];
            } else {
              comp[k][kk] = comp[k][kk].split("$"+l).join(parameters[l]);
            }
          }
        } else if (typeof comp[k][kk] == "object") {
          comp[k][kk] = this.processComponent(comp[k][kk],parameters);
        }
      }
    }
    return comp;
  };
  this.renderHTML = function(elements,destination) {
    var k, elm, attrs, a, tn;
    for (var k = 0; k < elements.length; k++) {
      elm = document.createElement(elements[k].tagName);
      attrs = elements[k];
      for (a in attrs) {
        if (a != "children" && a != "tagName") {
          if (a == "text") {
            tn = document.createTextNode(attrs[a]);
            elm.appendChild(tn);
          } else if (typeof attrs[a] == "function") {
            elm.addEventListener(a, attrs[a]);
          } else {
            elm.setAttribute(a,attrs[a]);
          }
        }
      }
      if (attrs.children) {
        this.build(attrs.children,elm);
      } destination.appendChild(elm);
    }
    return this;
  };
  this.renderComponent = (parameters, destination) => {
    var k, elm, attrs, a, tn, componentName = parameters.componentName;
    var elements = this.processComponent(
      this.components[componentName],
      parameters
    );
    if (elements.length == 1) {
      var c = elements[0];
      if (!c.class) {
        c.class = componentName;
      } else if (c.class.split(componentName).join("") != c.class) {
        c.class += " "+componentName;
      }
    } else {
      elements = [
        {
          tagName : "div",
          class : componentName,
          children : parameters.children ?
            elements.concat(parameters.children) : elements
        }
      ];
    }
    this.renderHTML(elements,destination);
    return this;
  };
  this.build = (config,target) => {
    for (var k = 0; k < config.length; k++) {
      if (!config[k].componentName) {
        this.renderHTML([config[k]],target);
      } else {
        this.renderComponent(config[k],target);
      }
    }
    return this;
  };
  this.style = new Style(name,style,{
    primary: "lightblue",
    secondary: "gray"
  });
};
function Style(name, csso, vars) {
  this.name = name;
  this.vars = vars || {};
  this.csso = csso;
  this.generateCSS = style => {
    var selector, css = "", attr;
    for (selector in style) {
      css+="\n"+selector+" {";
      for (attr in style[selector]) {
        css+="\n\t"+attr+": "+style[selector][attr]+";";
      }
      css+="\n}"
    }
    return css+"\n";
  };
  this.addProperty = (
    selector,
    property,
    value ) => { this.csso[selector][property] = value; this.compile(); };

  this.deleteProperty = (
    selector,
    property ) => { delete csso[selector][property]; this.compile(); };

  this.changeProperty = this.addProperty;

  this.getProperty = (selector, property) => this.csso[selector][property];

  this.compile = () => {
    document.getElementById(
      this.name
    ).innerHTML = this.generateCSS(this.csso);
  };
  this.currentCSS = () => JSON.stringify(this.csso);
  //Init
  var style = document.createElement("style");
  style.setAttribute("id",name);
  document.head.appendChild(style);
  this.compile();
}
