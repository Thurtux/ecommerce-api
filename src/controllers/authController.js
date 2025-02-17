const admin = require("../config/firebaseConfig");

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await admin.auth().createUser({ email, password });
    res.json({ userId: user.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await admin.auth().getUserByEmail(email);
    res.json({ userId: user.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
