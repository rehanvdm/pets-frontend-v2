/** The AWS Environment details */
export type EnvironmentConfig = {
  /** AWS region to deploy to */
  readonly region: string;
  /** AWS account to deploy to */
  readonly account: string;
  /** AWS profile to deploy with */
  readonly profile: string;
};

export const ENVIRONMENT: EnvironmentConfig = {
  region: 'us-east-1',
  account: '581184285249',
  profile: 'rehan-demo-exported',
} as const;
