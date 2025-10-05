// lib/auth.ts
import { db } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'supersecret';

// Login function
export async function login(email: string, password: string, role: string) {
  const [users] = await db.query(
    'SELECT * FROM users WHERE email = ? AND role = ?',
    [email, role]
  );
  const user = (users as any[])[0];

  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    SECRET,
    { expiresIn: '1d' }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
}

// Server-side JWT verification
export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, SECRET) as { id: string; role: string; email: string };
  } catch {
    return null;
  }
}

// Permission helper
export function hasPermission(userRole: string, requiredRole: string | string[]): boolean {
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
}
