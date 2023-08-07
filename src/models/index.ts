import { EspecialidadesModel } from "./especialidades.model";
import { MedicosEspecialidadesModel } from "./medicos-especialidades.model";
import { MedicosModel } from "./medicos.model";
import { PacientesModel } from "./pacientes.model";
import { PersonasModel } from "./personas.model";
import { AplicacionesModel } from "./private/aplicaciones.model";
import { RolAplicacionesModel } from "./private/rol-aplicaciones.model";
import { RolesModel } from "./roles.model";
import { UsuariosModel } from "./usuarios.model";

export * from "./personas.model";
export * from "./roles.model";
export * from "./usuarios.model";
export * from "./medicos.model";
export * from "./pacientes.model";
export * from "./especialidades.model";
export * from "./medicos-especialidades.model";

export const MODELS = [
    PersonasModel,
    RolesModel,
    UsuariosModel,
    MedicosModel,
    PacientesModel,
    EspecialidadesModel,
    MedicosEspecialidadesModel,

    AplicacionesModel,
    RolAplicacionesModel,
]