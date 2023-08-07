import { Router } from "express";

import { EspecialidadesController } from "./especialidades.controller";
import { CommonMiddlewares } from "../../common/middlewares";

const ChildrenRoutes = Router({mergeParams: true});

ChildrenRoutes.post('/crear', EspecialidadesController.Crear);
ChildrenRoutes.get('/catalogo', EspecialidadesController.Catalogo);


export const EspecialidadesRouter = Router().use('/especialidades', CommonMiddlewares.ValidateRouteAccess, ChildrenRoutes);