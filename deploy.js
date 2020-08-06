const path = require('path');
const spawn = require('cross-spawn');
const pkg = require('./package.json');

function shell(command, directory) {
    console.log('$ ' + command);

    const args = command.split(' ');
    const cmd = args.shift();

    const result = spawn.sync(cmd, args, {
        cwd: directory || process.cwd(),
        env: process.env,
        stdio: 'inherit',
        encoding: 'utf-8',
    });
    if (result.status !== 0) {
        throw new Error('error with exit code ' + result.status);
    }
}

(function () {
    const commands = [
        // git config
        "git config user.name 'Robotism'",
        "git config user.email 'zlhc@live.com'",

        // registry to npmjs
        'npm config set registry https://registry.npmjs.org',

        // check
        'yarn prettier',
        'yarn lint-code',
        'yarn lint-style',
        // build
        'yarn build',
        // publish
        'npm publish --access=public',

        // registry to taobao
        'npm config set registry https://registry.npm.taobao.org',
    ];

    commands.forEach(function (cmd) {
        try {
            shell(cmd, path.resolve(process.cwd(), './'));
        } catch (err) {
            process.exit(result.status);
        }
    });
})();
