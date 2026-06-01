import { Router, Response, Request, NextFunction } from 'express';
import { validate } from '../middleware/validate';
import { RegisterSchema, LoginSchema } from '@hse/shared';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { JwtPayload, signToken, verifyToken } from '../lib/jwt';
import { requireAuth } from '../middleware/requireAuth';
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { sendEmail } from '../lib/email';
import ForgotPasswordMessage from '../emails/templates/ForgotPasswordMessage';
import React from 'react';

export const authRouter = Router();

authRouter.post(
  '/register',
  validate(RegisterSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      //Check if email is already registered
      let user = await prisma.user.findUnique({
        where: { email: email },
      });
      if (user) {
        res.status(409).send();
        return;
      }
      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create new user
      user = await prisma.user.create({
        data: { email: email, passwordHash: hashedPassword },
      });
      //Check to see if customer exists with same email
      const customer = await prisma.customer.findUnique({
        where: { email: email },
      });
      //Sync customer and user
      if (customer) {
        await prisma.customer.update({
          where: {
            id: customer.id,
          },
          data: {
            userId: user.id,
          },
        });
      } else {
        //Create customer if none
        await prisma.customer.create({
          data: { firstName, lastName, email, userId: user.id }
        })
      }
      //Remove hashed password from user
      const { passwordHash, ...safeUser } = user;
      //Create jwt token
      const token = signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return res.status(201).json({ user: safeUser, token });
    } catch (err) {
      next(err);
    }
  },
);

authRouter.post(
  '/login',
  validate(LoginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password, email } = req.body;
      // Check if user exists
      const user = await prisma.user.findUnique({ where: { email: email } });
      if (!user)
        return res.status(401).json({ error: 'Invalid email or password' });

      //Check Password
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch)
        return res.status(401).json({ error: 'Invalid email or password' });

      //Create Token
      const jwtToken = signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return res.status(200).json({
        email: user.email,
        role: user.role,
        token: jwtToken,
      });
    } catch (err) {
      next(err);
    }
  },
);

authRouter.get(
  '/me',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.auth!;
      const [user, orders, customer] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.order.findMany({
          where: { customer: { userId: userId } },
          include: { items: { include: { product: true } } },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.customer.findUnique({ where: { userId: userId } })
      ]);
      if (!user) return res.status(404).json({ error: 'User not found' });
      const { passwordHash, ...safeUser } = user!;

      const updatedUser = { ...safeUser, ...customer }

      return res.status(200).json({ user: updatedUser, orders });
    } catch (err) {
      next(err);
    }
  },
);

authRouter.post('/forgot-password', async (request: Request, res: Response, next: NextFunction) => {
  const { email, url } = request.body;
  if (!email) return res.status(400).json({ error: 'Email Required' });

  // Check if customer exists
  const customer = await prisma.customer.findFirst({ where: { user: { email: email } } });
  if (customer) {
    // Create JWT Token for reset Link
    const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '15m' })
    const resetLink = `${url}?token_hash=${jwtToken}`
    await sendEmail({
      to: email,
      subject: 'PASSWORD RESET LINK',
      react: React.createElement(ForgotPasswordMessage, {
        customerName: customer?.firstName || 'customer',
        resetUrl: resetLink
      })
    })
  }
  return res.status(200).json('Password Reset Link Sent')
});

authRouter.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, token } = req.body;
    if (!token || !password) return res.status(400).json('Token and Password Required');

    // Check Token
    console.log('Checking Token', token)
    const { email } = verifyToken(token)
    console.log('Email', email)
    if (!email) return res.status(401).json('Invalid Token')

    //Hash Password
    console.log('Hashing Password', password)
    const passwordHash = await bcrypt.hash(password, 10)
    console.log('Password Hash:', passwordHash)
    const _user = await prisma.user.update({
      where: { email: email },
      data: { passwordHash: passwordHash }
    })
    console.log('User Password Updated')
    return res.status(200).json('Password Updated');
  } catch (err) {
    console.log(err)
    const errorMessage = err instanceof Error ?
      err.message &&
        err.message === 'jwt expired' ? 'Invalid Token' : err.message : 'Unauthorized';

    return res.status(401).json({ error: errorMessage });
  }
});
