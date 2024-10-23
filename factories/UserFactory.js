const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateUniqueUserID = async (role) => {
  try {
    let userID;
    let exists = true;

    while (exists) {
      const randomID = Math.random().toString(36).substring(2, 8).toUpperCase();
      userID = role === "admin" ? `A-${randomID}` : `I-${randomID}`;
      exists = await User.findOne({ userID });

      if (!exists) break;
    }

    return userID;
  } catch (error) {
    console.error("Error generating unique user ID:", error);
    throw new Error("Failed to generate a unique user ID.");
  }
};

class UserFactory {
  static async generateCredentials() {
    try {
      const userID = await generateUniqueUserID("supervisor");
      const password = Math.random().toString(36).substring(2, 8).toUpperCase();
      return { userID, password };
    } catch (error) {
      console.error("Error generating credentials:", error);
      throw new Error("Failed to generate credentials.");
    }
  }

  static async createUser({ name, email, password, role = "supervisor" }) {
    try {
      const userID = await generateUniqueUserID(role);
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        userID,
        name,
        email,
        password: hashedPassword,
        role,
      });
      await user.save();

      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user.");
    }
  }

  static async updateUser(userID, updatedData) {
    try {
      const user = await User.findOne({ userID });
      if (!user) {
        throw new Error("User not found");
      }

      Object.assign(user, updatedData);
      await user.save();
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user.");
    }
  }
}

module.exports = UserFactory;
