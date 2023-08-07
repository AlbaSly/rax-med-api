import mongoose, { ClientSession } from "mongoose";

import { IRejectResponse, IResolveResponse } from "../../common/interfaces";

import { api } from "../../common/utils";

import { IUsuario, PersonasModel, RolesModel, UsuariosModel } from "../../models";

import EmailService from "../../services/email.service";
import EncryptionService from "../../services/encryption.service";
import JWTService from "../../services/jwt.service";
import MedicosService from "../medicos/medicos.service";
import PacientesService from "../pacientes/pacientes.service";

import { IIniciarSesion, INuevaContrasena, IRecuperarCuenta, IRegistrar } from "./validators";
import { AplicacionesModel } from "../../models/private/aplicaciones.model";
import { RolAplicacionesModel } from "../../models/private/rol-aplicaciones.model";

import ServiceFlowTracker from "../../common/classes/ServiceFlowTracker";

export default class AuthService {
    private flowTracker: ServiceFlowTracker;

    constructor() {
        this.flowTracker = new ServiceFlowTracker();
    }

    async Registrar(data: IRegistrar) {

        const {
            persona,
            credenciales,
            rol
        } = data;

        this.flowTracker.setCurrentProccessName("Conexión en servicio interno");

        const session: ClientSession = await mongoose.startSession();

        session.startTransaction();

        return new Promise(async (resolve: (data: IResolveResponse<null>) => void, reject: (reason: IRejectResponse) => void) => {
            try {
                this.flowTracker.setCurrentProccessName("Consulta del catálogo de roles");
                const rolFound = await RolesModel.findOne({nombre: rol.nombre});
                if (!rolFound) return reject({
                    isError: true,
                    statusCode: 404,
                    msg: "Rol no encontrado"
                });
                if (rolFound.password !== rol.password) return reject({
                    isError: true,
                    statusCode: 401,
                    msg: 'La contraseña para asignar el rol es incorrecta'
                });

                this.flowTracker.setCurrentProccessName("Consulta del catálogo de personas");
                const personaFound = await PersonasModel.findOne({curp: persona.curp});
                if (personaFound) return reject({
                    isError: true,
                    statusCode: 401,
                    msg: "CURP en uso"
                });

                this.flowTracker.setCurrentProccessName("Consulta del catálogo de usuarios");
                const usuarioFound = await UsuariosModel.findOne({email: credenciales.email});
                if (usuarioFound) return reject({
                    isError: true,
                    statusCode: 401,
                    msg: "Correo en uso"
                });

                this.flowTracker.setCurrentProccessName("Creación del registro de la persona");
                const personaCreated = await PersonasModel.create(persona);

                this.flowTracker.setCurrentProccessName("Creación de la cuenta de usuario");
                const generatedPassword = EncryptionService.GenerateRandomPassword();
                const hashedPassword = await EncryptionService.GenHash(generatedPassword);
                const usuarioCreated = await UsuariosModel.create({
                    persona: personaCreated._id,
                    rol: rolFound._id,
                    email: credenciales.email,
                    password: hashedPassword,
                });

                if (rolFound.nombre === "MEDICO") {
                    this.flowTracker.setCurrentProccessName("Creación del registro como médico");
                    const service = new MedicosService();
                    await service.CrearMedico(usuarioCreated._id);
                }

                if (rolFound.nombre === "PACIENTE") {
                    this.flowTracker.setCurrentProccessName("Creación del registro como paciente");
                    const service = new PacientesService();
                    await service.CrearPaciente(usuarioCreated._id);
                }
                
                const catalogoAplicaciones = await RolAplicacionesModel.find({rol: rolFound._id}).populate('aplicacion');
                
                this.flowTracker.setCurrentProccessName("Envío del correo electrónico");
                await EmailService.SendEmail(usuarioCreated.email, 'CREACIÓN DE CUENTA',
                `
                    <p><strong>${personaCreated.nombre} ${personaCreated.apellidoPaterno} ${personaCreated.apellidoMaterno}</strong></p>
                    <p>Sus credenciales han sido creadas satisfactoriamente:</p>
                    <br>
                    <h2>CREDENCIALES DE ACCESO</h2>
                    <p>ROL: <strong>${rolFound.nombre}</strong></p>
                    <p>E-MAIL: <strong>${usuarioCreated.email}</strong></p>
                    <p>CONTRASEÑA: <strong>${generatedPassword}</strong></p>
                    <br>
                    <br>
                    <h2>PORTALES DE ACCESO</h2>
                    ${catalogoAplicaciones.map((app: any) => (
                        `
                            <p>Nombre: <strong>${app.aplicacion.nombre}</strong></p>
                            <p>Plataforma: <strong>${app.aplicacion.plataforma}</strong></p>
                            <p>Descripcion: <strong>${app.aplicacion.descripcion}</strong></p>
                            ${app.aplicacion.url 
                                ? `<p>URL de acceso: <strong>${app.aplicacion.url}</strong></p>` 
                                : ''
                            }
                            <br>
                        `
                    ))}
                `
                );

                resolve({
                    isError: false,
                    statusCode: 201,
                    msg: "Cuenta creada satisfactoriamente. Se le ha enviado un correo con las credenciales a su bandeja de entrada.",
                    data: null,
                });
            } catch (e) {
                api.error("AuthService - " + this.flowTracker.getLastExecutedProcessName(), e);
                await session.abortTransaction();
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: `Hubo un error durante la operación: ${this.flowTracker.getLastExecutedProcessName()}`
                });
            } finally {
                await session.endSession();
            }
        });
    }

    async IniciarSesion(data: IIniciarSesion, appID: string) {
        
        const {
            email,
            password,
        } = data;

        return new Promise(async (resolve: (data: IResolveResponse<string>) => void, reject: (reason: IRejectResponse) => void) => {
            UsuariosModel.findOne({
                email
            }).populate('rol').then(async (usuarioFound) => {
                if (!usuarioFound) return reject({
                    isError: true,
                    statusCode: 404,
                    msg: 'Usuario no encontrado'
                });

                const isCorrectPassword = await EncryptionService.CompareHash(password, usuarioFound.password);

                if (!isCorrectPassword) return reject({
                    isError: true,
                    statusCode: 401,
                    msg: 'Credenciales inválidas'
                });

                AplicacionesModel.findOne({_id: appID}).then((appFound) => {
                    const rolID = (usuarioFound.rol as any)._id;
                    RolAplicacionesModel.findOne({rol: rolID, aplicacion: appID}).then(async (appCompatibleFound) => {
                        if (!appCompatibleFound) return reject({
                            isError: true,
                            statusCode: 403,
                            msg: 'No tiene permisos para acceder a esta aplicación',
                        });
    
                        const jwt = await JWTService.GenerarJWT({id: usuarioFound._id});

                        resolve({
                            isError: false,
                            statusCode: 200,
                            msg: 'Inicio de sesión correcto',
                            data: jwt
                        });
                    }).catch(e => {
                        api.error('Error en AuthService', e);
                        reject({
                            isError: true,
                            statusCode: 500,
                            msg: 'Hubo un error al consultar el catálogo de aplicaciones por rol'
                        });
                    });
                }).catch(e => {
                    api.error('Error en AuthService', e);
                    reject({
                        isError: true,
                        statusCode: 500,
                        msg: 'Hubo un error al consultar el catálogo de aplicaciones'
                    });
                })
            }).catch(e => {
                api.error('Error en AuthService', e);
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: 'Hubo un error al consultar el catálogo de usuarios',
                });
            });
        });
    }

    async RecuperarCuenta(data: IRecuperarCuenta) {

        const {
            email
        } = data;

        return new Promise(async (resolve: (data: IResolveResponse<null>) => void, reject: (reason: IRejectResponse) => void) => {
            UsuariosModel.findOne({
                email
            }).then((usuarioFound) => {
                if (!usuarioFound) return reject({
                    isError: true,
                    statusCode: 404,
                    msg: 'Usuario no encontrado'
                });

                const code = EncryptionService.GenerateRandomNumbers();
                usuarioFound.codigo = code;
                usuarioFound.save().then((usuarioSaved) => {
                    EmailService.SendEmail(usuarioSaved.email, 'Recuperación de Cuenta', 
                    `
                        <p>El código de recuperación para reestablecer su contraseña es:</p>
                        <br>
                        <p><strong>${usuarioSaved.codigo}</strong></p>
                    `
                    ).then((emailResponse) => {

                    }).catch(async e => {
                        usuarioSaved.codigo = null;
                        await usuarioSaved.save();

                        api.error('Error en AuthService', e);
                        reject({
                            isError: true,
                            statusCode: 500,
                            msg: 'Hubo un error al enviar el correo al destinatario'
                        });
                    });
                }).catch(e => {
                    api.error('Error en AuthService', e);
                    reject({
                        isError: true,
                        statusCode: 500,
                        msg: 'Hubo un error al generar el código de recuperación'
                    });
                });
            }).catch((e) => {
                api.error('Error en AuthService', e);
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: 'Hubo un error al consultar el catálogo de usuarios'
                });
            });
        });
    }

    async NuevaContrasena(data: INuevaContrasena) {

        const {
            email,
            codigo,
            password  
        } = data;

        return new Promise(async (resolve: (data: IResolveResponse<null>) => void, reject: (reason: IRejectResponse) => void) => {
            UsuariosModel.findOne({
                email: email,
            }).then(async (usuarioFound) => {
                if (!usuarioFound) return reject({
                    isError: true,
                    statusCode: 404,
                    msg: 'Usuario no encontrado'
                });

                if (usuarioFound.codigo !== codigo) return reject({
                    isError: true,
                    statusCode: 403,
                    msg: 'Código inválido'
                });

                const hashedPassword = await EncryptionService.GenHash(password);

                usuarioFound.password = hashedPassword;
                usuarioFound.codigo = null;

                usuarioFound.save().then((usuarioSaved) => {
                    resolve({
                        isError: false,
                        statusCode: 200,
                        msg: 'Cuenta recuperada exitosamente',
                        data: null
                    });
                }).catch(e => {
                    api.error('Error en AuthService', e);
                    reject({
                        isError: true,
                        statusCode: 500,
                        msg: 'Hubo un error al actualizar la información'
                    });
                });
            }).catch(e => {
                api.error('Error en AuthService', e);
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: 'Hubo un error al consultar el catálogo de usuarios'
                });
            });
        });
    }

    async ObtenerDatos(idUsuario: string) {
        return new Promise(async (resolve: (data: IResolveResponse<IUsuario>) => void, reject: (reason: IRejectResponse) => void) => {
            UsuariosModel.findOne({_id: idUsuario}).populate('rol').populate('persona').then((usuarioFound) => {
                if (!usuarioFound) return reject({
                    isError: true,
                    statusCode: 404,
                    msg: 'Usuario no encontrado'
                });
                resolve({
                    isError: false,
                    statusCode: 200,
                    msg: 'Información obtenida',
                    data: usuarioFound
                });
            }).catch(e => {
                api.error('Error en AuthService', e);
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: 'Hubo un error al consultar el catálogo de usuarios'
                });
            })
        });
    }
}