import { connectToDatabase } from "../../config/database/mongo.config";
import { ApiException } from '../../exceptions/api.exception';
//realiza cambios ve
async function getExampleCollection() {
    try {
        const mongo = await connectToDatabase();
        mongo.disconnect();
    } catch (error) {
        throw new ApiException(500, ["Error retrieving the collection {collection_name}."]);
    }
}

export { getExampleCollection };
