import { IRejectResponse, IResolveResponse } from "../../common/interfaces";
import { IEspecialidad, EspecialidadesModel } from "../../models";
import { ICrearEspecialidad } from "./validators";

export default class EspecialidadesService {
    constructor() {}

    async Crear(data: ICrearEspecialidad) {
        return new Promise(async (resolve: (data: IResolveResponse<null>) => void, reject: (reason: IRejectResponse) => void) => {
            EspecialidadesModel.findOne({nombre: data.nombre}).then((especialidadFound) => {
                if (especialidadFound) return reject({
                    isError: true,
                    statusCode: 401,
                    msg: "Ya existe una especialidad con ese nombre",
                });

                EspecialidadesModel.create(data).then((especialidadCreated) => {
                    resolve({
                        isError: false,
                        statusCode: 201,
                        msg: "Especialidad creada",
                        data: null
                    });
                }).catch(e => {
                    reject({
                        isError: true,
                        statusCode: 500,
                        msg: "Hubo un error al crear la especialidad",
                    });
                });
            }).catch(e => {
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: "Hubo un error al consultar el catálogo de especialidades"
                });
            });
        });
    }

    async Catalogo(busqueda?: string) {
        return new Promise(async (resolve: (data: IResolveResponse<Array<IEspecialidad>>) => void, reject: (reason: IRejectResponse) => void) => {
            EspecialidadesModel.find({
                ...(busqueda && {nombre: {$regex: busqueda.toUpperCase()}})
            }).then((catalogo) => {
                resolve({
                    isError: false,
                    statusCode: 200,
                    msg: "Catálogo de especialidades",
                    data: catalogo
                });
            }).catch(e => {
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: "Hubo un error al consultar el catálogo de especialidades"
                });
            })
        });
    }
}