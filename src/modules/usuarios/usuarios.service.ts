import { IRejectResponse, IResolveResponse } from "../../common/interfaces";
import { api } from "../../common/utils";
import { IMedico, IPaciente, IUsuario, MedicosModel, PacientesModel, UsuariosModel } from "../../models";

export default class UsuariosService {
    constructor() {}

    async ListadoUsuarios() {
        return new Promise(async (resolve: (data: IResolveResponse<Array<IUsuario>>) => void, reject: (reason: IRejectResponse) => void) => {
            UsuariosModel.find({}).populate('persona').populate('rol').then((catalogo) => {
                resolve({
                    isError: false,
                    statusCode: 200,
                    msg: "Catálogo de usuarios",
                    data: catalogo
                });
            }).catch(e => {
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: "Hubo un error al consultar el catálogo de usuarios",
                });
            });
        });
    }

    async ObtenerInfo(idUsuario: string) {
        return new Promise(async (resolve: (data: IResolveResponse<InfoUsuario>) => void, reject: (reason: IRejectResponse) => void) => {
            UsuariosModel.findOne({_id: idUsuario}).populate('persona').populate('rol').then(async (usuarioFound) => {
                if (!usuarioFound) return reject({
                    isError: true,
                    statusCode: 404,
                    msg: "Usuario no encontrado"
                });

                const medicoFound = await MedicosModel.findOne({usuario: idUsuario});
                const pacienteFound = await PacientesModel.findOne({usuario: idUsuario});

                const info: InfoUsuario = {
                    usuario: usuarioFound,
                    medico: medicoFound ?? null,
                    paciente: pacienteFound ?? null,
                }

                resolve({
                    isError: true,
                    statusCode: 200,
                    msg: "Información consultada",
                    data: info
                });
            }).catch(e => {
                api.error('Error en UsuariosService', e)
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: "Hubo un error al consultar el catálogo de usuarios"
                });
            })
        });
    }
}

interface InfoUsuario {
    usuario: IUsuario,
    medico: IMedico | null,
    paciente: IPaciente | null,
}