var express = require('express');
var app = express();
app.use(express.static('www'));

var fs = require('fs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// 解决跨域请求的管道
function fun(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    next();
}

// 热门数据
app.get('/hot', fun, (req, res) => {
    fs.readFile('./datas/hot.json', "utf-8", (err, data) => {
        if (!err) {
            // console.log(data);
            res.send(data);
        }
    });
});

// 图片数据
app.get('/images', fun, (req, res) => {
    fs.readFile('./datas/images.json', "utf-8", (err, data) => {
        if (!err) {
            // console.log(data);
            res.send(data);
        }
    });
});

// 段子数据
app.get('/duanzi', fun, (req, res) => {
    fs.readFile('./datas/duanzi.json', "utf-8", (err, data) => {
        if (!err) {
            // console.log(data);
            res.send(data);
        }
    });
});

// 咪秀数据
app.get('/mixiu', fun, (req, res) => {
    fs.readFile('./datas/mixiu.json', "utf-8", (err, data) => {
        if (!err) {
            // console.log(data);
            res.send(data);
        }
    });
});

// 关注数据
app.get('/guanzhu', fun, (req, res) => {
    fs.readFile('./datas/guanzhu.json', "utf-8", (err, data) => {
        if (!err) {
            // console.log(data);
            res.send(data);
        }
    });
});

// 视频数据
app.get('/vidio', fun, (req, res) => {
    fs.readFile('./datas/vidio.json', "utf-8", (err, data) => {
        if (!err) {
            // console.log(data);
            res.send(data);
        }
    });
});

// 登录
app.post('/login', fun, (req, res) => {
    // console.log('已经发送请求了');
    // console.log(req.body);
    // 要读取的文件路径
    var filePath = 'users/' + req.body.userName + '.txt';
    fs.exists(filePath, (exits) => {
        if (exits) {
            // 用户已存在
            // 读取文件数据
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    res.json({
                        code: 2,
                        info: '登录失败，读取文件失败！'
                    });
                } else {
                    // console.log(typeof data);//string
                    var userData = JSON.parse(data);
                    // console.log(userData);
                    // console.log(typeof userData);//object

                    // 已经确认有该用户了，接下来就是在该用户的文件内对比密码
                    var date = new Date();
                    date.setMonth(date.getMonth() + 1);
                    if (userData.pwd == req.body.pwd) {
                        // res.cookie()创建cookie，express就会将其填入Response Header中的Set-Cookie，
                        // 达到在浏览器中设置cookie的作用。
                        // expires设置有效期直到下个月的今天，即为一个月
                        res.cookie('userName', req.body.userName, {
                            expires: date
                        });
                        res.status(200).json({
                            code: 0,
                            info: '登录成功！',
                            msg: req.body
                        });
                    } else {
                        res.status(200).json({
                            code: 3,
                            info: '登录失败，密码错误！'
                        });
                    }
                }
            })
        } else {
            // 用户不存在，无法登录
            res.status(200).json({
                code: 1,
                info: '登录失败，该用户不存在！'
            })
        }
    })
});

// 注册
app.post('/register', fun, (req, res) => {
    // console.log('已经收到请求了');
    // console.log(req.body);
    fs.exists('users', (exist) => {
        // console.log(exist);//得到的是一个布尔值
        if (exist) {
            // 将文件写入
            writeToFile();
        } else {
            fs.mkdir('users', (err) => {
                if (err) {
                    res.status(200).json({
                        code: 1,
                        info: '注册失败，文件夹写入失败！'
                    })
                } else {
                    // 将文件写入
                    writeToFile();
                }
            })
        }

    });

    // 写入文件的函数
    function writeToFile() {
        var filePath = 'users/' + req.body.userName + '.txt';
        // 判断用户文件夹下是否存在该用户文件
        fs.exists(filePath, (exits) => {
            if (exits) {
                // 该用户已存在
                res.status(200).json({
                    code: 2,
                    info: '注册失败，该用户已存在！'
                });
            } else {
                // 该用户文件不存在则写入文件，入档
                // JSON.stringify(req.body) 将数据转换成字符串
                fs.writeFile(filePath, JSON.stringify(req.body), (err) => {
                    if (err) {
                        res.status(200).json({
                            code: 3,
                            info: '注册失败，文件写入失败！！'
                        })
                    } else {
                        res.status(200).json({
                            code: 0,
                            info: '注册成功',
                            msg: req.body
                        });
                    }
                })
            }
        })
    }

});




app.listen(3000, () => {
    console.log('server running...');
});