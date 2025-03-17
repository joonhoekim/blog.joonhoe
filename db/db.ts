import 'dotenv/config';
import { createConnectionFromEnv } from './utils/connectionUtils';

export const db = createConnectionFromEnv();

