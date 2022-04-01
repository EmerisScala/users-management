var jwt = require("jsonwebtoken");
const TokenModel = require("../model/Token");

const getToken = async () => {
  const token = jwt.sign({ data: "emeris" }, "secret", { expiresIn: "1h" });
  await new TokenModel({ token: token, valid: true }).save();
  return token
};

const validateToken = async (token) => {
  console.log(token)
  try {
    var decoded = jwt.verify(token, "secret").data;
    let isValid = await TokenModel.findOne({ token }).then(foundedToken => {
      if(foundedToken){
        return foundedToken.valid
      }
    })
    if (decoded === "emeris" && isValid === true) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

const revokeToken = async (token) => {
    try {
        await TokenModel.findOne({ token }).then(async (results) => {
            if(results){
                await TokenModel.replaceOne({ _id: results._id }, { token, valid: false })
            }
        })
      } catch (err) {
        console.log(err)
      }
}

module.exports = {
  getToken,
  validateToken,
  revokeToken
};
