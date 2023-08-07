import { Router } from "express";

import { MedicosController } from "./medicos.controller";
import { CommonMiddlewares } from "../../common/middlewares";

const ChildrenRoutes = Router({mergeParams: true});

ChildrenRoutes.post('/crear/:id', MedicosController.CrearMedico);


export const MedicosRouter = Router().use('/medicos', CommonMiddlewares.ValidateRouteAccess, ChildrenRoutes);