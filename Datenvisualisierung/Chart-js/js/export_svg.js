// Función para crear el enlace SVG
function createSvgLink(filename, linkText, chart, chartCanvasWrapperId) {
  // Verificar si la duración de la animación y la responsividad están desactivadas
  if (chart.options.animation.duration !== 0) {
    console.warn('Cannot create SVG: "animation" duration is not set to 0');
    
    chart.options.animation.duration = 0;
    console.log("changed to 0");
    chart.update();
    //return;
  }
  if (chart.options.responsive !== false) {
    console.warn('Cannot create SVG: "responsive" is not set to false');
    chart.options.responsive = false;
    console.log("changed to false");
    chart.update();
    //return;
  }
  tweakLib();
  // Crear un contexto SVG usando Canvas2Svg.js
  let svgContext = new C2S(chart.width, chart.height);
  let svgChart = new Chart(svgContext, chart.config);

  // Crear el enlace de descarga
  let link = document.createElement('a');
  link.href = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgContext.getSerializedSvg());
  link.download = filename;
  link.textContent = linkText;

  // Agregar el enlace a la página
  document.getElementById(chartCanvasWrapperId).appendChild(link);
}


function tweakLib() {

  C2S.prototype.getContext = function(contextId) {
    if (contextId === '2d' || contextId === '2D') {
      return this;
    }
    return null;
  }
  C2S.prototype.style = function() {
    return this.__canvas.style;
  }
  C2S.prototype.getAttribute = function(name) {
    return this[name];
  }
  C2S.prototype.addEventListener = function(type, listener, eventListenerOptions) {
    // nothing to do here, but we need this function :)
  }

  // Polyfill missing methods
  if (!C2S.prototype.setTransform) {
      C2S.prototype.setTransform = function(a, b, c, d, e, f) {
          // Reset and apply transform manually or ignore if simple scaling is sufficient
          this.__matrix = [a, b, c, d, e, f]; 
          // Note: This is a basic stub and may not render complex transforms correctly
      };
  }

  if (!C2S.prototype.resetTransform) {
      C2S.prototype.resetTransform = function() {
          this.__matrix = [1, 0, 0, 1, 0, 0];
      };
  }

  const originalFill = C2S.prototype.fill;
    C2S.prototype.fill = function() {
        this.closePath(); // Ensure path is closed before filling/text
        return originalFill.apply(this, arguments);
    }; 


}
