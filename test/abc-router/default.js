var express = require("abc");
var router = express.Router();

router.get('/a_get', (req, res) => {
  res.json({ order: [] });
});

router.post('/a_post', (req, res) => {
  res.json({ order: [] });
});

router.put('/a_put', (req, res) => {
  res.json({ order: [] });
});

router.delete('/a_delete', (req, res) => {
  res.json({ order: [] });
});

module.exports = router;
