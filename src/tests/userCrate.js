const User = require("../models/User");

const usercreate = async () => {
  const user = {
    firstName: "carlos",
    lastName: "patiño",
    email: "carlosdaniel@gmail.com",
    password: "carlos0702",
    phone: "9876543211",
  };

  await User.create(user);
};

module.exports = usercreate;
