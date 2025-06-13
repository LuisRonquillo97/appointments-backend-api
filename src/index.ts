import express from 'express';
import cors from 'cors';
import httpContext from 'express-http-context';
import crypto from 'crypto';
import fs from 'fs';
import 'reflect-metadata';
import { AppDataSource } from './infrastructure/config/database';
import 'dotenv/config';
import routes from './infrastructure/routes/index.routes';
import { errorHandler } from './infrastructure/middlewares/error-handler.middleware';
import { requestLogger } from './infrastructure/middlewares/request-logger.middleware';
import { SeedService } from './infrastructure/services/seed.service';

const app = express();
const port = 3000;
const INFO_PACKAGE = JSON.parse(fs.readFileSync('./package.json').toString());

// Initialize database connection
AppDataSource.initialize()
  .then(async () => {
    console.log('Data Source has been initialized!');

    // Seed the database with default data
    const seedService = new SeedService();
    await seedService.seedUsers();
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

app.disable('x-powered-by');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(httpContext.middleware);
app.use(requestLogger);
app.use((_req, res, next) => {
  const uuidReq = crypto.randomUUID();
  httpContext.set('id_tracking', uuidReq);
  res.set('X-API-Version', INFO_PACKAGE.version);
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.set(
    'Content-Security-Policy',
    "default-src 'none'; frame-ancestors 'none'; form-action 'self'"
  );
  next();
});

app.use('/api/v1', routes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});

app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`Server is listening on ${port}`);
});
