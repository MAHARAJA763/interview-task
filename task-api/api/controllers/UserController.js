/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  createUser: (req, res) => {
    let payload = req.body;
    let findObj = {
      userName: payload.userName
    }
    if(payload.isThirdPartySignup){
      findObj = {
        external_id: payload.id,
        provider: payload.provider
      };
    }
    User.findOne(findObj).exec(async (err, findUser) => {
      if(err) {
        return res.status(err.status || 400).json({error: err});
      } else if(findUser) {
        if(payload.isThirdPartySignup){
          delete findUser.password;
          const authToken = AuthService.getAuthToken({user: findUser});

          return res.status(200).json({
            user: findUser,
            authToken
          });
        }
        return res.status(400).json({error: 'username already exits'});
      } else {
        if(payload.isThirdPartySignup){
          payload.external_id = payload.id;
          payload.userName = await AuthService.getUsername(payload.email);
          delete payload.id;
          delete payload.idToken;
          delete payload.authToken;

          User.create(payload, (err, createdUser) => {
            if(err) {
              return res.status(err.status || 400).json({error: err});
            } else if(createdUser) {
              delete createdUser.password;
              const authToken = AuthService.getAuthToken({user: createdUser});

              return res.status(200).json({
                user: createdUser,
                authToken
              });
            } else {
              return res.status(400).json({error: 'something went wrong'});
            }
          }, {fetch:true});
        } else {
          AuthService.encryptPassword(payload.password, (err, encryptedPassword) => {
            if(err) {
              return res.status(err.status || 400).json({error: err});
            } else {
              payload.password = encryptedPassword;
              User.create(payload, (err, createdUser) => {
                if(err) {
                  return res.status(err.status || 400).json({error: err});
                } else if(createdUser) {
                  return res.status(201).json(createdUser);
                } else {
                  return res.status(400).json({error: 'something went wrong'});
                }
              }, {fetch:true});
            }
          });
        }
      }
    });
  },

  loginUser: (req, res) => {
    let payload = req.body;
    console.log("\n\n ~ file: UserController.js ~ line 70 ~ payload", payload)
    let obj = {email: payload.email};
    if(payload.isThirdPartyLogin){
      obj = {
        external_id: payload.id,
        provider: payload.provider
      };
    }
    User.findOne(obj).exec(async (err, findUser) => {
      if(err) {
        return res.status(err.status || 400).json({error: err});
      } else if(findUser) {
        if(payload.isThirdPartyLogin){
          delete findUser.password;
          const authToken = AuthService.getAuthToken({user: findUser});

          return res.status(200).json({
            user: findUser,
            authToken
          });
        }
        AuthService.matchPassword(payload.password, findUser.password, (err, result) => {
          if(err || !result) {
            return res.status(err.status || 400).json({error: 'password is wrong'});
          } else {
            delete findUser.password;
            const authToken = AuthService.getAuthToken({user: findUser});

            return res.status(200).json({
              user: findUser,
              authToken
            });
          }
        });
      } else {
        if(payload.isThirdPartyLogin){
          payload.external_id = payload.id;
          payload.userName = await AuthService.getUsername(payload.email);
          delete payload.id;
          delete payload.idToken;
          delete payload.authToken;
          console.log("\n\n ~ file: UserController.js ~ line 122 ~ payload", payload)

          User.create(payload, (err, createdUser) => {
            if(err) {
              return res.status(err.status || 400).json({error: err});
            } else if(createdUser) {
              delete createdUser.password;
              const authToken = AuthService.getAuthToken({user: createdUser});

              return res.status(200).json({
                user: createdUser,
                authToken
              });
            } else {
              return res.status(400).json({error: 'something went wrong'});
            }
          }, {fetch:true});
        } else {
          return res.status(400).json({error: 'user with this email is not registered'});
        }
      }
    });
  }
};

