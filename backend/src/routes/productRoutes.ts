import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  purgePlaceholders, 
  bulkCreateProducts 
} from '../controllers/productController';

const router = express.Router();

// Bulk and purge operations (placed BEFORE /:id to prevent route hijacking)
router.route('/purge-placeholders').delete(purgePlaceholders);
router.route('/bulk').post(bulkCreateProducts);

// Basic product CRUD routes
router.route('/').get(getProducts).post(createProduct);
router.route('/:id').get(getProductById);

export default router;
