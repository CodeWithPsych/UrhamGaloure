import User from "../models/userModel.js";

export const fetchUserById = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      id: user.id,
      role: user.role,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchUserPersonalInfoById = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    res.status(200).json({
      role: user.role,
      name: user.name,
      email: user.email,
      addresses: user.addresses,
      orders: user.orders,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

export const fetchUserOrdersById = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    res.status(200).json(user.orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      addresses: user.addresses,
      role: user.role,
      orders: user.orders,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};
