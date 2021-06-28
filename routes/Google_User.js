const express = require('express')
const router = express.Router();

router.get('/login', async (req, res) => {
  try{

  }
  catch(err) {
    console.error(err)
    process.exit(1);
  }
})

module.exports = {
  GoogleRoute: router,
}