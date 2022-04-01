const UserModel = require("../model/User");
const tokenService = require("../services/tokenService");

const loginUser = async (user) => {
  let results = await UserModel.findOne({
    username: user.username,
  }).then(async (res) => {
    if (!res) {
      return await UserModel.findOne({
        phoneNumber: user.phoneNumber,
      });
    }
    return res;
  });

  if (!results) {
    return {
      code: 400,
      message: "Bad Request",
      details: "The User does not exist",
    };
  }

  return {
    user: results,
    token: await tokenService.getToken(),
  };
};

const logout = async (token) => {
  try {
    const isValidToken = await tokenService.validateToken(token);
    if (isValidToken) {
      await tokenService.revokeToken(token);
      return true;
    } else {
      return {
        code: 401,
        message: "Unautorized",
        details: "The token is not valid",
      };
    }
  } catch (error) {
    return {
      code: 500,
      message: "Internal Server Error",
      details: "An internal server error has occurred",
    };
  }
};

const getAll = async (token) => {
  const isValidToken = await tokenService.validateToken(token);
  if (isValidToken) {
    return await UserModel.find({});
  } else {
    return {
      code: 401,
      message: "Unautorized user",
      details: "The token is not valid",
    };
  }
};

const createUser = async (user) => {
  try {
    const isValidDataType = validateDataTypes(user);
    const userValidation = validateUser(user);

    if (!isValidDataType) {
      return {
        code: 400,
        details: "Invalid Json format",
      };
    }

    return await validateUserFormat(user)
      .then(async () => {
        if (userValidation.isValidUser) {
          const newUser = new UserModel(user);
          return await newUser.save();
        } else {
          return {
            code: 400,
            details: userValidation.details,
          };
        }
      })
      .catch(() => {
        return {
          code: 400,
          details: userValidation.details,
        };
      });
  } catch (error) {
    return {
      code: 500,
      details: error,
    };
  }
};

const validateUser = (user) => {
  let details = [];
  const nameRegex = /^([\w]){1,20}([\s]){0,1}([\w]{1,20})$/;
  const lastnameRegex = /^[a-zA-Z]{1,40}$/;
  const phoneRegex = /^[0-9]{10}$/;
  const usernameRegex = /^[a-zA-Z0-9]{1,40}$/;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex = /^[\w@.$#&%]{5,20}$/;
  let isValidUser = true;

  if (!nameRegex.test(user.name)) {
    details.push("Name is not correctly formed.");
    isValidUser = false;
  }

  if (!lastnameRegex.test(user.lastname)) {
    details.push("Lastname is not correctly formed.");
    isValidUser = false;
  }

  if (!lastnameRegex.test(user.secondLastName)) {
    details.push("Second lastname is not correctly formed.");
    isValidUser = false;
  }

  if (!phoneRegex.test(user.phoneNumber)) {
    details.push("Phone number is not correctly formed.");
    isValidUser = false;
  }

  if (!emailRegex.test(user.email)) {
    details.push("Email is not correctly formed.");
    isValidUser = false;
  }

  if (!usernameRegex.test(user.username)) {
    details.push("Username is not correctly formed.");
    isValidUser = false;
  }

  if (!passwordRegex.test(user.password)) {
    details.push("Password is not correctly formed.");
    isValidUser = false;
  }

  return {
    isValidUser,
    details,
  };
};

const validateUserFormat = async (user) => {
  try {
    await UserModel.validate(user)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  } catch (error) {
    return false;
  }
};

const validateDataTypes = (user) => {
  if (
    typeof user.name != "string" ||
    typeof user.lastname != "string" ||
    typeof user.phoneNumber != "string" ||
    typeof user.username != "string" ||
    typeof user.password != "string"
  ) {
    return false;
  }

  if (
    typeof user.secondLastName != "string" &&
    typeof user.secondLastName != "undefined" &&
    user.secondLastName != null
  ) {
    return false;
  }

  if (
    typeof user.email != "string" &&
    typeof user.email != "undefined" &&
    user.email != null
  ) {
    return false;
  }

  return true;
};

module.exports = {
  createUser,
  getAll,
  loginUser,
  logout,
};
