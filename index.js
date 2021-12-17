const express = require('express')
const app = express()
var cors = require('cors')
app.use(cors())
app.use(express.json());
app.use(express.urlencoded());
const port = 3030
var util = require('util');
const {Api, TelegramClient} = require('telegram')
const {NewMessage}= require('telegram/events/')
const { StringSession } = require('telegram/sessions')
const fs = require('fs');
const input = require('input') // npm i input
const apiId = ;
const apiHash = ''
const stringSession = new StringSession(''); // fill this later with the value from session.save()
var mongoose=require("mongoose");
const { exit } = require('process');
mongoose.connect('mongodb://localhost/eric',{useNewUrlParser:true,useUnifiedTopology:true});
var db =mongoose.connection;
//const imageDirPath = resolve(__dirname, 'uploads');
let telegrams=[];
db.on('error', console.error.bind(console,'connection_error:'));
db.once('open',function(){
    console.log("connected");
    TelegramModel.find().then((p)=>{
        telegrams=p;
    })
});

const TelegramModel=mongoose.model('Telegram',
    {
        "tchannel":String,
        "tchannelid": String,
        "dischannel":String,
        "dischannelid": String
    
});
///////////////////// discord start //////////////////

const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS,Intents.FLAGS.GUILDS);
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES)
// Create a new client instance
const dclient = new Client({ intents:myIntents });

// When the client is ready, run this code (only once)
dclient.once('ready', () => {
	console.log('Ready!');
  
  
 
    
   
});
dclient.login(token)




/////////////////////////////

const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 })
async function eventPrint(event) {
    const message = event.message;
    if(message.peerId.channelId !== (undefined||null)){
        if(telegrams.length > 0){
            const chan=telegrams.find(tel=>tel.tchannelid==message.peerId.channelId);
            console.log(chan)
            if(dclient!=undefined&&chan!=undefined){
                console.log(chan.dischannelid);
                
                let channel =  dclient.channels.cache.get(chan.dischannelid);
                channel.send("Message From "+chan.tchannel+" "+message.message);
              }
        }
        console.log(message.peerId.channelId, message.message)
    }else if(message.peerId.userId !== (undefined||null)){

    }
   //console.log(event)
    //console.log(event);
    // Checks if it's a private message (from user or bot)
    
}

const start=async () => {
    console.log('Loading interactive example...')
   
    await client.start({
        phoneNumber: async () => await input.text('number ?'),
        password: async () => await input.text('password?'),
        phoneCode: async () => await input.text('Code ?'),
        onError: (err) => console.log(err),
    });
    console.log('You should now be connected.')
    console.log(client.session.save()) // Save this string to avoid logging in again

    await client.sendMessage(811254979, { message: 'Hello peep!' });
    client.addEventHandler(eventPrint, new NewMessage({}));
    
   
    
};
start();
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

app.get('/telebot/getDialogs',async (req, res) => {
    if(client!=null){
         await client.getDialogs({}).then(result => {
               
            const dialogs = [];
           
                for(var i=0; i<result.length; i++){
                   if(result[i].isChannel){
                    var obj={};
                    obj.title=result[i].title;
                    obj.name=result[i].name;
                    obj.id=result[i].entity.id;

                    dialogs.push(obj);
                   }
                   
                }

                obj_str = util.inspect(result[2].title);
               
                res.send(JSON.stringify(dialogs));
        }).catch(err => {
            console.log(err)
            res.send("error")
        });
        
        
    }
})
app.get('/telebot/getDialogss',async (req, res) => {
    if(client!=null){
        
         await client.getDialogs({}).then(result => {
               
            const dialogs = [];
                for(var i=0; i<result.length; i++){
                    var obj={};
                    obj.title=result[i].title;
                    obj.name=result[i].name;
                    obj.id=result[i].entity.id;

                    dialogs.push(obj);
                }

                obj_str = util.inspect(result[0]);
               
                res.send(obj_str);
        }).catch(err => {
            console.log(err)
            res.send("error")
        });
        
        
    }
})
app.get('/telebot/getConnections',(req, res)=>{
    TelegramModel.find().then((p)=>{
        res.send(p);
    }).catch((err)=>{
        res.send("");
    })
})

app.post('/telebot/setConnections',async (req, res)=>{
    const data=req.body;
    const filter={tchannel:data.tchannel}
    const update={
        tchannel:data.tchannel,
        tchannelid: data.tchannelid,
        dischannel:data.dischannel,
        dischannelid: data.dischannelid
    }
        let doc =await TelegramModel.findOneAndUpdate(filter, update, {
          new: true,
          upsert:true
        },(err, res) => {
          if(err) {
            console.log(err)
          }else{
            console.log(res.name)
          }
        }).catch(err => {
           
        });
        res.send("ok");
})

app.post('/telebot/delConnection',(req, res)=>{
    console.log(req.body)
    const tchannelid = req.body.tchannelid;
    TelegramModel.deleteOne({tchannelid:tchannelid,tchannel:req.body.tchannel}).then(()=>{
      res.send("done");
    }).catch((err)=>{
      res.send('err');
    })
})
app.get('/telebot/restart',(req, res)=>{
    process.exit(1);
})
// adds an event handler for new messages
