/**
 * controller 생성 폼입니다.
 * GET     <%= controller %>              ->  get<%= controllerUpper %>
 * POST    <%= controller %>              ->  create<%= controllerUpper %>
 * GET     <%= controller %>/:id          ->  get<%= controllerUpper %>byId
 * PUT     <%= controller %>/:id          ->  create<%= controllerUpper %>byId
 * PATCH   <%= controller %>/:id          ->  update<%= controllerUpper %>byId
 * DELETE  <%= controller %>/:id          ->  delete<%= controllerUpper %>byId
 */

const <%= model %>Service = require('../service/<%= model %>');
const { serializeError } = require('serialize-error');
const dateUtils = require('../utils/dateUtils');
const commonUtils = require('../utils/commonUtils');
// Gets a list of persons
exports.get<%= controllerUpper %> = (req, res) => {
  try {
    const result = await <%= model %>Service.get<%= modelUpper %>();
    return res.json(result);
  } catch (error) {
    const serializedError = serializeError(error);
    console.error(serializedError);
    return res.status(500).json(serializedError);
  }
}

// Gets a specific <%= controller %> by id
exports.create<%= controllerUpper %> = (req, res) =>{
  try {
    const { <%= controller %>s } = req.body;
    const result = await <%= model %>Service.create<%= modelUpper %>(<%= controller %>s);
    return res.json(result);
  } catch (error) {
    const serializedError = serializeError(error);
    console.error(serializedError);
    return res.status(500).json(serializedError);
  }
}
// Gets a list of persons
exports.get<%= controllerUpper %>ById = (req, res) => {
  try {
    const { id } = req.params;
    const result = await <%= model %>Service.get<%= modelUpper %>(id);
    return res.json(result);
  } catch (error) {
    const serializedError = serializeError(error);
    console.error(serializedError);
    return res.status(500).json(serializedError);
  }
}

// Gets a list of persons
exports.update<%= controllerUpper %>ById = (req, res) => {
  try {
    const { id } = req.params;
    const { <%= controller %>s } = req.body;
    const result = await <%= model %>Service.update<%= modelUpper %>(id, <%= controller %>s);
    return res.json(result);
  } catch (error) {
    const serializedError = serializeError(error);
    console.error(serializedError);
    return res.status(500).json(serializedError);
  }
}

// Gets a specific <%= controller %> by id
exports.delete<%= controllerUpper %>ById = (req, res) => {
  try {
    const { id } = req.params;
    const result = await <%= model %>Service.delete<%= modelUpper %>(id);
    return res.json(result);
  } catch (error) {
    const serializedError = serializeError(error);
    console.error(serializedError);
    return res.status(500).json(serializedError);
  }
}

