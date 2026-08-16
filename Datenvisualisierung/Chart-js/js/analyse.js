/**************************************************** 
 * Exponentielle gleitende Durchschnitte (EMA) berechnen
 * Der exponentielle gleitende Durchschnitt (EMA) gewichtet neuere Messwerte stärker als ältere, wodurch er schneller auf Trendänderungen reagiert als der einfache gleitende Durchschnitt.

    Die Berechnung erfolgt rekursiv:

    Glättungsfaktor ( α ) bestimmen: α= 
    N+1
    2
    ​
    Dabei ist N die Anzahl der Perioden (z. B. 10 für einen 10-Tage-Durchschnitt).
    EMA berechnen:
    Der erste EMA-Wert entspricht oft dem ersten Messwert oder dem einfachen Durchschnitt der ersten N Werte.
    Für alle folgenden Werte gilt: EMA 
    heute
    ​
    =(Messwert 
    heute
    ​
    ×α)+(EMA 
    gestern
    ​
    ×(1−α))
*****************************************************/


function calculateEMA(data, period) {
  if (data.length === 0) return [];
  
  const k = 2 / (period + 1); // Glättungsfaktor alpha
  const emaArray = [];
  
  // Initialisierung: Erster EMA ist der erste Messwert 
  // (alternativ: einfacher Durchschnitt der ersten 'period' Werte)
  let ema = data[0];
  emaArray.push(ema);

  for (let i = 1; i < data.length; i++) {
    ema = (data[i] * k) + (ema * (1 - k));
    emaArray.push(ema);
  }
  
  return emaArray;
}

// Beispielnutzung:
/*
const messwerte = [10, 12, 11, 13, 14, 13, 15];
const ema10 = calculateEMA(messwerte, 3); // 3-Perioden EMA
console.log(ema10);   
*/


/****************************************************
 * Berechnung der Trendlinie (Steigung & Achsenabschnitt)
 * Die Trendlinie wird durch die lineare Regression berechnet, die die beste Gerade durch die Datenpunkte findet. Die Gleichung der Trendlinie lautet:
 * y = mx + b
 * wobei m die Steigung und b der Achsenabschnitt ist.
 *****************************************************/

function linearRegression(data) {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: data[0] || 0, rSquared: 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  // X ist hier der Index (0, 1, 2...), Y ist der Messwert
  for (let i = 0; i < n; i++) {
    const x = i;
    const y = data[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  const denominator = (n * sumXX) - (sumX * sumX);
  
  // Vermeidung von Division durch Null bei konstanten X-Werten
  if (denominator === 0) return { slope: 0, intercept: sumY / n, rSquared: 0 };

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Optional: Bestimmtheitsmaß R² (Güte der Anpassung)
  const meanY = sumY / n;
  const ssTot = data.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0);
  const ssRes = data.reduce((sum, y, i) => {
    const pred = slope * i + intercept;
    return sum + Math.pow(y - pred, 2);
  }, 0);
  const rSquared = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);

  return { slope, intercept, rSquared };
}

// Beispielnutzung:
/*
const messwerte = [10, 12, 11, 13, 14, 13, 15, 16, 18];
const trend = linearRegression(messwerte);

console.log(`Steigung: ${trend.slope.toFixed(2)}`); // Positiv = Aufwärtstrend
console.log(`Startwert: ${trend.intercept.toFixed(2)}`);
console.log(`Trendstärke (R²): ${trend.rSquared.toFixed(2)}`); // Näher an 1 = stärkerer linearer Trend

// Vorhersage für den nächsten Wert (Index = data.length)
const naechsterIndex = messwerte.length;
const prognose = trend.slope * naechsterIndex + trend.intercept;
console.log(`Prognose nächster Wert: ${prognose.toFixed(2)}`);   
*/