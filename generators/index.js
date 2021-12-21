const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async prompting() {
    this.answers = await this.prompt([
      // 사용자로부터 입력을 받음.
      {
        type: 'input',
        name: 'name',
        message: '프로젝트명을 입력하세요.',
        default: this.appname, // 현재 폴더네임
      },
      {
        type: 'confirm',
        name: 'cool',
        message: '모두 입력했습니까?',
      },
    ]);

    this.log('app name', this.answers.name);
    this.log('cool feature', this.answers.cool);
  }
};
