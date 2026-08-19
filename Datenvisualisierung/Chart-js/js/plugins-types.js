let _stroke = null;
  
const simplePlugin = {
    id: "paintShadow",
    beforeDatasetsDraw: function (chart) {
      if (!_stroke) _stroke = chart.ctx.stroke;
      chart.ctx.stroke = function () {
        if (!chart.ctx) return;
        chart.ctx.save();
        chart.ctx.shadowColor = "rgba(0,0,0,0.2)";
        chart.ctx.shadowBlur = 4;
        chart.ctx.shadowOffsetX = 1;
        chart.ctx.shadowOffsetY = 2;
        _stroke.apply(this, arguments);
        chart.ctx.restore();
      };
    },
  };


  const whiteShadowPlugin = {
    id: "whiteShadow",
    beforeDatasetsDraw: function (chart) {
      if (!_stroke) _stroke = chart.ctx.stroke;
      chart.ctx.stroke = function () {
        if (!chart.ctx) return;
        chart.ctx.save();
        chart.ctx.shadowColor = "rgba(255, 255, 255, 0.30)";
        chart.ctx.shadowBlur = 3;
        chart.ctx.shadowOffsetX = 1;
        chart.ctx.shadowOffsetY = 2;
        _stroke.apply(this, arguments);
        chart.ctx.restore();
      };
    },
  };

  //Chart.plugins.register(simplePlugin);


  // Neuen Controller definieren
class LineWithShadowController extends Chart.controllers.line {
  draw() {
    const ctx = this.chart.ctx;
    
    ctx.save();
    // Schatten-Einstellungen nur für diesen Draw-Aufruf
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    
    // Original Draw-Methode aufrufen
    super.draw();
    
    ctx.restore();
  }
}

// ID setzen und registrieren
LineWithShadowController.id = 'lineWithShadow';
// Defaults vom Original-Line-Controller übernehmen
LineWithShadowController.defaults = Chart.controllers.line.defaults;

Chart.register(LineWithShadowController);
/*
// Nutzung: type auf den neuen Namen setzen
const myChart = new Chart(ctx, {
  type: 'lineWithShadow', // Hier den neuen Typ verwenden
  data: data,
  options: options
});   
*/


class DynamicShadowLineController extends Chart.controllers.line {
  draw() {
    const ctx = this.chart.ctx;
    // Zugriff auf das erste Dataset dieses Controllers (bei Multi-Dataset Charts muss man iterieren)
    // Oft ist es einfacher, die Optionen im Chart-Config zu definieren und hier zu lesen.
    // Ein sauberer Weg ist, benutzerdefinierte Optionen im Dataset zu definieren:
    // dataset.shadowColor, dataset.shadowBlur etc.
    
    // Da Chart.js diese nicht standardmäßig kennt, müssen wir sie manuell auslesen.
    // Hinweis: In v4 ist der Zugriff auf das "aktive" Dataset im draw() Kontext nicht immer trivial ohne Iteration.
    
    // Einfacher Workaround: Optionen aus dem ersten Dataset dieses Controllers
    const dataset = this.getDataset(); 
    const shadowColor = dataset.shadowColor || 'rgba(0,0,0,0.2)';
    const shadowBlur = dataset.shadowBlur || 10;
    const offsetX = dataset.shadowOffsetX || 0;
    const offsetY = dataset.shadowOffsetY || 4;

    ctx.save();
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = offsetX;
    ctx.shadowOffsetY = offsetY;
    
    super.draw();
    ctx.restore();
  }
}

DynamicShadowLineController.id = 'dynamicShadowLine';
DynamicShadowLineController.defaults = Chart.controllers.line.defaults;
Chart.register(DynamicShadowLineController);

// Nutzung:
// type: 'dynamicShadowLine'
// datasets: [{ shadowColor: 'red', shadowBlur: 20, ... }]   

