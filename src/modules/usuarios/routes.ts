import { Router } from "express";

import { UsuariosController } from "./usuarios.controller";
import { CommonMiddlewares } from "../../common/middlewares";

const ChildrenRoutes = Router({mergeParams: true});

ChildrenRoutes.get('/catalogo', UsuariosController.ListadoUsuarios);
ChildrenRoutes.get('/info/:id', UsuariosController.ObtenerInfo);


export const UsuariosRouter = Router().use('/usuarios', CommonMiddlewares.ValidateRouteAccess, ChildrenRoutes);