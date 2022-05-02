const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var tokenSecret = 'authSecret';

module.exports = {
  encryptPassword: (password, callback) => {
    if(password){
      bcrypt.hash(password, 10, (err, hash) => {
        if(err){
          return callback({status: 400, error: err});
        } else {
          return callback(null, hash);
        }
      });
    } else {
      return callback({status: 400, error:'password is required'});
    }
  },

  matchPassword: (password, encryptedPassword, callback) => {
    bcrypt.compare(password, encryptedPassword, (err, result) => {
      if(err){
        return callback({status: 400, error: err});
      } else {
        return callback(null, result);
      }
    });
  },

  getAuthToken: (payload) => {
    return jwt.sign(
      payload,
      tokenSecret,
      {
        expiresIn: '2d'
      }
    );
  },

  getUsername: async (name) => {
    if(name){
      const checkExistance = async (userName) => {
        const user = await User.findOne({userName: userName});
        if(user){
          return true;
        } else {
          return false;
        }
      };


      const getName = async (name)=>{
        name = name.split('@')[0];
        let isExist = await checkExistance(name);
        if(isExist){
          name = name + Date.now();
          await getName(name);
        } else {
          return name;
        }
      };

      return await getName(name);

    }
  }
};
