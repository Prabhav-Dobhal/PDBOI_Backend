const express = require("express");
const router = express.Router();

const loginController = require("../controllers/login");
const signUpController = require("../controllers/signup");
const getUserInfoController = require("../controllers/getuserinfo");
const verifytransactionController = require("../controllers/verifytransaction");
const transferController = require("../controllers/transfer");
const getTransactionHistoryController = require("../controllers/gettransactionhistory");

router.post("/login", loginController.login);
router.post("/signup", signUpController.signup);
router.post("/getuserinfo", getUserInfoController.getuserinfo);
router.post(
  "/verifytransaction",
  verifytransactionController.verifytransaction
);
router.post("/transfer", transferController.transfer);
router.post(
  "/gettransactionhistory",
  getTransactionHistoryController.getTransactionHistory
);

module.exports = router;
