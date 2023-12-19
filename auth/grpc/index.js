const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const { auth } = require('../../config/configServer.json').grpcMicroservice || {};

const protoDescriptor = grpc.loadPackageDefinition(
    protoLoader.loadSync(path.join(__dirname, 'auth.proto'), {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    }),
  );
  
const client = auth ? new protoDescriptor.AuthService(auth, grpc.credentials.createInsecure(),   {
    'grpc.max_send_message_length': 512 * 1024 * 1024,
    'grpc.max_receive_message_length': 512 * 1024 * 1024,
  },
) : null;

const generateToken = client ? async (clientId) => {
    return new Promise((resolve, reject) => {
      client.generateToken({ client_id: clientId }, (error, response) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response);
      });
    });
} : null;

const validateToken = client ? async (token) => {
    return new Promise((resolve, reject) => {
      client.validateToken({ access_token: token }, (error, response) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response.user_id);
      });
    });
} : null;

module.exports = {
    generateToken,
    validateToken,
    authServerAddress: auth,
}
  