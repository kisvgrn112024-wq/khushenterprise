import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { isDbConnected, readOrdersFromFile, writeOrdersToFile } from '../config/fileDb';

// @desc    Fetch all orders
// @route   GET /api/orders
// @access  Public
export const getOrders = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    if (isDbConnected()) {
      const filter = email ? { email: String(email) } : {};
      const orders = await Order.find(filter).sort({ createdAt: -1 });
      res.json(orders);
    } else {
      let orders = readOrdersFromFile();
      if (email) {
        orders = orders.filter(o => o.email === String(email));
      }
      // Sort by date/time (newest first)
      orders.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      res.json(orders);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    
    // Deduct stock levels for products in the order
    if (Array.isArray(payload.items)) {
      for (const item of payload.items) {
        if (isDbConnected()) {
          const product = await Product.findOne({ id: item.productId });
          if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
            await product.save();
          }
        } else {
          // FileDB
          try {
            const fs = require('fs');
            const path = require('path');
            const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');
            if (fs.existsSync(PRODUCTS_FILE)) {
              const fileContent = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
              const products = JSON.parse(fileContent);
              const idx = products.findIndex((p: any) => p.id === item.productId);
              if (idx > -1) {
                products[idx].stock = Math.max(0, products[idx].stock - item.quantity);
                fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
              }
            }
          } catch (err) {
            console.error("Failed to deduct stock in file database:", err);
          }
        }
      }
    }

    if (isDbConnected()) {
      const order = new Order(payload);
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    } else {
      const orders = readOrdersFromFile();
      const newOrder = {
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      orders.unshift(newOrder);
      writeOrdersToFile(orders);
      res.status(201).json(newOrder);
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Public
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, courier, tracking, expectedDate, weight, dimensions, hsnCode, packingDesc } = req.body;

    // Map progress indicators based on status
    const progressMap: Record<string, number> = {
      Placed: 0,
      Confirmed: 1,
      Packed: 2,
      Dispatched: 3,
      Delivered: 4
    };
    
    const progress = progressMap[status] !== undefined ? progressMap[status] : 1;

    let updateFields: any = { status, progress };
    if (courier) updateFields.courier = courier;
    if (tracking) updateFields.tracking = tracking;
    if (expectedDate) updateFields.expectedDate = expectedDate;
    if (weight) updateFields.weight = weight;
    if (dimensions) updateFields.dimensions = dimensions;
    if (hsnCode) updateFields.hsnCode = hsnCode;
    if (packingDesc) updateFields.packingDesc = packingDesc;

    // Inject logistics defaults if transitioning to Dispatched
    if (status === 'Dispatched') {
      updateFields.courier = courier || 'Blue Dart Express';
      updateFields.tracking = tracking || `987654${Math.floor(10000000 + Math.random() * 90000000)}`;
      updateFields.expectedDate = expectedDate || `Expected Delivery: ${new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`;
      updateFields.weight = weight || '8.25 kg';
      updateFields.dimensions = dimensions || '45cm x 35cm x 50cm';
      updateFields.hsnCode = hsnCode || 'HSN 9011 - Optical Microscope Assembly';
      updateFields.packingDesc = packingDesc || 'Heavy-duty Borosilicate Double-walled Styropack with shock absorption pads.';
    } else if (status === 'Delivered') {
      updateFields.expectedDate = `Delivered on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    }

    if (isDbConnected()) {
      const order = await Order.findOne({ id });
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }

      Object.assign(order, updateFields);
      const updated = await order.save();
      res.json(updated);
    } else {
      const orders = readOrdersFromFile();
      const idx = orders.findIndex(o => o.id === id);
      if (idx === -1) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }

      const updatedOrder = {
        ...orders[idx],
        ...updateFields,
        updatedAt: new Date().toISOString()
      };

      orders[idx] = updatedOrder;
      writeOrdersToFile(orders);
      res.json(updatedOrder);
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Purge all orders (Clear confusion)
// @route   DELETE /api/orders/purge
// @access  Public
export const purgeOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    if (isDbConnected()) {
      const result = await Order.deleteMany({});
      res.json({ message: `Successfully purged all orders. Count: ${result.deletedCount}` });
    } else {
      writeOrdersToFile([]);
      res.json({ message: 'Successfully purged all orders in local backup file.' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
