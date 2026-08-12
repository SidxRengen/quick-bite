import { MenuItem } from '../models/MenuItem.js';
import { createMenuItem, deleteMenuItem, updateMenuItem } from '../services/menuService.js';

export const listMenu = async (req, res, next) => { try { res.json(await MenuItem.find({ available: true }).sort({ category: 1, name: 1 })); } catch (e) { next(e); } };
export const listAdminMenu = async (req, res, next) => { try { res.json(await MenuItem.find().sort({ createdAt: -1 })); } catch (e) { next(e); } };
export const postMenuItem = async (req, res, next) => { try { res.status(201).json(await createMenuItem(req.body)); } catch (e) { next(e); } };
export const patchMenuItem = async (req, res, next) => { try { res.json(await updateMenuItem(req.params.id, req.body)); } catch (e) { next(e); } };
export const removeMenuItem = async (req, res, next) => { try { await deleteMenuItem(req.params.id); res.status(204).end(); } catch (e) { next(e); } };
