import { Request, Response } from 'express';
import { getShippingOptions } from '../services/shippingService';

export const calculateShipping = (req: Request, res: Response) => {
  const { fromZip, toZip, weight } = req.query;

  if (!fromZip || !toZip || !weight) {
    return res.status(400).json({ error: 'Parâmetros inválidos' });
  }

  const options = getShippingOptions(fromZip as string, toZip as string, Number(weight));
  res.json(options);
};
