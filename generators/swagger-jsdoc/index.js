'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs');
const YAML = require('json-to-pretty-yaml');

const { getComments, jsdocInfo } = require('./utils/paths/jsdocUtils');
const { getSwaggerDocument } = require('./utils/paths/index');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.log(
      yosay(
        'Welcome to ' +
          chalk.red('generator-woosung-dev') +
          ' generator!' +
          " Let's convert annotations"
      )
    );

    this.routeFilePath = args[0];
  }

  async writing() {
    const path = this.destinationPath('./routes/salesSlip.js');

    const commentList = await getComments(
      fs.readFileSync(path, 'utf8', (error, data) => {
        if (error) throw error;
        console.log(data);
      })
    ).then(await jsdocInfo());

    let result = {};
    for (const comment of commentList) {
      result = await getSwaggerDocument(result, comment);
    }
    console.log(YAML.stringify(result));
  }
};
