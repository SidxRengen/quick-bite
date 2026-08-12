import { MenuItem } from '../models/MenuItem.js';
import { HttpError } from '../utils/httpError.js';

const clean = (value) => typeof value === 'string' ? value.trim() : '';

export function validateMenuItem(payload = {}, partial = false) {
  const values = {};
  const errors = {};
  const has = (key) => Object.prototype.hasOwnProperty.call(payload, key);

  if (!partial || has('name')) {
    values.name = clean(payload.name);
    if (values.name.length < 2 || values.name.length > 80) errors.name = 'Name must contain 2 to 80 characters';
  }
  if (!partial || has('description')) {
    values.description = clean(payload.description);
    if (values.description.length < 5 || values.description.length > 300) errors.description = 'Description must contain 5 to 300 characters';
  }
  if (!partial || has('price')) {
    values.price = Number(payload.price);
    if (!Number.isFinite(values.price) || values.price < 0 || values.price > 100000) errors.price = 'Price must be between 0 and 100000';
  }
  if (!partial || has('image')) {
    values.image = clean(payload.image);
    try { const url = new URL(values.image); if (!['http:', 'https:'].includes(url.protocol)) throw new Error(); }
    catch { errors.image = 'Enter a valid HTTP or HTTPS image URL'; }
  }
  if (!partial || has('category')) {
    values.category = clean(payload.category);
    if (values.category.length < 2 || values.category.length > 50) errors.category = 'Category must contain 2 to 50 characters';
  }
  if (has('available')) {
    if (typeof payload.available !== 'boolean') errors.available = 'Available must be true or false';
    else values.available = payload.available;
  }
  if (partial && !Object.keys(values).length) throw new HttpError(400, 'Provide at least one menu field to update');
  if (Object.keys(errors).length) throw new HttpError(400, 'Invalid menu item', errors);
  return values;
}

export const createMenuItem = (payload) => MenuItem.create(validateMenuItem(payload));

export async function updateMenuItem(id, payload) {
  const item = await MenuItem.findByIdAndUpdate(id, validateMenuItem(payload, true), { new: true, runValidators: true });
  if (!item) throw new HttpError(404, 'Menu item not found');
  return item;
}

export async function deleteMenuItem(id) {
  const item = await MenuItem.findByIdAndDelete(id);
  if (!item) throw new HttpError(404, 'Menu item not found');
}
