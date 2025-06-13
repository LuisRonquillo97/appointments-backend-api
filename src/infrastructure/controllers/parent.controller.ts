// src/infrastructure/controllers/parent.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ParentManagementService } from '../../application/services/parent-management.service';
import { UserRepository } from '../repositories/user.repository';
import { ParentRepository } from '../repositories/parent.repository';
import { AuthService } from '../../domain/services/auth.service';
import { ResponseUtil } from '../utils/response.util';
import { RequestWithUser } from '../middlewares/auth.middleware';

export class ParentController {
  private parentManagementService: ParentManagementService;

  constructor() {
    const userRepository = new UserRepository();
    const parentRepository = new ParentRepository();
    const authService = new AuthService();
    this.parentManagementService = new ParentManagementService(parentRepository, userRepository);
  }

  getParentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const parent = await this.parentManagementService.findParentById(id);
      ResponseUtil.success(res, parent);
    } catch (error: any) {
      ResponseUtil.error(res, error.message ?? error, 400);
    }
  };

  getParentByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const parent = await this.parentManagementService.findParentByUserId(userId);
      ResponseUtil.success(res, parent);
    } catch (error: any) {
      ResponseUtil.error(res, error.message ?? error, 400);
    }
  };

  listParents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const parents = await this.parentManagementService.listParents({ page, limit });
      ResponseUtil.success(res, parents);
    } catch (error: any) {
      ResponseUtil.error(res, error.message ?? error, 400);
    }
  };

  createParent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        name,
        lastName,
        addressLine1,
        addressLine2,
        houseNumber,
        zipCode,
        neighborhood,
        state,
        isActive,
        userId,
      } = req.body;

      const parent = await this.parentManagementService.createParent({
        name,
        lastName,
        addressLine1,
        addressLine2,
        houseNumber,
        zipCode,
        neighborhood,
        state,
        isActive,
        userId,
      });

      ResponseUtil.success(res, parent, 201);
    } catch (error: any) {
      ResponseUtil.error(res, error.message ?? error, 400);
    }
  };

  updateParent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const parentData = req.body;

      const parent = await this.parentManagementService.updateParent(id, parentData);
      ResponseUtil.success(res, parent);
    } catch (error: any) {
      ResponseUtil.error(res, error.message ?? error, 400);
    }
  };

  deleteParent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      // Use type assertion here
      const currentUserId = (req as RequestWithUser).user.id;

      await this.parentManagementService.deleteParent(id, currentUserId);
      ResponseUtil.success(res, { message: 'Parent deleted successfully' });
    } catch (error: any) {
      ResponseUtil.error(res, error.message ?? error, 400);
    }
  };
}
