const _getPath = async (jsdocInfo) => {
  const description = jsdocInfo;
  const paths = description.split(' ');
  const path = paths[1];
  const httpMethod = paths[0];

  return {
    path,
    httpMethod,
  };
};

const _getDocInfo = async (paths, jsdocInfo) => {
  const { path, httpMethod } = await _getPath(paths);
  const result = {};
  const document = {};

  for (const doc of jsdocInfo) {
    const { title, description } = doc;
    switch (title) {
      case 'description':
        document.description = description;
        break;
      case 'tags':
        document.tags = [description];
        break;
      case 'summary':
        document.summary = description;
        break;
      case 'param':
        document.parameters = await _getParameter(description);
        break;
      case 'return':
        document.responses = await _getResponse(doc);
        break;
      default:
        throw 'error';
    }
  }

  return {
    docInfo: document,
    path,
    httpMethod,
  };
};

const _getParameter = async (docInfo) => {};

const _getResponse = async (docInfo) => {
  const { description, type } = docInfo;
  const path = description.split('-').map((x) => _rtrim(_ltrim(x)));

  const result = {};
  for (let i = 0; i < path.length; i++) {
    const obj = {};
    switch (i) {
      case 0: // response status
        result[`${path[i]}`] = {};
        break;
      case 1: // status description
        result[`${path[i - 1]}`].description = path[i];
        break;
      case 2: // content
        obj[path[i]] = {};
        if (type) {
          obj[path[i]] = await _getResponseType(type);
        }
        result[`${path[i - 2]}`].content = obj;
        break;
      default:
        throw 'error';
    }
  }

  return result;
};

const _getResponseType = async (type) => {
  const result = {};
  switch (type.type) {
    case 'NameExpression':
      result.schema = {
        type: type.name,
        items: {},
      };
      break;
    case 'TypeApplication':
      result.schema = {
        type: 'object',
        properties: {},
      };
      result.schema.properties[type.applications[0].name] = {
        type: type.expression.name,
        items: {},
      };
      break;
    default:
      throw 'return type error';
  }

  return result;
};

// 왼쪽에 있는 공백을 제거한다.
function _ltrim(value) {
  return value.replace(/^\s+/, '');
}
// 오른쪽에 있는 공백을 제거한다.
function _rtrim(value) {
  return value.replace(/\s+$/, '');
}

const getSwaggerDocument = async (result, comment) => {
  const { description, tags } = comment; //path와 이하 분리
  const { docInfo, path, httpMethod } = await _getDocInfo(description, tags);
  if (!result[path]) {
    result[path] = {};
  }
  switch (httpMethod) {
    case 'get':
      result[path].get = docInfo;
      break;
    case 'post':
      result[path].post = docInfo;
      break;
    case 'put':
      result[path].put = docInfo;
      break;
    case 'delete':
      result[path].delete = docInfo;
      break;
    default:
      throw 'error';
  }

  return result;
};

module.exports = {
  getSwaggerDocument,
};
