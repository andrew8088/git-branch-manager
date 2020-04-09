const { branch, remote, pull, checkout, rebase } = require('./git');

exports._branches = () =>
  branch()
    .then(raw => raw.trim().split('\n').map(s => s.trim().replace(/^\* /,'')));

exports._delete = branchName =>
  branch('-D', branchName)
    .then(() => console.log(`Deleted ${branchName}`));

exports._update = branchName =>
  checkout(branchName)
    .then(() => remote('prune origin'))
    .then(() => pull('--ff-only'))
    .then(() => console.log(`Updated ${branchName}`));

exports._rebase = (base, branchName) =>
  exports._update(base)
    .then(() => checkout(branchName))
    .then(() => rebase(base));
