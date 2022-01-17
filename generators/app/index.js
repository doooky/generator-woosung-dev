"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        "Welcome to the primo " +
          chalk.red("generator-swagger-es-6") +
          " generator!"
      )
    );

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "Your project name.",
        default: this.appname,
      },
      {
        type: "input",
        name: "author",
        message: "Your name.",
        store: true,
      },
      {
        type: "input",
        name: "description",
        message: "Write a description.",
        default: "",
      },
      {
        type: "input",
        name: "git",
        message: "Your git repository.",
        default: "",
      },
      {
        type: "confirm",
        name: "auth",
        message: "Would you an authentication boilerplate?",
      },
      {
        type: "confirm",
        name: "eslint",
        message: "Would you like to enable eslint with airbnb config?",
      },
      {
        type: "checkbox",
        name: "CI",
        message: "Which CI's would you like to use?",
        choices: [
          {
            name: "travis",
            value: "Travis-CI",
            checked: false,
          },
          {
            name: "appveyor",
            value: "Appveyor",
            checked: false,
          },
        ],
      },
      {
        type: "confirm",
        name: "docker",
        message: "Would you like to deploy with docker?",
      },
      {
        type: "confirm",
        name: "heroku",
        message: "Initialize Procfile for heroku?",
      },
    ];

    return this.prompt(prompts).then((props) => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {}

  parseGitReopName(git) {
    var regex = new RegExp(/(?:\.[a-z]+[\:|\/])(.+)(?:\.git)/); // eslint-disable-line no-useless-escape
    var match = String(git).match(regex);
    if (match) {
      return match[1];
    }
    return "";
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false,
    });
  }
};
