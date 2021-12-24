const fs = require('fs-extra');
const path = require('path');

const copy = () => {
  const buildPath = path.resolve(__dirname, '..', 'build');
  fs.copySync(path.resolve(__dirname, '..', 'static'), buildPath); 
}

copy();