const { program } = require('commander');
const { MultiSelect } = require('enquirer');
const { _branches, _delete, _update, _rebase } = require('./commands');

program.version('1.0.0');
program.option('-u, --update', 'update selected branches');
program.option('-d, --delete', 'delete selected branches');
program.option('-r, --rebase', 'rebase selected branches');
program.option('-b, --base <base>', 'base branch to rebase against (if rebase is selected)', 'develop');
program.parse(process.argv);

const options = program.opts();

console.log(options);

let command = undefined;

if (options.update) {
  command = _update;
} else if (options.delete) {
  command = _delete;
} else if (options.rebase) {
  command = b => _rebase('develop', b);
} else {
  console.log('Select an option');
  process.exit(1);
}

(async function () {
  const allBranches = await _branches();

  const branchPrompt = new MultiSelect({
    name: 'branches',
    message: 'Select your branches',
    choices: allBranches
  });

  const chosenBranches = await branchPrompt.run();

  for (let b of chosenBranches) {
    try {
      await command(b);
    } catch (err) {
      process.stderr.write(err + '\n');
      process.exit(1);
    }
  }
}());
