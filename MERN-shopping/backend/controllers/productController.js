import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

//@desc Fetch all products
//@desc GET /api/products
//@desc Public

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

//@desc Fetch single products
//@desc GET /api/products/:id
//@desc Public
const getProductById = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product Not Found');
  }
});

export { getProducts, getProductById };
