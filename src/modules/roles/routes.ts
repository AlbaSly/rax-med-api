import { Router } from "express";

import { RolesController } from "./roles.controller";
import { CommonMiddlewares  } from "../../common/middlewares";

const ChildrenRoutes = Router({mergeParams: true});

ChildrenRoutes.get('/catalogo', RolesController.Catalogo);


export const RolesRouter = Router().use('/roles', CommonMiddlewares.ValidateRouteAccess, ChildrenRoutes);