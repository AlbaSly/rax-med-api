import { Router } from "express";

import { MedicosController } from "./medicos.controller";
import { CommonMiddlewares } from "../../common/middlewares";

const ChildrenRoutes = Router({mergeParams: true});

ChildrenRoutes.post('/crear/:id', MedicosController.CrearMedico);
ChildrenRoutes.get('/info/:id', MedicosController.ObtenerInfo);
ChildrenRoutes.patch('/editar/:id', MedicosController.Editar);
ChildrenRoutes.post('/agregar-especialidad/:idMedico/:idEspecialidad/:idConsultorio', MedicosController.AgregarEspecialidad);
ChildrenRoutes.get('/listado-especialidades/:id', MedicosController.ListadoEspecialidades);
ChildrenRoutes.get('/catalogo', MedicosController.Catalogo);


export const MedicosRouter = Router().use('/medicos', CommonMiddlewares.ValidateRouteAccess, ChildrenRoutes);