import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import Catalogue from '../models/Catalogue';
import Inventory from '../models/Inventory';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { category, catalog } = req.body;
    let categoryDoc = null;
    let catalogDoc = null;

    if (category) {
      categoryDoc = await Category.findOneAndUpdate({ name: category }, { name: category }, { upsert: true, new: true });
    }

    if (catalog) {
      catalogDoc = await Catalogue.findOneAndUpdate({ title: catalog }, { title: catalog }, { upsert: true, new: true });
    }

    const productData = {
      ...req.body,
      category_ref: categoryDoc ? categoryDoc._id : undefined,
      catalog_ref: catalogDoc ? catalogDoc._id : undefined,
    };

    // If the product already exists, update it instead of crashing with a duplicate key error
    const existing = await Product.findOne({ id: req.body.id });
    if (existing) {
      Object.assign(existing, productData);
      const updated = await existing.save();
      
      // Update inventory automatically
      await Inventory.findOneAndUpdate(
        { product: updated._id }, 
        { stockLevel: updated.stock || 0 }, 
        { upsert: true }
      );
      
      res.setHeader('Clear-Site-Data', '"cache"');
      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json(updated);
      return;
    }
    const product = new Product(productData);
    const createdProduct = await product.save();
    
    // Inventory Automation Hook
    const inventory = new Inventory({
      product: createdProduct._id,
      stockLevel: createdProduct.stock || 0,
    });
    await inventory.save();

    res.setHeader('Clear-Site-Data', '"cache"');
    res.setHeader('Cache-Control', 'no-cache');
    res.status(201).json(createdProduct);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Purge dummy placeholders
// @route   DELETE /api/products/purge-placeholders
// @access  Private/Admin
export const purgePlaceholders = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await Product.deleteMany({ is_placeholder: true });
    res.json({ message: `Successfully purged ${result.deletedCount} placeholder items.` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk create products
// @route   POST /api/products/bulk
// @access  Private/Admin
export const bulkCreateProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = req.body.products || req.body;
    if (!Array.isArray(products)) {
      res.status(400).json({ message: 'Payload must be an array of products' });
      return;
    }

    // Prepare products with proper mapping
    const processedProducts = await Promise.all(products.map(async (prod) => {
      let categoryDoc = null;
      let catalogDoc = null;
      
      if (prod.category) {
        categoryDoc = await Category.findOneAndUpdate({ name: prod.category }, { name: prod.category }, { upsert: true, new: true });
      }
      if (prod.catalog) {
        catalogDoc = await Catalogue.findOneAndUpdate({ title: prod.catalog }, { title: prod.catalog }, { upsert: true, new: true });
      }
      
      return {
        ...prod,
        category_ref: categoryDoc ? categoryDoc._id : undefined,
        catalog_ref: catalogDoc ? catalogDoc._id : undefined,
      };
    }));

    // Upsert products to avoid duplicate key violations
    const operations = processedProducts.map(prod => ({
      updateOne: {
        filter: { id: prod.id },
        update: { $set: prod },
        upsert: true
      }
    }));

    const result = await Product.bulkWrite(operations);
    
    // Sync Inventory for all processed products
    const dbProducts = await Product.find({ id: { $in: processedProducts.map(p => p.id) } });
    const inventoryOps = dbProducts.map(prod => ({
      updateOne: {
        filter: { product: prod._id },
        update: { $set: { stockLevel: prod.stock || 0 } },
        upsert: true
      }
    }));
    if (inventoryOps.length > 0) {
      await Inventory.bulkWrite(inventoryOps);
    }
    
    res.setHeader('Clear-Site-Data', '"cache"');
    res.setHeader('Cache-Control', 'no-cache');
    res.status(201).json({ 
      message: `Successfully registered ${products.length} products bulk.`, 
      count: products.length,
      upserted: result.upsertedCount,
      modified: result.modifiedCount
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
