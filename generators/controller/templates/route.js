const express = require('express');

const router = express.Router();
const <%=controller%> = require('../controllers/<%=controller%>');
const wsApiMiddleware = require('../middleware/ws_api_auth').auth;

router.get('<%= route %>', wsApiMiddleware, <%=controller%>.get<%=controllerUpper%>);
router.post('<%= route %>', wsApiMiddleware, <%=controller%>.create<%=controllerUpper%>);
router.get('<%= route %>/:id', wsApiMiddleware, <%=controller%>.get<%=controllerUpper%>ById);
router.put('<%= route %>/:id', wsApiMiddleware, <%=controller%>.put<%=controllerUpper%>ById);
router.delete('<%= route %>/:id', wsApiMiddleware, <%=controller%>.delete<%=controllerUpper%>ById);

module.exports = router;
