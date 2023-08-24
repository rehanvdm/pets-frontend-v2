import * as path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import execa from 'execa';
import { ENVIRONMENT } from '@config/config';
import console from 'console';

const baseDir = '../';
const paths = {
  workingDir: path.resolve(__dirname, baseDir),
  src: path.resolve(__dirname, baseDir, 'src'),
  srcFrontend: path.resolve(__dirname, baseDir, 'src', 'frontend'),
  srcFrontendDist: path.resolve(__dirname, baseDir, 'src', 'frontend', 'dist'),
};

async function runCommand(
  command: string,
  args: string[] | string,
  options: execa.Options<string> = {},
  echoCommand: boolean = true,
  exitProcessOnError: boolean = true
) {
  if (!Array.isArray(args)) args = args.split(' ');

  if (echoCommand) console.log('> Running:', command, args.join(' '));

  const resp = await execa(command, args, { ...options, preferLocal: true, reject: false });

  if (resp.exitCode !== 0) {
    if (exitProcessOnError) {
      console.error(resp.stderr || resp.stdout);
      process.exit(1);
    } else throw new Error(resp.stderr || resp.stdout);
  }

  console.log(resp.stdout);
}

const commands = ['cdk-diff', 'cdk-deploy', 'validate-src', 'build-src', 'dev'] as const;
export type Command = (typeof commands)[number];

const argv = yargs(hideBin(process.argv))
  .option('command', {
    alias: 'c',
    describe: 'the command you want to run',
    choices: commands,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .demandOption(['c']).argv as any;

(async () => {
  const command = argv.c as Command;
  switch (command) {
    case 'cdk-diff':
      await cdkCommand('diff');
      break;
    case 'cdk-deploy':
      await cdkCommand('deploy');
      break;
    case 'validate-src':
      await validateSrc();
      break;
    case 'build-src':
      await buildSrc();
      break;
    case 'dev':
      await frontendDev();
      break;

    default:
      throw new Error('Unknown command: ' + command);
  }
})();

async function cdkCommand(command: 'diff' | 'deploy') {
  let extraArgs = '';
  if (command === 'deploy') extraArgs = '--require-approval never';

  await runCommand('cdk', `${command} "**" --profile ${ENVIRONMENT.profile} ${extraArgs}`, {
    cwd: paths.workingDir,
    stdout: 'inherit',
    stderr: 'inherit',
  });
}

async function buildSrc() {
  await runCommand('npm', 'run build', { cwd: paths.srcFrontend });
}

async function validateSrc() {
  await runCommand('tsc', ['--noEmit'], { cwd: paths.workingDir });
  await runCommand('eslint', ['**/*.ts', '--ignore-pattern', "'**/*.d.ts'", '--fix'], { cwd: paths.workingDir });
}

async function frontendDev() {
  await runCommand('npm', 'run dev', { cwd: paths.srcFrontend, stdout: 'inherit', stderr: 'inherit' });
}
