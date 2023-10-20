import { INTEGRATION_PREFIX } from "../constants";

export const getIntegrationName = (name: string) => `${INTEGRATION_PREFIX}/${name}`