module.exports = {
    reactStrictMode: true,
    target: "serverless", // Apparently this is required by Netlify
    webpack5: true, 
    webpack: (config, { webpack, isServer}) => {
      config.externals = config.externals.concat(['mssql', 'mysql2', 'oracle', 'oracledb', 'postgres', 'redshift', 'sqlite3', 'pg', 'pg-query-stream', 'tedious', 
      { knex: 'commonjs knex' } ]);
      return config;
    },
  }