const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const protoDescriptor = grpc.loadPackageDefinition(
    protoLoader.loadSync(path.join(__dirname, 'auth.proto'), {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    }),
  );
  
const client = new protoDescriptor.AuthService('localhost:50051', grpc.credentials.createInsecure(),   {
    'grpc.max_send_message_length': 512 * 1024 * 1024,
    'grpc.max_receive_message_length': 512 * 1024 * 1024,
  },
);

const generateToken = async (clientId) => {
    return new Promise((resolve, reject) => {
      client.generateToken({ client_id: clientId }, (error, response) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response);
      });
    });
};

const validateToken = async (token) => {
    return new Promise((resolve, reject) => {
      client.validateToken({ access_token: token }, (error, response) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response.user_id);
      });
    });
};

module.exports = {
    generateToken,
    validateToken
}
  