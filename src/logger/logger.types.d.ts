export interface EnvironmentVariables {
  /**
   * @param string The log levels to display, separated with ','
   *
   * ALlowed values: `log`, `error`, `warn`, `debug`, `verbose
   * 
   * Example: "log,error,warn,debug,verbose"
   */
  LOG_LEVELS: string;
}
