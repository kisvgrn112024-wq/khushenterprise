import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import Catalogue from '../models/Catalogue';
import Inventory from '../models/Inventory';
import { isDbConnected, readProductsFromFile, writeProductsToFile } from '../config/fileDb';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const products = await Product.find({});
      res.json(products);
    } else {
      const products = readProductsFromFile();
      res.json(products);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const product = await Product.findOne({ id });
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } else {
      const products = readProductsFromFile();
      const product = products.find(p => p.id === id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    
    if (isDbConnected()) {
      const { category, catalog } = payload;
      let categoryDoc = null;
      let catalogDoc = null;

      if (category) {
        categoryDoc = await Category.findOneAndUpdate({ name: category }, { name: category }, { upsert: true, new: true });
      }

      if (catalog) {
        catalogDoc = await Catalogue.findOneAndUpdate({ title: catalog }, { title: catalog }, { upsert: true, new: true });
      }

      const productData = {
        ...payload,
        category_ref: categoryDoc ? categoryDoc._id : undefined,
        catalog_ref: catalogDoc ? catalogDoc._id : undefined,
      };

      const existing = await Product.findOne({ id: payload.id });
      if (existing) {
        Object.assign(existing, productData);
        const updated = await existing.save();
        
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
      
      const inventory = new Inventory({
        product: createdProduct._id,
        stockLevel: createdProduct.stock || 0,
      });
      await inventory.save();

      res.setHeader('Clear-Site-Data', '"cache"');
      res.setHeader('Cache-Control', 'no-cache');
      res.status(201).json(createdProduct);
    } else {
      // FileDB storage
      const products = readProductsFromFile();
      const idx = products.findIndex(p => p.id === payload.id);
      
      const newProduct = {
        ...payload,
        createdAt: payload.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (idx > -1) {
        products[idx] = { ...products[idx], ...newProduct };
      } else {
        products.unshift(newProduct);
      }

      writeProductsToFile(products);
      res.status(201).json(newProduct);
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (isDbConnected()) {
      const existing = await Product.findOne({ id });
      if (!existing) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      const { category, catalog } = payload;
      let categoryDoc = null;
      let catalogDoc = null;

      if (category) {
        categoryDoc = await Category.findOneAndUpdate({ name: category }, { name: category }, { upsert: true, new: true });
      }

      if (catalog) {
        catalogDoc = await Catalogue.findOneAndUpdate({ title: catalog }, { title: catalog }, { upsert: true, new: true });
      }

      const productData = {
        ...payload,
        category_ref: categoryDoc ? categoryDoc._id : undefined,
        catalog_ref: catalogDoc ? catalogDoc._id : undefined,
      };

      Object.assign(existing, productData);
      const updated = await existing.save();

      await Inventory.findOneAndUpdate(
        { product: updated._id }, 
        { stockLevel: updated.stock || 0 }, 
        { upsert: true }
      );

      res.json(updated);
    } else {
      const products = readProductsFromFile();
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      const updatedProduct = {
        ...products[idx],
        ...payload,
        updatedAt: new Date().toISOString()
      };

      products[idx] = updatedProduct;
      writeProductsToFile(products);
      res.json(updatedProduct);
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const product = await Product.findOne({ id });
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      await Product.deleteOne({ id });
      await Inventory.deleteOne({ product: product._id });
      res.json({ message: 'Product deleted successfully' });
    } else {
      const products = readProductsFromFile();
      const filtered = products.filter(p => p.id !== id);
      
      if (products.length === filtered.length) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      writeProductsToFile(filtered);
      res.json({ message: 'Product deleted successfully' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Purge dummy placeholders
// @route   DELETE /api/products/purge-placeholders
// @access  Private/Admin
export const purgePlaceholders = async (req: Request, res: Response): Promise<void> => {
  try {
    if (isDbConnected()) {
      const result = await Product.deleteMany({ is_placeholder: true });
      res.json({ message: `Successfully purged ${result.deletedCount} placeholder items.` });
    } else {
      const products = readProductsFromFile();
      const filtered = products.filter(p => !p.is_placeholder);
      const count = products.length - filtered.length;
      writeProductsToFile(filtered);
      res.json({ message: `Successfully purged ${count} placeholder items.` });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk create products
// @route   POST /api/products/bulk
// @access  Private/Admin
export const bulkCreateProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const productsPayload = req.body.products || req.body;
    if (!Array.isArray(productsPayload)) {
      res.status(400).json({ message: 'Payload must be an array of products' });
      return;
    }

    if (isDbConnected()) {
      const processedProducts = await Promise.all(productsPayload.map(async (prod) => {
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

      const operations = processedProducts.map(prod => ({
        updateOne: {
          filter: { id: prod.id },
          update: { $set: prod },
          upsert: true
        }
      }));

      const result = await Product.bulkWrite(operations);
      
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
        message: `Successfully registered ${productsPayload.length} products bulk.`, 
        count: productsPayload.length,
        upserted: result.upsertedCount,
        modified: result.modifiedCount
      });
    } else {
      const products = readProductsFromFile();
      
      productsPayload.forEach(prod => {
        const idx = products.findIndex(p => p.id === prod.id);
        const item = {
          ...prod,
          createdAt: prod.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        if (idx > -1) {
          products[idx] = { ...products[idx], ...item };
        } else {
          products.unshift(item);
        }
      });

      writeProductsToFile(products);
      res.status(201).json({
        message: `Successfully registered ${productsPayload.length} products bulk.`,
        count: productsPayload.length
      });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
