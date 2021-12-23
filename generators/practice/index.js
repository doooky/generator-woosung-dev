const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'title',
        message: '제목을 입력하세요.',
      },
    ]);
  }

  writing() {
    const templateHtmlPath = this.templatePath('index.html');
    const destHtmlPath = this.destinationPath('public/index.html');
    this.fs.copyTpl(templateHtmlPath, destHtmlPath, {
      title: this.answers.title,
    });
  }
};
