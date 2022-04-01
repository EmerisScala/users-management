var express = require("express");
var router = express.Router();
const userService = require("../services/userService");

/* GET users listing. */
router.get("/user", async function (req, res, next) {
  try {
    if (req.headers["token"]) {
      await userService
      .getAll(req.headers["token"])
      .then((result) => {
        if(!result.code){
          res.send(result);
        } else {
          res.status(result.code).send({
            code: result.code + "01",
            message: result.message,
            details: result.details,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          code: 500,
          message: "Internal Server Error",
          details: err,
        });
      });
    } else {
      res.status(400).send({
        code: 400 + "01",
        message: "Bad Request",
        details: "The request is not valid",
      });
    }
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: "Internal Server Error",
      details: error,
    });
  }
})

/* POST Create a user. */
router.post("/user", async function (req, res, next) {
  try {
    await userService
      .createUser(req.body)
      .then((result) => {
        if (!result.code) {
          res.status(201).send({
            message: "Successful Operation",
          });
        } else {
          res.status(result.code).send({
            code: result.code + "01",
            message: "Bad Request",
            details: result.details,
          });
        }
      })
      .catch((error) => {
        res.status(500).send({
          code: 500,
          message: "Internal Server Error",
          details: error,
        });
        console.log(error);
      });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: "Internal Server Error",
      details: error,
    });
    console.log(error);
  }
  //res.send('Hi im a post /user');
});

/* POST Autenticate user. */
router.post("/user/login", async function (req, res, next) {
  try {
    await userService.loginUser(req.body).then((result) => {
      if (!result.code) {
        res.send(result);
      } else {
        res.status(result.code).send({
          code: result.code + "01",
          message: "Bad Request",
          details: result.details,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      code: 500,
      message: "Internal Server Error",
      details: error,
    });
  }
});

/* Delete Remove User session. */
router.delete("/user/logout", async function (req, res, next) {
  try {
    if (req.headers["token"]) {
      const logoutResult = await userService.logout(req.headers["token"]);
      if (!logoutResult.code) {
        res.send({
          message: "Successful Operation",
        });
      } else {
        res.status(logoutResult.code).send({
          code: logoutResult.code + "01",
          message: "Bad Request",
          details: logoutResult.details,
        });
      }
    } else {
      res.status(400).send({
        code: 400 + "01",
        message: "Bad Request",
        details: "The request is not valid",
      });
    }
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: "Internal Server Error",
      details: error,
    });
  }
});

module.exports = router;
