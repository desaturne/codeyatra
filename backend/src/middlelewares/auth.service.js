import prisma from "../../config/db.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { generateToken } from "../../utils/jwt.js";

export const signup = async (data) => {
  const hashed = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      dob: new Date(data.dob),
      email: data.email,
      password: hashed
    }
  });

  const token = generateToken({ id: user.id, email: user.email });

  return { user, token };
};

export const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = generateToken({ id: user.id, email: user.email });

  return { user, token };
};