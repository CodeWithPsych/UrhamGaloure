import DeletedOrder from "../models/deletedOrderModel.js";  

// add new order 
export const createOrder = async (req, res) => {
  const deletedOrder = new DeletedOrder(req.body);
  try {
    const doc = await deletedOrder.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

// filtered Orders
export const filterOrders = async (req, res) => {
    try {
      let query = DeletedOrder.find({});
      let totalQuery = DeletedOrder.find({});
  
  
      // Pagination
      if (req.query._page && req.query._per_page) {
        const pageSize = parseInt(req.query._per_page);
        const page = parseInt(req.query._page);
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
      }
  
      const totalOrders = await totalQuery.countDocuments().exec();
      const OrderedItems = await query.exec();
  

      res.set("totalDeletedOrders", totalOrders);
      res.status(200).json({ OrderedItems });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  