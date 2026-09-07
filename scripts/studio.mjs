import {spawn} from "node:child_process";
import {randomBytes} from "node:crypto";
const child=spawn(process.execPath,["node_modules/next/dist/bin/next","start","--hostname","127.0.0.1"],{stdio:"inherit",env:{...process.env,LLRD_LOCAL_STUDIO:"true",LLRD_STUDIO_TOKEN:randomBytes(32).toString("hex")}});
for(const signal of ["SIGINT","SIGTERM"])process.on(signal,()=>child.kill(signal));
child.on("exit",code=>process.exit(code||0));
