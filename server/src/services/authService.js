import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import { createToken } from "../utils/token.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export async function registerUser(payload = {}) {
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const errors = {};
  if (name.length < 2) errors.name = "Name must contain at least 2 characters";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address";
  if (password.length < 8)
    errors.password = "Password must contain at least 8 characters";
  if (Object.keys(errors).length)
    throw new HttpError(400, "Invalid registration details", errors);
  if (await User.exists({ email }))
    throw new HttpError(409, "An account with this email already exists");

  const user = await User.create({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 12),
  });
  return { user: publicUser(user), token: createToken(user.id) };
}

export async function loginUser(payload = {}) {
  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    throw new HttpError(401, "Invalid email or password");
  return { user: publicUser(user), token: createToken(user.id) };
}

export { publicUser };
