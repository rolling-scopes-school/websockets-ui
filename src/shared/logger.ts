const log = (message: any): void => {
  if (process.env['IS_LOGGING_ENABLED'] === 'true') {
    console.info(message);
  }
};

export default log;
