const userModule = require("../modules/user.module");
const registerModule = require("../modules/registerSecretNumber.module");
const auth = require("../auth/auth");



const register = (req, res) => {
  const { userName, email, password, registerNumber } = req.body;
    registerModule.findOne({ registerNumber: registerNumber }, (err, data) => {
      if (err) {
        return res.sendStatus(401);
      }
      userModule.findOne({ email: email }, (err, data) => {
        if (err) {
          return res.status(401).send("user already exist");
        }
        const tokens =  auth.createTokens(req, "user");
        // return res.json({ token: tokens})
        console.log(tokens);
        const user = new userModule({
          userName,
          email,
          password,
          role: "user",
          refreshToken: tokens.refreshToken,
          registerNumber: registerNumber
        });
        deleteSecretNumber(registerNumber);
        user.save();
        return res.status(200).json({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      });
    })
};

const login = (req, res) => {
  const { email, password } = req.body;
  userModule.findOne({ email: email }, (err, data) => {
    if (err) {
      return res.status(401).send("user does not exist");
    }
    if (password === data.password) {
      const { accessToken, refreshToken } = auth.createTokens(req, data.role);
      userModule.findByIdAndUpdate(
        data._id,
        { refreshToken: refreshToken },
        (err, data) => {
          if (err) return res.status(401).send("user does not exist");
          userModule.findByIdAndUpdate(data._id,{refreshToken: refreshToken},(err,data)=>{
            if (err) {
              return res.status(401).json({msg:"data base error",error:err})
            }
            return res
              .status(200)
              .send({ accessToken: accessToken, refreshToken: refreshToken });
          })
        }
      );
    }
  });
};
const logoutToAllUsers = () => {
  userModule.find({}, (err, data) => {
    data.forEach((user) => {
      userModule.findByIdAndUpdate(
        user._id,
        { refreshToken: "" },
        (err, data) => {
          if (err) return res.status(401).send("");
          return res
            .status(200)
            .send({ adminLogedOut: true, msg: "the admin hase loged out" });
        }
      );
    });
  });
};
const logout = (req, res) => {
  const { userName } = req.user;
  userModule.findOne({ userName: userName }, (err, data) => {
    if (err) {
      return res.status(401).send("user does not exist");
    }
    if (data.role === "admin") {
      logoutToAllUsers();
      return res.status(200).json({ adminLogedOut: true });
    }
    userModule.findByIdAndUpdate(
      data._id,
      { refreshToken: "" },
      (err, data) => {
        if (err) return res.status(401).send("user does not exist");
        return res
          .status(200)
          .json({
            adminLogedOut: false,
            userLogedOut: true,
            msg: "logout successfully",
          });
      }
    );
  });
  res.sendStatus(200);
};

module.exports = {
  register,
  login,
  logout,
  addSecretNumber,
  deleteSecretNumbers,
  deleteSecretNumber,
};
