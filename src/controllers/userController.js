const admin = require("../config/firebaseConfig");

const getUser = async (req, res) => {
  const { uid } = req.params;

  try {
    const userRecord = await admin.auth().getUser(uid);
    return res.status(200).json(userRecord);
  } catch (error) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }
};

const updateUser = async (req, res) => {
  const { uid } = req.params;
  const { displayName, email } = req.body;

  try {
    const userRecord = await admin.auth().updateUser(uid, { displayName, email });
    return res.status(200).json({ message: "Usuário atualizado!", user: userRecord });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { uid } = req.params;

  try {
    await admin.auth().deleteUser(uid);
    return res.status(200).json({ message: "Usuário deletado!" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { getUser, updateUser, deleteUser };
