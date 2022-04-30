import moduleAlias from 'module-alias';
import path from 'path';
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper';
import env from './config/env';

if (env.nodeEnv === 'development') {
  moduleAlias.addAlias('@', path.join(__dirname, '..', '..', 'src'));
} else {
  moduleAlias.addAlias('@', path.join(__dirname, '..', '..', 'dist'));
}

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default;
    app.listen(env.port, () => console.log(`Server Running at http://localhost:${env.port}`));
  })
  .catch(console.error);
