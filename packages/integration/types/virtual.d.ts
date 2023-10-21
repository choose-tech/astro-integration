declare module "virtual:choose-tech/options" {
  const Config: import("../types").GlobalIntegrationOptions;
  export default Config;
}
declare module "virtual:choose-tech/project-context" {
  export default { root: string, srcDir: string };
}
