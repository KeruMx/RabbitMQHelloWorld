let amqp = require('amqplib/callback_api');
amqp.connect('ampa://localhost', function(error, connection) {
    if (error)
        throw error;
    connection.createChannerl(function(eror1,channel){
        if(eror1)
            throw error1;
        let queue = 'hello';
        let msg = 'world';
        channel.sendToQueue(queue, {
            durable: false
        });
        channel.sendToQueue(queue, Buffer.from(msg));
        console.log("[x] Sent %s ",msg);
    })
    setTimeout(function () {
        connection.close();
        process.exit(0);
    }, 500);
})