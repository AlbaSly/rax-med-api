import { Router } from "express";

import { PacientesController } from "./pacientes.controller";
import { CommonMiddlewares } from "../../common/middlewares";

const ChildrenRoutes = Router({mergeParams: true});

ChildrenRoutes.post('/crear/:id', PacientesController.CrearPaciente);


export const PacientesRouter = Router().use('/pacientes', CommonMiddlewares.ValidateRouteAccess, ChildrenRoutes);