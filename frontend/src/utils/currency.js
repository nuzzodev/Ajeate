import { tasaService } from '@/api/dolarApi';

// Almacenamiento en caché para la tasa (evita llamadas excesivas)
let tasaCache = {
  tasaUSD: null,
  fecha: null,
  timestamp: null
};

// Tiempo de caché: 5 minutos (300000 ms)
const CACHE_DURATION = 60 * 60 * 1000;

export const currencyUtils = {
  // Obtener tasa con caché
  async getCachedTasaUSD() {
    const now = Date.now();
    
    // Si hay caché válido, usarlo
    if (tasaCache.tasaUSD && tasaCache.timestamp && 
        (now - tasaCache.timestamp) < CACHE_DURATION) {
      return tasaCache.tasaUSD;
    }
    
    // Obtener nueva tasa
    const tasaUSD = await tasaService.getTasaUSD();
    
    // Actualizar caché
    tasaCache = {
      tasaUSD,
      fecha: new Date().toISOString().split('T')[0],
      timestamp: now
    };
    
    return tasaUSD;
  },

  // Convertir dólares a bolívares
  async convertUsdToBs(dolares) {
    const tasa = await this.getCachedTasaUSD();
    const bolivares = dolares * tasa;
    return Math.round(bolivares * 100) / 100; // Redondear a 2 decimales
  },

  // Formatear moneda
  formatCurrency(amount, currency = 'USD') {
    const formatter = new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'VES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(amount);
  },

  // Obtener información completa de conversión
  async getConversionInfo(dolares) {
    const tasa = await this.getCachedTasaUSD();
    const bolivares = await this.convertUsdToBs(dolares);
    
    return {
      dolares,
      bolivares,
      tasa,
      formatted: {
        usd: this.formatCurrency(dolares, 'USD'),
        bs: this.formatCurrency(bolivares, 'VES'),
        tasa: `Bs. ${tasa.toFixed(2)}`
      }
    };
  }
};