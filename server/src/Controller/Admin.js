const AdminModel = require("../Model/Admin");

const AdminAuthentication = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Check hardcoded credentials
    if (email === "deepakkotamsetti16@gmail.com" && password === "Deepak@143") {
      return res.status(200).json({ success: true });
    }

    // Check credentials in MongoDB
    const admin = await AdminModel.findOne({ email });

    if (!admin) {  
      // User not found in MongoDB
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the password matches
    if (admin.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Successful authentication
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error during authentication:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during authentication",
    });
  }
};

module.exports = AdminAuthentication;
