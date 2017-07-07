# How to build and run the sample in local with Docker

## How to build the sample

From this directory, run

```
docker build -t <tagname> .<dockerFilePath>

```

## How to run the sample

From this directory, run
```
docker run -p <portno:portno> <image_name>
```

## How to test the sample

We will use the Chrome Browser for testing. You can use your preferred HTTP or REST client too.

Home Page
``` 
http://localhost:8888/getAPI
```
You should able to see Home Page of the application. 


