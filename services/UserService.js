import User from "../models/User";
import {SaveError} from "../utils/error";
import {Ok} from "../utils/error";
/**
 * Created by wyn on 3/25/16.
 */
const UserService = {

  getUserByName: async (username) => {
    return await User.findOne({ isDel: false, username: username });
  },

  getUserById: async (uid) => {
    return await User.findOne({ isDel: false, _id: uid });
  },
  
  getUserByEmail: async(email) => {
    return await User.findOne({ isDel:  false, email: email });
  },


  // 登陆验证
  isValid: (user, password) => {
    return user.password == password;
  },


  register: async (user) => {
    user.role = 'user';
    user = new User(user);
    try {
      return Ok(await user.save());
    } catch (err) {
      return SaveError(err);
    }
  },
  
  registerAdmin: async (admin) => {
    admin.role = 'admin';
    let user = new User(admin);
    try {
      return Ok(await user.save());
    } catch (err) {
      return SaveError(err);
    }
  },

  // 用户修改info资料,返回的是未修改前的信息
  updateInfo: async (uid, user) => {
    let info = user.info; // 只修改info信息
    try { 
      let user = await User.findOneAndUpdate(
        {isDel: false, _id: uid}, { info: info },{runValidators: true});
      return Ok(user);
    } catch (err) {
      return SaveError(err);
    }
  },

  updatePassword: async (uid, password) => {
    try {
      let user = await User.findOneAndUpdate(
        {isDel:false, _id: uid}, { password: password }, {runValidators: true});
      return Ok(user);
    } catch (err) {
      return SaveError(err)
    }
  },

  deleteUser: async (uid) => {
    try {
      let user = await User.findOneAndUpdate(
        {isDel: false, _id: uid}, { isDel: true });
      return Ok(user);
    } catch (err) {
      return SaveError(err);
    }
  },

  deleteUserForce: async (uid) => {
    try {
      let user = await User.findOneAndRemove({_id: uid});
      return Ok(user);
    } catch (err) {
      return SaveError(err);
    }

  },

  //查询isdel = false的, bylasttime
  getUsers: async ({ skip = 0, limit = 10, sort = { createAt: -1 }} = {}) => {
    return await User.find({isDel: false}).sort(sort).limit(limit).skip(skip);
  },

  getUsersCount: async () => {
    return await User.count({isDel: false})
  }


};

export default UserService;