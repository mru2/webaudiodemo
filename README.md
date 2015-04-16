# [DEMO](https://webaudiodemo.s3-eu-west-1.amazonaws.com/index.html)


## Setting up

```
git clone https://github.com/mru2/webaudiodemo.git && cd webaudiodemo
npm install
bower install
gulp serve
```

## Customize

Put stems in `app/stems`

Configure board in `app/scripts/main.js`


## Deployment

```
gulp
```

Then upload the `dist` folder to the server of your choosing (AWS S3 + cloudfront works well)
