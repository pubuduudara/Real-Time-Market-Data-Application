import { Response } from "express";

export const handleSuccess = (res: Response, data: any, status = 200): void => {
  res.status(status).json({ success: true, data });
};

export const handleError = (res: Response, error: any, status = 500): void => {
  res
    .status(status)
    .json({ success: false, error: error.message || "Internal Server Error" });
};
