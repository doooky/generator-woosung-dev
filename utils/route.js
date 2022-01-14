class Route {
  constructor(route) {
    this.route = route;
    this._splittedRoute = this.route.split('/').splice(1);
  }

  getControllerName() {
    // 컨트롤러 명을 체크한다.
    return this._getRouteEntity();
  }

  getRoutePath() {
    let routeArray = this._splittedRoute;
    if (this._isLastPathAParam()) {
      routeArray.pop();
      routeArray.push('key');
    }
    return `./swagger/paths/${routeArray[0]}/${
      routeArray[routeArray.length - 1]
    }.yaml`;
  }

  getRoutePathDir() {
    let routeArray = this._splittedRoute;
    if (this._isLastPathAParam()) {
      routeArray.pop();
      routeArray.push('key');
    }
    return `./swagger/paths/${routeArray[0]}/`;
  }

  // operation과 route명으로 method명 생성
  getOperationId(operation) {
    const operationName = operation !== 'post' ? operation : 'create';
    const parameter = this._isLastPathAParam()
      ? this._splittedRoute[this._splittedRoute.length - 1]
          .replace('{', '')
          .replace('}', '')
      : null;
    return parameter
      ? `${operationName}${this._splittedRoute[0]}From${this._capitalize(
          parameter
        )}`
      : `${operationName}${this._splittedRoute[0]}`;
  }

  _capitalize(string) {
    if (!string) {
      throw new Error('Trying to capitalize an empty string');
    }
    return `${string.charAt(0).toUpperCase() + string.slice(1)}`;
  }

  _getRouteEntity() {
    return this._isLastPathAParam()
      ? this._splittedRoute[this._splittedRoute.length - 2]
      : this._splittedRoute[this._splittedRoute.length - 1];
  }

  //route의 마지막에 pathParam이 있는지 체크
  _isLastPathAParam() {
    return this._isPathFragmentAParameter(
      this._splittedRoute[this._splittedRoute.length - 1]
    );
  }
  _isPathFragmentAParameter(pathFragment) {
    return pathFragment.indexOf('{') >= 0;
  }

  _hasAVersionPrefix() {
    const prefix = this._splittedRoute[0];
    const versionNumber = prefix.substring(1);
    return (
      prefix.length && prefix.charAt(0) === 'v' && parseInt(versionNumber) > 0
    );
  }

  getDefaultRouteFileName() {
    const result = this._getRouteEntity();
    return this._hasAVersionPrefix()
      ? `${this._splittedRoute[0]}/${result}`
      : result;
  }
}

module.exports = Route;
