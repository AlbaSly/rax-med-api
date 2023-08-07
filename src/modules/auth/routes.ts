import { Router } from "express";

import { AuthController } from "./auth.controller";
import { CommonMiddlewares } from "../../common/middlewares";

const ChildrenRoutes = Router({mergeParams: true});

ChildrenRoutes.post('/registrar', AuthController.Registrar);

ChildrenRoutes.post('/iniciar-sesion/:id', AuthController.IniciarSesion);

ChildrenRoutes.post('/recuperar-cuenta', AuthController.RecuperarCuenta);

ChildrenRoutes.post('/nueva-contrasena', AuthController.NuevaContrasena);

ChildrenRoutes.get('/datos', CommonMiddlewares.ValidateRouteAccess, AuthController.ObtenerDatos);


export const AuthRouter = Router().use('/auth', ChildrenRoutes);