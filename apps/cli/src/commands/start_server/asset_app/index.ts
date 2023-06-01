import Koa from 'koa';
import range from 'koa-range';
import serve from 'koa-static';
import etag from 'koa-etag';
import catcher from '@/commands/start_server/middlewares/catcher';
import parasite from '@/commands/start_server/middlewares/parasite';
import { getAssetDirectory } from '../../../config';
import router from './router';

export function getAssetApp() {
  const app = new Koa();
  app.use(parasite);
  app.use(catcher());
  app.use(range);
  app.use(etag());
  app.use(router.routes()).use(router.allowedMethods());
  app.use(
    serve(getAssetDirectory(), {
      /**
       * maxAge 标准单位秒 koa-static 毫秒
       * @author mebtte<hi@mebtte.com>
       */
      maxAge: 1000 * 60 * 60 * 24 * 365, // 一年
    }),
  );
  return app;
}
