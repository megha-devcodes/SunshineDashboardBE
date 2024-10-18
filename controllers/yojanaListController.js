const Yojana = require("../models/Yojana");
const User = require("../models/User");

exports.getRegistrations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "entryDate",
      order = "desc",
    } = req.query;

    const searchQuery = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { mobileNumber: { $regex: search, $options: "i" } },
            { registerId: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const total = await Yojana.countDocuments(searchQuery);

    const sortOrder = order === "desc" ? -1 : 1;
    const sortCriteria = { [sortBy]: sortOrder };

    const registrations = await Yojana.find(searchQuery)
      .sort(sortCriteria)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const userIds = registrations.map((registration) => registration.userId);
    const users = await User.find({ userID: { $in: userIds } }).lean();

    const userMap = users.reduce((acc, user) => {
      acc[user.userID] = user;
      return acc;
    }, {});

    const results = registrations.map((registration) => {
      return {
        ...registration,
        name: userMap[registration.userId]?.name || null,
        email: userMap[registration.userId]?.email || null,
      };
    });

    res.status(200).json({
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      data: results,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch a single registration by registerId
exports.getRegistrationById = async (req, res) => {
  try {
    const registration = await Yojana.findOne({
      registerId: req.params.registerId,
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const user = await User.findOne({ userID: registration.userId });
    const result = {
      ...registration._doc,
      name: user?.name || null,
      email: user?.email || null,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching registration:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a registration by registerId
exports.updateRegistration = async (req, res) => {
  try {
    const { confirm, trnxId } = req.body;

    const updatedRegistration = await Yojana.findOneAndUpdate(
      { registerId: req.params.registerId },
      { confirm, trnxId },
      { new: true, runValidators: true }
    );

    if (!updatedRegistration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.status(200).json(updatedRegistration);
  } catch (error) {
    console.error("Error updating registration:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
