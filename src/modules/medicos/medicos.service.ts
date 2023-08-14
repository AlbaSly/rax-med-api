import { SearchByIlikeFunction } from "../../common/handlers";
import { IRejectResponse, IResolveResponse } from "../../common/interfaces";
import { TransformStringToDateTime, api } from "../../common/utils";
import { EspecialidadesModel, IEspecialidad, IMedico, IMedicoEspecialidad, IMedicoPopulated, MedicosEspecialidadesModel, MedicosModel, PersonasModel, UsuariosModel } from "../../models";
import { ConsultoriosModel } from "../../models/consultorios.model";
import { IAgregarEspecialidad, IEditarMedico } from "./validators";

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
    
    async ObtenerInfo(idMedico: string) {
        return new Promise(async (resolve: (data: IResolveResponse<IMedicoPopulated>) => void, reject: (reason: IRejectResponse) => void) => {
            MedicosModel.findOne({_id: idMedico}).populate({
                path: "usuario",
                populate: {
                    path: "persona",
                    model: "personas"
                }
            }).then((medicoFound) => {
                if (!medicoFound) return reject({
                    isError: true,
                    statusCode: 404,
                    msg: "Médico no encontrado"
                });

                resolve({
                    isError: false,
                    statusCode: 200,
                    msg: "Información consultada",
                    data: medicoFound as unknown as IMedicoPopulated
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
    
    async Editar(idMedico: string, data: IEditarMedico) {
        return new Promise(async (resolve: (data: IResolveResponse<null>) => void, reject: (reason: IRejectResponse) => void) => {
            MedicosModel.findById(idMedico).then((medicoFound) => {
                if (!medicoFound) return reject({
                    isError: true,
                    statusCode: 404,
                    msg: "Médico no encontrado"
                });

                Object.assign(medicoFound, {
                    ...data,
                    horaEntrada: TransformStringToDateTime(data.horaEntrada),
                    horaSalida: TransformStringToDateTime(data.horaSalida),
                });

                medicoFound.save().then((medicoSaved) => {
                    resolve({
                        isError: false,
                        statusCode: 200,
                        msg: "Datos actualizados correctamente",
                        data: null
                    });
                }).catch(e => {
                    reject({
                        isError: true,
                        statusCode: 500,
                        msg: "Hubo un error al actualizar los datos del médico"
                    });
                });
            }).catch(e => {
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: "Hubo un error al consultar el catálogo de médicos"
                });
            });
        });
    }

    async AgregarEspecialidad(idMedico: string, idEspecialidad: string, idConsultorio: string, data: IAgregarEspecialidad) {
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

                        MedicosEspecialidadesModel.findOne({medico: idMedico, especialidad: idEspecialidad}).then(async (medEspFound) => {
                            if (medEspFound) {
                                if (medEspFound.activo) return reject({
                                    isError: true,
                                    statusCode: 401,
                                    msg: "Especialidad ya asignada al médico"
                                });

                                medEspFound.activo = true;

                                await medEspFound.save();

                                return resolve({
                                    isError: false,
                                    statusCode: 201,
                                    msg: "Asignación creada correctamente",
                                    data: null,
                                });
                            }

                            MedicosEspecialidadesModel.create({
                                medico: idMedico,
                                especialidad: idEspecialidad,
                                consultorio: idConsultorio,
                                ...data
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
                        }).catch(e => {
                            reject({
                                isError: true,
                                statusCode: 500,
                                msg: "Hubo un error al consultar las especialidades del médico"
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

    async ListadoEspecialidades(idMedico: string) {
        return new Promise(async (resolve: (data: IResolveResponse<Array<IMedicoEspecialidad>>) => void, reject: (reason: IRejectResponse) => void) => {
            MedicosModel.findById(idMedico).then((medicoFound) => {
                if (!medicoFound) return reject({
                    isError: true,
                    statusCode: 404,
                    msg: "Médico no encontrado"
                });

                MedicosEspecialidadesModel.find({medico: idMedico}).populate('especialidad').then((catalogo) => {
                    resolve({
                        isError: false,
                        statusCode: 200,
                        msg: "Especialidades del médico",
                        data: catalogo
                    });
                }).catch(e => {
                    reject({
                        isError: true,
                        statusCode: 500,
                        msg: "Hubo un error al consultar las especialidades del médico"
                    });
                });
            }).catch(e => {
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: "Hubo un error al consultar el catálogo de médicos"
                });
            });
        });
    }

    async Catalogo(busqueda?: string) {
        return new Promise(async (resolve: (data: IResolveResponse<Array<IMedicoPopulated>>) => void, reject: (reason: IRejectResponse) => void) => {
            MedicosModel.find().populate({
                path: "usuario",
                populate: {
                    path: "persona",
                    model: "personas"
                }
            }).then((catalogo: any) => {
                catalogo = catalogo as Array<IMedicoPopulated>;
                catalogo = SearchByIlikeFunction(catalogo, busqueda ?? "");
                
                resolve({
                    isError: false,
                    statusCode: 200,
                    msg: "Catálogo de médicos",
                    data: catalogo
                });
            }).catch(e => {
                console.log(e);
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: "Hubo un error al consultar el catálogo de médicos"
                });
            });
        });
    }
}