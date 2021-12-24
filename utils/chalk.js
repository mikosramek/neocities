const chalk = require('chalk');

const header = (text) => {
  console.log(chalk.bgBlack.whiteBright.bold(`\n  ${text}  `))
}

const footer = (text) => {
  console.log(
    chalk.bgGray.whiteBright.bold(`  ${text}  \n`)
  );
}

const green = (text) => {
  console.log(chalk.green(text));
}

const red = (text) => {
  console.log(chalk.red(text));
}


module.exports = {
  header,
  footer,
  green,
  red
}