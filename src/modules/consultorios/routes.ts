import { Router } from "express";

import { ConsultoriosController } from "./consultorios.controller";
import { CommonMiddlewares } from "../../common/middlewares";

const ChildrenRoutes = Router({mergeParams: true});

ChildrenRoutes.post('/crear', ConsultoriosController.Crear);
ChildrenRoutes.get('/catalogo', ConsultoriosController.Catalogo);


export const ConsultoriosRouter = Router().use('/consultorios', CommonMiddlewares.ValidateRouteAccess, ChildrenRoutes);