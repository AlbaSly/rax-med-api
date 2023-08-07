import { IRejectResponse, IResolveResponse } from "../../common/interfaces";
import { IRol, RolesModel } from "../../models";

export default class RolesService {
    constructor() {}

    async Catalogo() {
        return new Promise(async (resolve: (data: IResolveResponse<Array<IRol>>) => void, reject: (reason: IRejectResponse) => void) => {
            RolesModel.find({}).then((catalogo) => {
                resolve({
                    isError: false,
                    statusCode: 200,
                    msg: "Catálogo de roles",
                    data: catalogo
                });
            }).catch(e => {
                reject({
                    isError: true,
                    statusCode: 500,
                    msg: "Hubo un error al consultar el catálogo de roles",
                });
            });
        });
    }
}