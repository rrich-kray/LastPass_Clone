import { fileURLToPath, URL } from 'node:url';
//import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
// import fs from 'fs';
// import path from 'path';
// import child_process from 'child_process';
// import { env } from 'process';
import mkcert from 'vite-plugin-mkcert';

/*
const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

// Confirms that root is true (exists), but no other sub folders, even after creating them with fs.mkdir.
// So then is it a permissions issue? Can't access root. Why wouldn't it throw an error? Should this code even be running in the release build?
// Can I simply create the certs in another folder, or must they be in root?
// Why is env.home returning root?
// WHy is vite generating the certificates for asp.net??? Shouldn't this code be in the backend?
let currentPath = "";
baseFolder.split("/").forEach((element: string) => {
    currentPath = path.join(currentPath, element);
    if (!fs.existsSync(currentPath)) {
        fs.mkdir(currentPath, (error) => {
            throw new Error(error?.message);
        })
        console.debug(currentPath);
        console.debug(`Does current directory exist:${fs.existsSync(currentPath)}`);
    }
})

// basePath does not exist, so certFilePath would not be valid? Doesn't exist even after creating it with the above code...
// Error from dotnet dev-certs is "no such file or directory", implying that it will not create the directory if it does not exist
// The fact that vite can read the env.HOME implies at least that that exists
// Only encounter this issue in release configuration
console.debug(fs.existsSync(baseFolder));

const certificateName = "lastpass_clone.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);
console.debug(certFilePath); 
console.debug(keyFilePath);

// Do I have to use dotnet cert generation utility? Maybe one in Javascript
if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath, // Error must be here, can't export the cert to a file. Maybe vite has read permissions but not write to the /root/? basePath does not exist, will spawn create folder path if it does not exist?
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}


// Dotnet dev certs is meant to create certs for development only, why then is this being run on release configuration?
if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    try {
        child_process.spawnSync('dotnet', [
            'dev-certs',
            'https',
            '--export-path',
            certFilePath, //Says no such file or directory
            '--format',
            'Pem',
            '--no-password',
        ], { stdio: 'inherit', })
    } catch (exception) {
        throw new Error(`Error writing cert to a file: ${exception}`);
    }
}
*/


//const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
 //   env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7208';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin(), mkcert()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        port: 5173
        /*
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
        */
        
    },
    logLevel: "info"
})