class DualShadowLineController extends Chart.controllers.line {
  draw() {
    const ctx = this.chart.ctx;
    const dataset = this.getDataset();
    
    // --- 1. Schatten für die LINIE konfigurieren ---
    const lineShadow = {
      //color: dataset.lineShadowColor || 'rgba(0, 0, 0, 0.2)',
      color: dataset.lineShadowColor !== undefined ? dataset.lineShadowColor : dataset.shadowColor || 'rgba(0, 0, 0, 0.2)',
      //blur: dataset.lineShadowBlur !== undefined ? dataset.lineShadowBlur : 10,
      blur: dataset.lineShadowBlur !== undefined ? dataset.lineShadowBlur : dataset.shadowBlur || 10,
      //offsetX: dataset.lineShadowOffsetX || 0,
      offsetX: dataset.lineShadowOffsetX !== undefined ? dataset.lineShadowOffsetX : dataset.shadowOffsetX || 0,
      //offsetY: dataset.lineShadowOffsetY || 4
      offsetY: dataset.lineShadowOffsetY !== undefined ? dataset.lineShadowOffsetY : dataset.shadowOffsetY || 4
    };

    // --- 2. Schatten für die PUNKTE konfigurieren ---
    const pointShadow = {
      //color: dataset.pointShadowColor || 'rgba(0, 0, 0, 0.5)', // Oft dunkler für Punkte
      color: dataset.pointShadowColor !== undefined ? dataset.pointShadowColor : dataset.shadowColor || 'rgba(0, 0, 0, 0.5)', // Oft dunkler für Punkte
      //blur: dataset.pointShadowBlur !== undefined ? dataset.pointShadowBlur : 5,
      blur: dataset.pointShadowBlur !== undefined ? dataset.pointShadowBlur : dataset.shadowBlur || 5,
      //offsetX: dataset.pointShadowOffsetX || 0,
      offsetX: dataset.pointShadowOffsetX !== undefined ? dataset.pointShadowOffsetX : dataset.shadowOffsetX || 0,
      //offsetY: dataset.pointShadowOffsetY || 2
      offsetY: dataset.pointShadowOffsetY !== undefined ? dataset.pointShadowOffsetY : dataset.shadowOffsetY || 2
    };

    // --- Zeichnung durchführen ---
    ctx.save();

    // A) Linie zeichnen mit Linie-Schatten
    ctx.shadowColor = lineShadow.color;
    ctx.shadowBlur = lineShadow.blur;
    ctx.shadowOffsetX = lineShadow.offsetX;
    ctx.shadowOffsetY = lineShadow.offsetY;
    
    // Nur die Linie zeichnen (super.draw() macht beides, also müssen wir trickreich vorgehen)
    // Besser: Wir rufen die spezifischen Draw-Methoden des Elements auf oder nutzen den Super-Call geschickt.
    // Da super.draw() beides macht, müssen wir den Kontext zwischen den Schritten ändern.
    
    // Workaround: Super.draw() nutzt den aktuellen Kontext für beides. 
    // Um es zu trennen, überschreiben wir temporär die draw-Methode des Elements oder zeichnen manuell.
    // Der einfachste Weg im Controller ist das manuelle Zeichnen der Elemente:
    
    const meta = this._cachedMeta;
    const lineElement = meta.dataset; // Das LineElement
    const points = meta.data; // Array der PointElements

    // 1. Linie zeichnen
    if (lineElement && !lineElement.skip) {
      ctx.shadowColor = lineShadow.color;
      ctx.shadowBlur = lineShadow.blur;
      ctx.shadowOffsetX = lineShadow.offsetX;
      ctx.shadowOffsetY = lineShadow.offsetY;
      lineElement.draw(ctx, this.chart.area);
    }

    // 2. Punkte zeichnen
    ctx.shadowColor = pointShadow.color;
    ctx.shadowBlur = pointShadow.blur;
    ctx.shadowOffsetX = pointShadow.offsetX;
    ctx.shadowOffsetY = pointShadow.offsetY;
    
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      if (!point.skip) {
        point.draw(ctx, this.chart.area);
      }
    }

    ctx.restore();
  }
}

DualShadowLineController.id = 'dualShadowLine';
DualShadowLineController.defaults = Chart.controllers.line.defaults;
Chart.register(DualShadowLineController);   


const image = new Image();
image.src = 'pfad/zu/ihrem/bild.png'; // URL oder lokaler Pfad

const backgroundPlugin = {
  id: 'customCanvasBackgroundImage',
  beforeDraw: (chart) => {
    if (image.complete) {
      const ctx = chart.ctx;
      const { top, left, width, height } = chart.chartArea;
      
      ctx.save();
      // Bild zentriert und gestreckt auf den Chart-Bereich zeichnen
      ctx.drawImage(image, left, top, width, height);
      ctx.restore();
    } else {
      // Wenn Bild noch nicht geladen, beim Laden neu zeichnen
      image.onload = () => chart.draw();
    }
  }
};

/*
const chart = new Chart(ctx, {
  type: 'line',
  data: { / * ... * / },
  options: { / * ... * / },
  plugins: [backgroundPlugin] // Plugin hier registrieren
});
*/

// Gezielter Abstand nur unter/über der Legende 

// Plugin definieren und registrieren
const legendSpacingPlugin = {
  id: 'legendSpacing',
  beforeInit: function(chart, args, options) {
    // Nur anwenden, wenn die Legende oben oder unten ist
    const position = chart.legend.options.position;
    if (position === 'top' || position === 'bottom') {
      const originalFit = chart.legend.fit;
      
      chart.legend.fit = function() {
        // Original Fit-Methode aufrufen
        originalFit.bind(chart.legend)();
        
        // Zusätzlichen Abstand hinzufügen (z.B. 20 Pixel)
        this.height += options.spacing || 20;
      };
    }
  }
};


// Plugin global registrieren
Chart.register(legendSpacingPlugin);
/*
// Chart erstellen (der Abstand wird automatisch angewendet)
const myChart = new Chart(ctx, {
  type: 'bar',
  data: data,
  options: {
    plugins: {
      legend: {
        position: 'top', // Funktioniert primär für 'top' und 'bottom'
        // Optional: Abstand nur für dieses Chart überschreiben
        // spacing: 50 
      }
    }
  }
});   
*/




/*
const legendPaddingPlugin = (chart, padding) => {
  id: 'legendPadding',
  afterFit: (chart) => {
    // Erhöht die Höhe des Legenden-Bereichs um 30px
    if (chart.legend && chart.options.layout) {
      chart.legend.height += padding;
    }
  }
};

const chart = new Chart(ctx, {
  type: 'bar',
  data: data,
  options: {
    plugins: {
      legendPadding: {
        padding: 30
      } // Plugin aktivieren
    }
  },
  plugins: [legendPaddingPlugin]
});
*/



const getOrCreateLegendList = (chart, id) => {
  const legendContainer = document.getElementById(id);
  let listContainer = legendContainer.querySelector('ul');

  if (!listContainer) {
    listContainer = document.createElement('ul');
    listContainer.style.display = 'flex';
    listContainer.style.flexDirection = 'row';
    listContainer.style.margin = 0;
    listContainer.style.padding = 0;

    legendContainer.appendChild(listContainer);
  }

  return listContainer;
};

//For an html legend to work you need to place an empty div at your web page with the ID you provide in the options to bind to like so: <div id="legend-container"></div>

/* config.options.plugins.htmlLegend: {
        // ID of the container to put the legend in
        containerID: 'legend-container',
      },
      legend: {
        display: false,
      }
*/