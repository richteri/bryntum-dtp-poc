# Standalone export server

This package contains the sources for an executable service which builds PDF and PNG files out of HTML fragments.

- Always up to date with the newest headless chromium browser.
- Easy OS (Linux, Windows, Mac) independent build/install into binary or runnable as NodeJS instance.
- Written in JavaScript and fully adaptable.
- Can be used as standalone service or as an intermediary between your (C#, Java, PHP) frontend and backend. Just catch
 the HTML fragments, call the service and serve the binary.

## Installation

To install the standalone export server, NodeJS, Python 2.7 and the NPM package manager are required.

Depending on your system you can download them here:

https://nodejs.org/en/
https://www.npmjs.com/get-npm

Python:

```
npm install --global --production windows-build-tools
```

Or download the 2.7.x package from https://www.python.org/


```bash
cd ./server
npm install node-pre-gyp -g
npm install
```
## Requirements

The solution main requirements are listed below. For the full list of required modules please check `package.json` file contents.

**NOTE:** Please read the required libraries licensing info on the projects web-sites.


### Puppeteer

The solution uses puppeteer module to generate PDF and PNG files:

https://www.npmjs.com/package/puppeteer

When building, puppeteer versions for Windows, Linux and Mac are downloaded and placed into the bin directory in the chromium folder.

We recommend using puppeteer@1.17.0 (default) as it generates PDFs faster than later versions.

### HummusJS

PDF streams are concatenated with the "HummusJS" module:

https://www.npmjs.com/package/hummus

The HummusJS module contains a binary which need to be shipped with the server executable. The binary is placed under:

    ./bin/{os}/hummus/binding

Binaries are built for node 8.9.4, so it is recommended to build server using
same node version. If you have different node version, you might consider
[Node version manager](https://github.com/creationix/nvm) to switch node
to 8.9.4 and back. Or you can rebuild hummus binary for required platform and your local node version.

When the binary does not fit the requirements of your operating system then replace the corresponding binary with the one which is built with `npm install`

    ./node_modules/hummus/binding

### Merge-img

PNG streams are concatenated with "merge-img" module:

https://www.npmjs.com/package/merge-img

### SSL certificate (if you are running HTTPS)

If you want to run export server on HTTPS, you will need a certificate. A self-signed certificate is provided, it can be
regenerated like this:

    openssl genrsa -out cert/server.key 2048
    openssl req -new -x509 -key src/cert/server.key -out src/cert/server.crt -days 3650 -subj /CN=localhost

<a name="self-signed-certificate"></a>    
#### Make browser accept a self-signed certificate

Browsers tend to complain about self-signed certificates and when you are trying to access export server via HTTPS
you might get errors like `NET::ERR_CERT_AUTHORITY_INVALID` in Chrome and CORS exception in Firefox.

##### Chrome
Enable this flag: `chrome://flags/#allow-insecure-localhost`.

##### Firefox
Navigate to `Options -> Certificates -> View Certificates...`, open tab `Servers` and add exception for export
server address

### Pkg

The solution is wrapped into an executable with "pkg" module:

https://www.npmjs.com/package/pkg

On build the "pkg" module wraps the `./src/server.js` into an OS specific executable. The output is copied to:

    ./bin/{os}/


## Building the solution

When all requirements are met. Feel free to adjust the code to your needs and build the solution:

    node build.js

**NOTE**: This won't work on Windows out of the box, some additional
tweaking required. See [below](#windows)

The output is placed in the bin directory having the following structure:

    - {os}
        - cert
            - server.crt
            - server.key
        - chromium
            - {os}-{version}
        - hummus
            - binding

In the `cert` folder you can place your security certificates when running the server as https.

The hummus binary is defaultly shipped and build for Linux/Windows and Mac. When the binary does not fit the requirements of the specific operating system, then copy the binary from the `node_modules` folder as described above.

## Known problems

1. PNG export doesn't work in WSL environment (see [details](#buildinginwsl) below).
2. WSL cannot properly build server for Windows (use Windows version of node to build it).

When encountering any problems on the build:

- Check the requirements based on the used packages, like `nodejs -v` is 8+.
- Delete the `node_modules` folder,
- Delete the `cert` and `chromium` folders in the bin folder (except the HummusJS binaries - else you have to recopy the hummus binding from the `node_modules` folder).
- Delete the server executables in the bin folder.

## Starting the node server

The server can by executed as a node script:

    cd ./server
    node src/server.js


<a name="cli"></a>

## Configure and run

You can specify application options in the app.config.js or by passing them from the CLI.

In the bin directory pick your build. Running the server without argument displays available options:

    cd ./bin/linux
    ./server

    Usage: ./server [OPTION]

      -h, --http=PORT            Start http server on port
      -H, --https=PORT           Start https server on port
      -c, --cors=HOST            CORS origin, default value "*". Set to "false" to disable CORS
      -m, --maximum=SIZE         Maximum upload size (default 50mb)
      -r, --resources=PATH       The absolute path to the resource directory. This path will be accessible via the webserver
          --max-workers=WORKERS  Maximum amount of workers (puppeteer instances)
          --level=LEVEL          Specify log level (error, warn, verbose). Default "error"
          --no-sandbox           Chromium no-sandbox argument
          --verbose              Alias for --level=verbose
          --testing              Enable test mode

The following command starts a server with HTTP and HTTPS on ports 8080 and 8081 respectively:

    ./server -h 8080 -H 8081 -m 100mb

The flag -m above extends the upload capacity to 100 MB.

##### Workers

To speed up the export we parallelize it using puppeteer instances (workers). It is slower than using tabs, but much
easier to restart the export if browser or tab fails. By default there are 5 workers which feel fine on machines with
as much as 1 GB RAM. In general it takes about 2-3 seconds to generate one PDF page, depending on network speed and
overall system performance. Workers amount is not limited.

##### Resources
<a name="CORS"></a>
When sending HTML fragments to the server, the server launches puppeteer and tries to generate PDF-files based on the
provided input. In case the CSS stylesheets are not accessible to the server (for example the resources are protected
by a login session), you can make use of the built in web-server to serve resources.

In this case configure the export plugin with: `translateURLsToAbsolute : 'http://server-ip:8081/resources'`. This
tells the export plugin to change all the used stylesheet URLs to be fetched from `http://server-ip:8081/resources/....`.
This command defines the resources folder location:

    ./server -r '/web/application/resources'

##### Security

Be careful which folder to set open with the -r option; php, aspx/cs, config files won't be interpreted but served as
download when hit. Only point folders which contain resources needed for generating the page, like fonts, CSS or image files.


<a name="windows"></a>

## Windows

Since Microsoft introduced [WSL](https://docs.microsoft.com/en-us/windows/wsl/about)
developers can choose which NodeJS to use: Linux version in WSL or Windows version in host OS. Below we discuss both options.

### Building server with node for windows

There are two obstacles to build server using NodeJS:

1. Default group policy, which doesn't allow users to make symlinks.
2. Node cannot rename certain file.

#### Symlinks

Since build script relies on making symlinks, user should have this
privilege. You can either run build with administrator privilege or (better)
allow yourself to make symlinks.

To grant yourself right to create symlinks you need to adjust corresponding
group policy:

1. Press *Win + R* and type *gpedit.msc* If you are using Windows 10
you might note, that `gpedit` is missing. See [below](#gpedit) for solution.
2. Navigate to *Computer Configuration\Windows Settings\Security Settings\Local Policies\User Rights Assignment*.
3. Add users whom you trust (like yourself) to make symlinks.
4. Logout from system and log back in for group policy to take effect.

#### Node cannot rename certain file

At some point during the build process you might see exception of the
following nature:

    Error: EPERM: operation not permitted, rename

There is a similar [issue on github](https://github.com/react-community/create-react-native-app/issues/191)
which shows that multiple users experience this problem with anti-virus
software enabled. There might be a Windows Defender enabled on your machine and then disabling it fixes the issue. But disabling anti-virus completely is not safe. You might consider adding *node.exe* to the list of exceptions for your anti-virus software.
[Here](https://blog.johnnyreilly.com/2017/06/windows-defender-step-away-from-npm.html)
is a short sum-up of this issue and steps to fix Windows Defender.

<a name="gpedit"></a>

#### Enabling gpedit in Windows 10

You can find solution on the Internet in no time, but if you prefer not
to download executables or scripts from there, here is alternative
solution (doing basically the same thing, but you can actually see that
nothing criminal is going on)

1. Make new .bat file and paste this contents [source(russian language)](https://remontka.pro/cannot-find-gpedit-msc/)

    @echo off
    dir /b C:\Windows\servicing\Packages\Microsoft-Windows-GroupPolicy-ClientExtensions-Package~3*.mum >find-gpedit.txt
    dir /b C:\Windows\servicing\Packages\Microsoft-Windows-GroupPolicy-ClientTools-Package~3*.mum >>find-gpedit.txt
    echo Installing gpedit.msc
    for /f %%i in ('findstr /i . find-gpedit.txt 2^>nul') do dism /online /norestart /add-package:"C:\Windows\servicing\Packages\%%i"
    echo Gpedit installed
    pause

2. Now run this .bat file with administrator privileges


<a name="buildinginwsl"></a>

### Building server with NodeJS in WSL

WSL aims to work seamlessly, and it mostly does, but there are
rough edges still (like puppeteer support).

Server can be built/run in WSL, with few limitations. See compatibility table below:

| Built on | Running on WSL       | Running on Windows | Running on Linux |
|----------|:--------------------:|:------------------:|:----------------:|
| WSL      | PDF only w/o sandbox | Doesn't work       | PDF/PNG          |
| Windows  | PDF only w/o sandbox | PDF/PNG            | PDF/PNG          |
| Linux    | PDF only w/o sandbox | PDF/PNG            | PDF/PNG          |

Run server inside WSL with no sandbox, e.g.:

    ./server -h 8080 --no-sandbox

## Docker

Export server can be run as a Docker container. See `Dockerfile` and `docker-compose.yml` in the server directory.

### Starting container
To start Docker container run:

```
examples/_shared/server$ docker-compose up -d --build
```

Docker container will expose ports 8080 and 8081 for HTTP and HTTPS connections respectively.

### Accessing log

Server keeps an info log (see above for configuring server log level) in its local directory. It can be accessed
as follows:

```
examples/_shared$docker exec bryntum_pdfexport_server sh -c "cat log/export-server*"
2020-06-22 info: Access-Control-Allow-Origin: *
2020-06-22 info: Http server started on port 8080
2020-06-22 info: Https server started on port 8081
2020-06-22 info: POST request ...
2020-06-22 info: [Queue@...] Added 1 to the queue, current length is 1
2020-06-22 info: [Queue@...] Queue is running
2020-06-22 info: [Queue@...] Queue is stopped
2020-06-22 info: POST request ... succeeded
2020-06-22 info: [Queue@...] All workers destroyed, queue is empty
```

### Configuring demo

Using the Docker image has certain constraints. By default server doesn't have any resources (fonts, styles, etc) and it
is a separate machine with own network, so:

    1. URL of the exported page has to be accessible from the Docker container.
    2. Docker container has to be allowed to load resources. Either by setting CORS headers or by providing additional
     config
     
```javascript
new Grid({
    features : {
        pdfExport : {
            // Assuming Docker is running locally
            exportServer            : 'http://localhost:8080/',
            // Docker has to access external/global address of the exported page
            translateURLsToAbsolute : 'http://external-address:80/',
            // This is required only if you do not choose to enable CORS on web server.
            // In case your web server provides `Access-Control-Allow-Origin: *` header, this can be omitted.
            clientURL               : 'http://external-address:80/'
        }
    }
})
```

## FAQ

### Exported PDF/PNG doesn't look correct

Most likely server couldn't get access to the resources. To generate a PDF, the server would run puppeteer in headless mode,
open new tab, put content received from client to the tab and use API to generate PDF. When styles are using absolute URLs,
the PDF server running on one origin (host:port) will access a remote server on another origin. Such requests are often
blocked due to CORS policy. You need to make sure that PDF server has access to the remote server.

In order to do that, you can inspect request from the client. Find it in the network tab and see request payload. You
will find an array of HTML pages. Copy the source of any page, save it. Open that page in your browser and you will see which
requests were blocked and why. If you open that page as a file, you can easily see all CORS blocked resources.

You need to make those resources available to the PDF server, and there are two ways:
1. Modify config of your HTTP server.
2. Serve resources required by the page from the PDF server. See [this section](#CORS) for more info.

### Cannot export using HTTPS

You can see errors like `NET::ERR_CERT_AUTHORITY_INVALID` or CORS exception (in Firefox). See
 [Make browser to accept self-signed certificate](#self-signed-certificate) section for more info.
