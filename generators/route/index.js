'use strict';
const Generator = require('yeoman-generator');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    this.log(yosay("Let's create a restful controller for your model!"));

    const prompts = [
      {
        type: 'input',
        name: 'route',
        message: 'The route of your controller? ',
      },
      {
        type: 'input',
        name: 'controller',
        message: 'The name of your restful controller? ',
      },
      {
        type: 'input',
        name: 'model',
        message: 'The model you want a controller for? ',
      },
    ];

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('controller.js'),
      this.destinationPath(`./controllers/${this.props.controller}.js`),
      {
        controller: this.props.controller,
        controllerUpper:
          this.props.controller.charAt(0).toUpperCase() +
          this.props.controller.slice(1),
        model: this.props.model,
        modelUpper:
          this.props.model.charAt(0).toUpperCase() + this.props.model.slice(1),
        route: this.props.route,
      }
    );
    this.fs.copyTpl(
      this.templatePath('test.js'),
      this.destinationPath(`./__test__/${this.props.controller}.test.js`),
      {
        controller: this.props.controller,
        controllerUpper:
          this.props.controller.charAt(0).toUpperCase() +
          this.props.controller.slice(1),
        model: this.props.model,
        modelUpper:
          this.props.model.charAt(0).toUpperCase() + this.props.model.slice(1),
        route: this.props.route,
      }
    );
    this.fs.copyTpl(
      this.templatePath('route.js'),
      this.destinationPath(`./routes/${this.props.controller}.js`),
      {
        controller: this.props.controller,
        controllerUpper:
          this.props.controller.charAt(0).toUpperCase() +
          this.props.controller.slice(1),
        model: this.props.model,
        modelUpper:
          this.props.model.charAt(0).toUpperCase() + this.props.model.slice(1),
        route: this.props.route,
      }
    );
  }
};
