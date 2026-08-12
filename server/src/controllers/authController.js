import { loginUser, publicUser, registerUser } from '../services/authService.js';

export const register = async (req, res, next) => { try { res.status(201).json(await registerUser(req.body)); } catch (error) { next(error); } };
export const login = async (req, res, next) => { try { res.json(await loginUser(req.body)); } catch (error) { next(error); } };
export const me = (req, res) => res.json({ user: publicUser(req.user) });
