import type { MetadataRoute } from 'next';

/**
 * Esta app contiene datos personales de menores. Se bloquea explícitamente a
 * TODOS los rastreadores —de buscadores y de IA (GPTBot, ClaudeBot, PerplexityBot,
 * Google-Extended, etc.)— para que el contenido nunca se indexe ni se cite.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', disallow: '/' }],
  };
}
