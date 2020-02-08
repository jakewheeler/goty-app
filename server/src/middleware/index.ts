import { admin } from '../firebase/firestore';
import { Response, NextFunction, Request } from 'express';

const getAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    req.token = req.headers.authorization.split(' ')[1];
  } else {
    req.token = '';
  }
  return next();
};

const checkIfAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  getAuthToken(req, res, async () => {
    try {
      const { token } = req;
      if (typeof token !== 'string') throw new Error('token is not a string');
      const userInfo = await admin.auth().verifyIdToken(token);
      req.authId = userInfo.uid;
      return next();
    } catch (e) {
      return res
        .status(401)
        .send({ error: 'You are not authorized to make this request' });
    }
  });
};

export default checkIfAuthenticated;
