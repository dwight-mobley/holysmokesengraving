import { Router, Response, Request, NextFunction } from 'express';
import { validate } from '../middleware/validate';
import { RegisterSchema, LoginSchema } from '@hse/shared';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { signToken } from '../lib/jwt';
import { requireAuth } from '../middleware/requireAuth';

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
      }else{
         //Create customer if none
        await prisma.customer.create({
            data:{firstName, lastName, email, userId:user.id}
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
      const [user, orders] = await Promise.all([
        prisma.user.findUnique({ where: { id:userId } }),
        prisma.order.findMany({
            where: { customer: { userId: userId } },
            include:{items:{include:{product:true}}},
            orderBy: {createdAt: 'desc'}
        })
      ]);
      if (!user) return res.status(404).json({ error: 'User not found' });
      const {passwordHash, ...safeUser} = user!;
      return res.status(200).json({user:safeUser, orders});
    } catch (err) {
      next(err);
    }
  },
);
