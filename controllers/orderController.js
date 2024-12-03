import Order from "../models/orderModel.js";

// fetch Orders By User
export const fetchOrdersByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const orders = await Order.find({ user: id });
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const createOrder = async (req, res) => {
  const { id } = req.user;
  const order = new Order({ ...req.body, user: id });
  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// delete Order
export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

// update Order
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

// fetch Order By Id
export const fetchOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate("user");
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

// filtered Orders
export const filterOrders = async (req, res) => {
  try {
    let query = Order.find({});
    let totalQuery = Order.find({});

    // Filtering by status
    if (req.query.status) {
      query = query.where("status").equals(req.query.status);
      totalQuery = totalQuery.where("status").equals(req.query.status);
    }

    // Pagination
    if (req.query._page && req.query._per_page) {
      const pageSize = parseInt(req.query._per_page);
      const page = parseInt(req.query._page);
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    // Execute total count query
    const totalOrders = await totalQuery.countDocuments().exec();
    const OrderedItems = await query.exec();

    // Set the totalOrders in the header
    res.set("totalOrders", totalOrders);
    res.status(200).json({ OrderedItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
