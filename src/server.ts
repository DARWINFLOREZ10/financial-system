import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`Financial System API listening on port ${env.PORT}`);
});
