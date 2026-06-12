import api from "./axios";

// USERS API
export const syncUser = async (userData) => {
  const { data } = await api.post("/users/sync", userData);
  return data;
};

// PRODUCTS API

// GET All Products
export const getAllProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

// GET Single Product by ID
export const getProductById = async (id) => {
  const { data } = await api.get(`/product/${id}`);
  return data;
};

// GET My Products
export const getMyProducts = async () => {
  const { data } = await api.get("/products/my");
  return data;
};

// CREATE Product
export const createProduct = async (productData) => {
  const { data } = await api.post("/products", productData);
  return data;
};

// UPDATE Product
export const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/product/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/product/${id}`);
  return data;
};

// COMMENTS API

// GET All Comments
export const getAllComments = async (productId, content) => {
  const { data } = await api.get(`/comments/${productId}`, content);
  return data;
};

// CREATE Comments to a product
export const createComment = async (productId, content) => {
  const { data } = await api.post(`/comments/${productId}`, content);
  return data;
};

// DELETE Comments
export const deleteComment = async (commentId) => {
  const { data } = await api.delete(`/comments/${commentId}`);
  return data;
};
