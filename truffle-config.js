module.exports = {
    networks: {
      development: {
        host: "ganache",       // Hostname of Ganache container (as per Docker Compose)
        port: 8545,            // Ganache port
        network_id: "*",       // Any network ID (matching any network)
      },
    },
    compilers: {
      solc: {
        version: "0.8.0",     // Specify compiler version
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    },
  };
  