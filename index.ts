import { ENVIRONMENT } from '@config/config';
import * as cdk from 'aws-cdk-lib';
import Frontend from './stacks/frontend';

const app = new cdk.App();
async function Main() {
  cdk.Tags.of(app).add('blog', 'pets-frontend-v2');

  const env = {
    region: ENVIRONMENT.region,
    account: ENVIRONMENT.account,
  };
  console.log('CDK ENV', env);

  new Frontend(app, 'pets-frontend-v2', { env });

  app.synth();
}

Main().catch((err) => {
  console.error(err);
  process.exit(1);
});
