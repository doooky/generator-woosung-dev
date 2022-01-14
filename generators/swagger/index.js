'use strict';
const Generator = require('yeoman-generator');
var path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const yosay = require('yosay');
const SWAGGER_INDEX_FILE_PATH = './swagger-development.yaml';
const enums = require('../../utils/enums');
const seq = require('promise-sequential');
const Route = require('../../utils/route');
const yamljs = require('yamljs');
const YAML = require('json-to-pretty-yaml');
const mkdirp = require('mkdirp');

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

    this.log(
      yosay(
        'Welcome to the primo ' +
          chalk.red('generator-woosung-dev') +
          ' generator!'
      )
    );

    this.routeName = args[0];
    this.route = new Route(this.routeName);

    this.initPrompts = [
      // {
      //   type: 'input',
      //   name: 'routeController',
      //   message: `controller명을 입력해주세요.`,
      //   default: this.route.getControllerName(),
      // },
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
        name: 'tags',
        message: '%operation% 작업에 대한 tags를 입력해주세요.',
      },
      {
        type: 'input',
        name: 'summary',
        message: '%operation% 작업에 대한 summary를 입력해주세요.',
      },
      {
        type: 'input',
        name: 'description',
        message: '%operation% 작업에 대한 description을 입력해주세요.',
      },
      // {
      //   type: 'input',
      //   name: 'id',
      //   message: '함수 이름을 입력해주세요.',
      //   default: ``,
      // },
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

  prompting(routeName) {
    return this.prompt(this.initPrompts)
      .then((props) => seq(this._promptOperations(props)))
      .then((data) => {
        this.props = data[data.length - 1];
      });
  }

  _promptOperations(props) {
    const originalMessage0 = this.operationPrompts[0].message;
    const originalMessage1 = this.operationPrompts[1].message;
    const originalMessage2 = this.operationPrompts[2].message;
    // const defaultValue = this.operationPrompts[1].default;

    return props.operations.map((operation, i) => () => {
      this.operationPrompts[0].message = originalMessage0.replace(
        '%operation%',
        operation.toUpperCase()
      );
      this.operationPrompts[1].message = originalMessage1.replace(
        '%operation%',
        operation.toUpperCase()
      );
      this.operationPrompts[2].message = originalMessage2.replace(
        '%operation%',
        operation.toUpperCase()
      );

      // this.operationPrompts[1].default = this.route.getOperationId(operation);
      return this.prompt(
        this._createUniqueParameters(this.operationPrompts, operation)
      )
        .then((operationResults) => {
          const op = props.operations[i];
          props.operations[i] = {
            operation: op,
            tags: operationResults[`${operation}:tags`],
            summary: operationResults[`${operation}:summary`],
            description: operationResults[`${operation}:description`],
            // id: operationResults[`${operation}:id`],
          };
          return props;
        })
        .then(() => this._promptParameters([], operation, 1))
        .then((parameters) => {
          props.operations[i].parameters = parameters.map((parameter, j) => {
            return {
              name: parameter[`${operation}:${j + 1}:name`],
              in: parameter[`${operation}:${j + 1}:in`],
              type: parameter[`${operation}:${j + 1}:type`],
              description: parameter[`${operation}:${j + 1}:description`],
            };
          });
          return props;
        });
    });
  }

  _createUniqueParameters(prompts, prefix) {
    // operation, param별로 구분할 수 있도록 unique param명 변경
    let newPrompts = [];
    prompts.forEach((prompt) => {
      let newPrompt = Object.assign({}, prompt);
      newPrompt.name = `${prefix}:${prompt.name}`;
      newPrompts.push(newPrompt);
    });
    return newPrompts;
  }

  _promptParameters(parameters = [], operation, i = 1) {
    return this.prompt(
      this._createUniqueParameters(
        this.moreParametersPrompts,
        `${operation}:${i}`
      )
    ).then((res) => {
      if (res[`${operation}:${i}:newParam`]) {
        return this.prompt(
          this._createUniqueParameters(
            this.parametersPrompts,
            `${operation}:${i}`
          )
        ).then((results) => {
          parameters.push(results);
          return this._promptParameters(parameters, operation, i + 1);
        });
      } else {
        return parameters;
      }
    });
  }

  writing(routeName) {
    const swaggerPathFileContent = this._buildPathFile(this.props);
    this._addRouteToSwagger(routeName);
    this._createSwaggerPathFile(swaggerPathFileContent);
    return Promise.resolve();
  }

  _createSwaggerPathFile(content) {
    if (!fs.existsSync(this.destinationPath(this.route.getRoutePathDir()))) {
      fs.mkdirSync(this.destinationPath(this.route.getRoutePathDir()), {
        recursive: true,
      });
    }

    return fs.appendFile(
      this.destinationPath(this.route.getRoutePath()),
      YAML.stringify(content),
      (err) => {
        console.log('==================================================\n');
        if (err) {
          console.log(chalk.bold('paths file written ' + chalk.red('fail')));
          console.log('error message :');
          console.log(err);
        } else {
          console.log(
            chalk.bold('paths file written ' + chalk.blue('successfully'))
          );
          console.log(chalk.yellow('add text :'));
          console.log(YAML.stringify(content));
        }
        console.log('==================================================');
      }
    );
  }

  _addRouteToSwagger(routePath) {
    let swaggerIndex = yamljs.load(
      this.destinationPath(SWAGGER_INDEX_FILE_PATH)
    );
    swaggerIndex.paths[routePath] = {
      $ref: this.route.getRoutePath(),
    };

    // return this.fs.writeJSON(
    //   this.destinationPath(SWAGGER_INDEX_FILE_PATH),
    //   swaggerIndex,
    //   null,
    //   4
    // );

    return fs.writeFile(
      this.destinationPath(SWAGGER_INDEX_FILE_PATH),
      YAML.stringify(swaggerIndex),
      (err) => {
        console.log('==================================================\n');
        if (err) {
          console.log(chalk.bold('swagger file written ' + chalk.red('fail')));
          console.log('error message :');
          console.log(err);
        } else {
          console.log(
            chalk.bold('swagger file written ' + chalk.blue('successfully'))
          );
          console.log(chalk.yellow('add text :'));
          console.log(YAML.stringify(swaggerIndex.paths[routePath]));
        }
        console.log('==================================================');
      }
    );
  }

  _buildPathFile(props) {
    let file = {};
    props.operations.forEach((operation) => {
      file[operation.operation] = {
        tags: operation.tags,
        summary: operation.summary,
        description: operation.description,
        // sumary: operation.id,
        // 'x-swagger-router-controller': props.routeController,
        // operationId: operation.id,
        parameters: operation.parameters.map((parameter) => {
          return {
            name: parameter.name,
            in: parameter.in,
            description: parameter.description,
            type: parameter.type,
          };
        }),
        responses: {
          200: {
            description: '200',
          },
          500: {
            description: '500 error',
          },
        },
      };
    });
    return file;
  }
};
