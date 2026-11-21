import type { IncomingMessage, ServerResponse } from 'node:http';
import { getApp } from '../server/app.ts';

function normalizeVercelApiUrl(rawUrl: string | undefined): string {
  const urlStr = rawUrl || '/api';
  try {
    const parsed = new URL(urlStr, 'http://localhost');
    const rewrittenPath = parsed.searchParams.get('__path');

    if (rewrittenPath !== null) {
      parsed.searchParams.delete('__path');
      const cleanPath = rewrittenPath.replace(/^\/+/, '');
      const qs = parsed.searchParams.toString();
      return `/api/${cleanPath}${qs ? `?${qs}` : ''}`;
    }

    if (parsed.pathname === '/api/index') {
      const qs = parsed.searchParams.toString();
      return `/api${qs ? `?${qs}` : ''}`;
    }

    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return urlStr;
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    req.url = normalizeVercelApiUrl(req.url);
    const app = await getApp();
    return app(req as any, res as any);
  } catch (err: any) {
    console.error('Vercel Serverless handler error:', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(
        JSON.stringify({
          success: false,
          error: 'Erreur de communication avec le serveur backend.',
        })
      );
    }
  }
}
