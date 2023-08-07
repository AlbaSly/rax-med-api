import { IRejectResponse, IResolveResponse } from "../../common/interfaces";
import { api } from "../../common/utils";
import { EspecialidadesModel, IMedico, MedicosEspecialidadesModel, MedicosModel, PersonasModel, UsuariosModel } from "../../models";
import { ConsultoriosModel } from "../../models/consultorios.model";

export default class MedicosService {

    async CrearMedico(idUsuario: string) {

        return new Promise(async (resolve: (data: IResolveResponse<IMedico>) => void, reject: (reason: IRejectResponse) => void) => {
            UsuariosModel.findOne({_id: idUsuario}).populate('persona').then((usuarioFound) => {
                if (!usuarioFound) return reject({
                    isError: true,
                    statusCode: 404,
                    msg: "Usuario no encontrado"
                });
                MedicosModel.findOne({usuario: usuarioFound._id}).then((medicoFound) => {
                    if (medicoFound) return reject({
                        isError: true,
                        statusCode: 404,
                        msg: "Este usuario ya está asignado en los registros como un médico",
                    });
                    MedicosModel.create({usuario: usuarioFound._id}).then((medicoCreated) => {
                        resolve({
                            isError: false,
                            statusCode: 201,
                            msg: "El usuario se ha creado correctamente",
                            data: medicoCreated                   
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

    async AgregarEspecialidad(idMedico: string, idEspecialidad: string, idConsultorio: string, cedula: string) {
        return new Promise(async (resolve: (data: IResolveResponse<null>) => void, reject: (reason: IRejectResponse) => void) => {
            MedicosModel.findById(idMedico).then((medicoFound) => {
                if (!medicoFound) return reject({
                    isError: true,
                    statusCode: 404,
                    msg: "Médico no encontrado"
                });

                EspecialidadesModel.findById(idEspecialidad).then((especialidadFound) => {
                    if (!especialidadFound) return reject({
                        isError: true,
                        statusCode: 404,
                        msg: "Especialidad no encontrada"
                    });

                    ConsultoriosModel.findById(idConsultorio).then((consultorioFound) => {
                        if (!consultorioFound) return reject({
                            isError: true,
                            statusCode: 404,
                            msg: "Consultorio no encontrado"
                        });

                        MedicosEspecialidadesModel.findOne({medico: idMedico, especialidad: idEspecialidad}).then((medEspFound) => {
                            if (medEspFound) return reject({
                                isError: true,
                                statusCode: 401,
                                msg: "Asignación existente"
                            });
    
                            MedicosEspecialidadesModel.create({
                                medico: idMedico,
                                especialidad: idEspecialidad,
                                consultorio: idConsultorio,
                                cedula
                            }).then((medEspCreated) => {
                                resolve({
                                    isError: false,
                                    statusCode: 201,
                                    msg: "Asignación creada correctamente",
                                    data: null
                                });
                            }).catch( e => {
                                reject({
                                    isError: true,
                                    statusCode: 500,
                                    msg: "Hubo un error al crear la asignación"
                                });
                            });
                        });
                    }).catch( e => {
                        reject({
                            isError: true,
                            statusCode: 500,
                            msg: "Hubo un error al consultar el catálogo de consultorios"
                        });
                    });
                }).catch(e => {
                    reject({
                        isError: true,
                        statusCode: 500,
                        msg: "Hubo un error al consultar el catálogo de especialidades",
                    });
                })
            }).catch(e => {
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: "Hubo un error al consultar el catálogo de médicos"
                });
            })
        });
    }
}