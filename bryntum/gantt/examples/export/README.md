# Export demo

This demo shows how to use export to PDF/PNG feature with Gantt.
It includes server which gets HTML from browser and makes PDF/PNG.

## Setup

1. Setup the server

    Server is located in `examples/_shared/server`

    Navigate to `examples/_shared/server/README.md` for instructions.
    Usually it should be enough to run:
    
    ```
    cd examples/_shared/server/ && npm i && node ./src/server.js -h 8080 -r /path/to/resources
    ```
   
    where `/path/to/resources` is the physical path to the resources folder.
    It is required to correctly load FontAwesome which is used to show icons.
   
    For example
   
    ```
    # url              : http://localhost/gantt-x.y.z-trial/examples/export
    # path             : /home/www/gantt-x.y.z-trial/examples/export
    # resource path    : /home/www/gantt-x.y.z-trial/
    
    node ./src/server.js -h 8080 -r /home/www/
    ```  
   
2. Configure example to use your server

    By default example is setup to use `localhost:8080`
    
3. Open this example in browser, press `Export` and check various export
options    

## Alternate setup (Docker)

You can use our Docker image to run the export server. To start the container run:
```bash
examples/_shared/server$ docker-compose up -d --build
```

Feature config should be changed too:
```javascript
new Gantt({
    features : {
        pdfExport : {
            // Assuming Docker is running locally
            exportServer            : 'http://localhost:8080/',
            // Docker runs in own subnet, it should be able to access global address of the exported page
            translateURLsToAbsolute : 'http://external-address:80/',
            // This is required only if you do not choose to enable CORS on web server.
            // In case your web server provides `Access-Control-Allow-Origin: *` header, this can be omitted.
            clientURL               : 'http://external-address:80/'
        }
    }
})
```

See corresponding section in `examples/_shared/server/README.md` for more details.
