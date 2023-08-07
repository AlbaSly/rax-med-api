import { IRejectResponse, IResolveResponse } from "../../common/interfaces";
import { IConsultorio, ConsultoriosModel } from "../../models/consultorios.model";
import { ICrearConsultorio } from "./validators";

export default class ConsultoriosService {
    constructor() {}

    async Crear(data: ICrearConsultorio) {
        return new Promise(async (resolve: (data: IResolveResponse<null>) =>  void, reject: (reason: IRejectResponse) => void) => {
            ConsultoriosModel.findOne({nombre: data.nombre}).then((consultorioFound) => {
                if (consultorioFound) return reject({
                    isError: true,
                    statusCode: 401,
                    msg: "Ya existe un consultorio con ese nombre",
                });

                ConsultoriosModel.create(data).then((consultorioCreated) => {
                    resolve({
                        isError: false,
                        statusCode: 201,
                        msg: "Consultorio creado",
                        data: null,
                    });
                }).catch(e => {
                    reject({
                        isError: true,
                        statusCode: 500,
                        msg: "Hubo un error al crear el consultorio"
                    });
                });
            }).catch(e => {
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: "Hubo un error al consultar el catálogo de consultorios",
                });
            });        
        });
    }

    async Catalogo() {
        return new Promise(async (resolve: (data: IResolveResponse<Array<IConsultorio>>) => void, reject: (reason: IRejectResponse) => void) => {
            ConsultoriosModel.find({}).then((catalogo) => {
                resolve({
                    isError: false,
                    statusCode: 200,
                    msg: "Catálogo de consultorios",
                    data: catalogo
                });
            }).catch(e => {
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: "Hubo un error al consultar el catálogo de consultorios"
                });
            });
        });
    }
}