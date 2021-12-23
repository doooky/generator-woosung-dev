'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const enums = require('../../utils/enums');
const Route = require('../../utils/route');

const OPERATIONS = Object.keys(enums.SWAGGER_OPERATIONS).map((key, i) => {
  return {
    name: enums.SWAGGER_OPERATIONS[key],
    value: enums.SWAGGER_OPERATIONS[key],
    checked: i === 0,
  };
});

const SWAGGER_PARAMETERS_IN = Object.keys(enums.SWAGGER_PARAMETERS_IN).map(
  (key) => {
    return {
      name: enums.SWAGGER_PARAMETERS_IN[key],
      value: enums.SWAGGER_PARAMETERS_IN[key],
    };
  }
);

const SWAGGER_PARAMETERS_TYPE = Object.keys(enums.SWAGGER_PARAMETERS_TYPE).map(
  (key) => {
    return {
      name: enums.SWAGGER_PARAMETERS_TYPE[key],
      value: enums.SWAGGER_PARAMETERS_TYPE[key],
    };
  }
);

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.routeName = args[0];
    this.route = new Route(this.routeName);

    this.initPrompts = [
      {
        type: 'input',
        name: 'routeController',
        message: `route를 입력해주세요.`,
        default: this.route.getControllerName(),
      },
      {
        type: 'checkbox',
        name: 'operations',
        message: `Http method를 선택해주세요.`,
        choices: OPERATIONS,
      },
    ];
    this.operationPrompts = [
      {
        type: 'input',
        name: 'description',
        message: 'description을 입력해주세요.',
      },
      {
        type: 'input',
        name: 'id',
        message: '함수 이름을 입력해주세요.',
        default: ``,
      },
    ];

    this.moreParametersPrompts = [
      {
        type: 'confirm',
        name: 'newParam',
        message: '파라미터를 추가하시겠습니까?',
      },
    ];
    this.parametersPrompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Parameter name:',
      },
      {
        type: 'list',
        name: 'in',
        message: 'Parameter In:',
        choices: SWAGGER_PARAMETERS_IN,
      },
      {
        type: 'list',
        name: 'type',
        message: 'Parameter Type:',
        choices: SWAGGER_PARAMETERS_TYPE,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Parameter Description:',
      },
    ];
  }

  prompting() {
    this.log(yosay("Let's create a swagger api document!"));

    return this.prompt(this.initPrompts).then((props) => {
      this.props = props;
    });
  }
};
