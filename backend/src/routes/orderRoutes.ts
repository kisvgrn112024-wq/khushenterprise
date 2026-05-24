import express from 'express';
import { 
  getOrders, 
  createOrder, 
  updateOrderStatus,
  purgeOrders
} from '../controllers/orderController';

const router = express.Router();

// Purge all orders (clean slate)
router.route('/purge').delete(purgeOrders);

// Basic order operations
router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .put(updateOrderStatus);

export default router;
