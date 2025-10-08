import {ApiException} from '../../exceptions/api.exception';
import mongoose from "mongoose"
import * as path from "path";
import dotenv from 'dotenv'; 

dotenv.config();

const caCertPath = path.resolve(__dirname, "../global-bundle.pem");
/**
 * Desarrollo 
 * const uri = `mongodb+srv://${process.env.username}:${process.env.password}@${process.env.host}:${process.env.port}/${process.env.name}`;
 */
const uri = `mongodb://${process.env.username}:${process.env.password}@${process.env.host}:${process.env.port}/${process.env.name}?tls=${process.env.ssl}&tlsCAFile=${caCertPath}&retryWrites=false&authMechanism=SCRAM-SHA-1`;
let cachedDbConnection: typeof mongoose | null = null; 

async function disconnectToDatabase() {    
	try{      
		if(cachedDbConnection) cachedDbConnection.disconnect();      
		console.log('successful disconnection')   
	} catch (error) {       
		throw new ApiException(500, ["Error connecting to DB."]);   
	}
} 

async function connectToDatabase(): Promise<typeof mongoose> {    
	if (cachedDbConnection && mongoose.connection.readyState === 1) {        
		return cachedDbConnection;    
	}    
	try {        
		const dbConnection = await mongoose.connect(uri,{       
            /**
             * Comentar en desarrollo las propiedades.... 
             * ssl: true,                
             * tlsCAFile: caCertPath,      
             * */         
			ssl: true,
			tlsCAFile: caCertPath,
			tlsAllowInvalidCertificates: false,
			serverSelectionTimeoutMS: 50000,
			connectTimeoutMS: 45000,
			}
		);        
		cachedDbConnection = dbConnection        
		console.log('connection successful')        
		return dbConnection;    
	} catch (error) {        
		throw new ApiException(500, ["Error connecting to DB."]);    
	}
} 

export { connectToDatabase, disconnectToDatabase };


