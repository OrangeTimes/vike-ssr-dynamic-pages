import Fastify from 'fastify';
import { renderPage } from 'vike/server';
import { root } from './root.js';
import { copy, pathExists} from 'fs-extra/esm';
// import Import from "@reejs/imports";
const isProduction = process.env.NODE_ENV === 'production';

const development = {
    logger:
    {
      transport: {
        target: 'pino-pretty',
        options: {
          minimumLevel: 'DEBUG',
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    disableRequestLogging: true,
    http2: false,
  };
  
  const production = {
    logger: false
  };

  async function buildServer() {
    const app = Fastify( isProduction ? production : development
    );
  
    await app.register(import('@fastify/compress'), { global: true });
    if (isProduction) {
      // In production, we need to serve our static assets ourselves.
      // (In dev, Vite's middleware serves our static assets.)
      await app.register(import('@fastify/static'), {
        root: root + '/dist/client/assets',
        prefix: '/assets/',
      });
    } else {
      // We instantiate Vite's development server and integrate its middleware to our server.
      // ⚠️ We instantiate it only in development. (It isn't needed in production and it
      // would unnecessarily bloat our production server.)
      const vite = await import('vite');
      const viteDevMiddleware = (
        await vite.createServer({
          server: {
            middlewareMode: true,
          },
        })
      ).middlewares;
  
      // this is middleware for vite's dev servert
      app.addHook('onRequest', async (request, reply) => {
        const next = () => new Promise<void>((resolve) => {
          viteDevMiddleware(request.raw, reply.raw, () => resolve());
        });
        await next();
      });
    }

    app.get('/dynamic/:pageName', async (request, reply) => {
      const { pageName } = request.params;

      // Emulate dynamic download from some server
      const destination = `${root}/dynamic/${pageName}/+Page.js`
      await copy(`${root}/server/Page.js`, destination)
      const pageExists = await pathExists(destination)
      if (!pageExists) {
        reply.status(500).send({ error: 'Page wasn\'t copied' });
        return;
      } else {
        console.log("Page exists");
      }

      const pageContextInit = {
        urlOriginal: request.raw.url || '',
      };
      const pageContext = await renderPage(pageContextInit);
      const { httpResponse } = pageContext;
      if (!httpResponse) {
        reply.callNotFound();
        return;
      } else {
        const { statusCode, headers } = httpResponse;
        headers.forEach(([name, value]) => reply.raw.setHeader(name, value));
  
        reply.status(statusCode);
        httpResponse.pipe(reply.raw);
        return reply;
      }
    });

    return app;
  }

  async function main() {
    const fastify = await buildServer();
  
    const port = process.env.PORT || 3000;
    fastify.listen({ port: +port }, function (err, address) {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  }
  
  main();
  
  