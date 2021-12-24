const chalk = require('chalk');

const header = (text) => {
  console.log(chalk.bgBlack.whiteBright.bold(`\n  ${text}  `))
}

const subtitle = (text) => {
  console.log(
    chalk.bgGray.whiteBright.bold(`\n  ${text}  `)
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
  subtitle,
  green,
  red
}