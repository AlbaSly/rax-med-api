import { SearchByIlikeFunction } from "../../common/handlers";
import { IRejectResponse, IResolveResponse } from "../../common/interfaces";
import { api } from "../../common/utils";
import { IPaciente, IPacientePopulated, PacientesModel, PersonasModel, UsuariosModel } from "../../models";

export default class PacientesService {

    constructor() {}

    async CrearPaciente(idUsuario: string) {
        return new Promise(async (resolve: (data: IResolveResponse<IPaciente>) => void, reject: (reason: IRejectResponse) => void) => {
            UsuariosModel.findOne({_id: idUsuario}).populate('persona').then((usuarioFound) => {
                if (!usuarioFound) return reject({
                    isError: true,
                    statusCode: 404,
                    msg: "Usuario no encontrado"
                });
                PacientesModel.findOne({usuario: usuarioFound._id}).then((pacienteFound) => {
                    if (pacienteFound) return reject({
                        isError: true,
                        statusCode: 404,
                        msg: "Este usuario ya está asignado en los registros como un paciente",
                    });
                    PacientesModel.create({usuario: usuarioFound._id}).then((pacienteCreated) => {
                        resolve({
                            isError: false,
                            statusCode: 201,
                            msg: "El usuario se ha creado correctamente",
                            data: pacienteCreated                   
                        });
                    }).catch(async e => {
                        reject({
                            isError: true,
                            statusCode: 500,
                            msg: "Hubo un error al crear al médico"
                        });
                    });
                }).catch(e => {
                    reject({
                        isError: true,
                        statusCode: 500,
                        msg: "Hubo un error al consultar el catálogo de médicos",
                    });
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

    async ObtenerInfo(idPaciente: string) {
        return new Promise(async (resolve: (data: IResolveResponse<IPacientePopulated>) => void, reject: (reason: IRejectResponse) => void) => {
            PacientesModel.findOne({_id: idPaciente}).populate({
                path: "usuario",
                populate: {
                    path: "persona",
                    model: "personas"
                }
            }).then((pacienteFound) => {
                if (!pacienteFound) return reject({
                    isError: true,
                    statusCode: 404,
                    msg: "Paciente no encontrado"
                });

                resolve({
                    isError: false,
                    statusCode: 200,
                    msg: "Información consultada",
                    data: pacienteFound as unknown as IPacientePopulated,
                })
            }).catch(e => {
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: "Hubo un error al consultar el catálogo de pacientes"
                });
            })
        });
    }

    async Catalogo(busqueda?: string) {
        return new Promise(async (resolve: (data: IResolveResponse<Array<IPaciente>>) => void, reject: (reason: IRejectResponse) => void) => {
            PacientesModel.find().populate({
                path: "usuario",
                populate: {
                    path: "persona",
                    model: "personas"
                }
            }).then((catalogo: any) => {
                catalogo = catalogo as Array<IPacientePopulated>;
                catalogo = SearchByIlikeFunction(catalogo, busqueda ?? "");

                resolve({
                    isError: false,
                    statusCode: 200,
                    msg: "Catálogo de pacientes",
                    data: catalogo
                });
            }).catch(e => {
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: "Hubo un error al consultar el catálogo de pacientes"
                });
            });
        });
    }
}