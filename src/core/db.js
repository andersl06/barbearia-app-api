import { env } from "../config/index.js";
import pkg from "@supabase/supabase-js";
const { createClient } = pkg;

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

export default supabase;
