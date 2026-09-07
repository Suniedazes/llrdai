import {defineConfig} from 'vite';
import vinext from 'vinext';
import {cloudflare} from '@cloudflare/vite-plugin';
// Worker-native entry includes Durable Objects; Node prerender cannot load cloudflare:workers.
export default defineConfig({plugins:[vinext(),cloudflare({viteEnvironment:{name:'rsc',childEnvironments:['ssr']}})]});
