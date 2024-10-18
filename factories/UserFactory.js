const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Supervisor = require("../models/Supervisor");

const generateUserID = (role) => {
  const randomID = Math.random().toString(36).substring(2, 8).toUpperCase();
  return role === "admin" ? `A-${randomID}` : `I-${randomID}`;
};

class UserFactory {
  static async createUser({ name, email, password, role = "supervisor" }) {
    const userID = generateUserID(role);
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({ userID, name, email, password: hashedPassword, role });
    await user.save();

    if (role === "supervisor") {
      await Supervisor.create({
        userId: user.userID,
      });
    }

    return user;
  }

  static async updateUser(userID, updatedData) {
    const { name, email, password } = updatedData;

    const user = await User.findOne({ userID });
    if (!user) {
      throw new Error("User not found");
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 12);

    await user.save();
    return user;
  }
}

module.exports = UserFactory;
