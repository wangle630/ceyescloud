var ffmpeg = require('fluent-ffmpeg');

pushRtmpByFluent = function (inputPath, outputPath, res) {

    var proc = ffmpeg(inputPath)
        .inputOptions('-re')
        .addInput( __dirname + '/logo.png')
        .complexFilter([
            {
                filter: 'scale',
                options: [1080, -1],
                inputs: '[0:v]',
                outputs: 'c'
            },
            {
                filter: 'scale',
                options: [200, -1],
                inputs: '[1:v]',
                outputs: 'logo'
            },
            {
                filter: 'overlay',
                options: {
                    x: 'main_w-overlay_w-5',
                    y: 5
                },
                inputs: ['c', 'logo'],
                outputs: ['output']
            }
        ], 'output')
        .on('codecData', function (data) {
            console.log('Input is ' + data.audio + ' audio ' + 'with ' + data.video + ' video');
        })
        .on('data', function (chunk) {
            console.log('ffmpeg just wrote ' + chunk.length + ' bytes');
        })
        .on('start', function (commandLine) {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
            //res.send(commandLine);
        })
        //如果输入为stream时，有可能会出错
        //.on('progress', function(progress) {
        //    console.log('Processing: ' + progress.percent + '% done');
        //})
        .on('end', function (progress) {
            console.log(progress);
            res.send(progress);
        })
        .on('error', function (err) {
            console.log('an error happened: ' + err.message);
            res.send(err.message)
        })
        .addOptions([
            '-vcodec libx264',
            '-preset veryfast',
            '-crf 22',
            '-maxrate 1000k',
            '-bufsize 3000k',
            '-acodec libmp3lame',
            '-ac 2',
            '-ar 44100',
            '-b:a 96k'
        ])
        .format('flv')//只有用flv格式输出才能向rtmp推流
        .output(outputPath, {end: true}) //end = true, close output stream after writing
        .run();

}

exports.pushRtmp = function (req, res) {
    //输入流
    var inputPath = req.body.inPutUrl;
    //输出流
    var outputPath = req.body.outPutUrl + '/' + req.body.outPutCode;

    var verifyPath = outputPath.split('?')[0];

    var exec = require('child_process').exec;

    commend = exec('ps aux|grep "' + verifyPath + '" | grep -v grep | wc -l');
    commend.stdout.on('data', function (data) {
        console.log('standard output:\n' + data);
        if(data && (data > 0)){
            res.send('已经存该视频的推流' + data + '个')
        }else{
        pushRtmpByFluent(inputPath, outputPath, res)
        }
    });
    commend.on('exit', function (code) {
        console.log('child process eixt ,exit:' + code);
    });

    commend.on('error', function (code, signal) {
        console.log('child process error ,error:' + code);
        console.log('child process error ,error:' + signal);
        res.send(code + signal);
    });

}
//kill $(ps aux|grep "xxxx"|awk '{print $2}')

exports.killProcess = function (req, res) {
    //删除包含该字符串的进程

    var strParameter = req.body.strParameter;

    var exec = require('child_process').exec;

    if (strParameter.indexOf("://") > 0) {

        commend = exec('kill $(ps aux|grep "' + strParameter + '" |awk ' + "'{print $2}')");
        commend.stdout.on('data', function (data) {
            console.log('data:' + data)
        });
        commend.on('exit', function (code) {
            console.log('child process eixt ,exit:' + code);
        });

        commend.on('error', function (code, signal) {
            console.log('child process error ,error:' + code);
            console.log('child process error ,error:' + signal);
            res.send(code + signal);
        });
    } else {
        res.send('非法请求参数');
    }


}