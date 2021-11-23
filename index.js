const express = require('express')
const app = express()
const port = 3030
var util = require('util');
const {Api, TelegramClient} = require('telegram')
const {NewMessage}= require('telegram/events/')
const { StringSession } = require('telegram/sessions')
const fs = require('fs');
const input = require('input') // npm i input
const apiId = 19127306;
const apiHash = 'ef55f577ddb4f3c0d975b32e9fc37722'
const stringSession = new StringSession('1BQANOTEuMTA4LjU2LjE4NQG7YSIlNRbMy7StTRUyJdgIKQR2FWheKxdCQLVZaGwl30Cd7o7c/0BbbIk+fNDyoma+s/Q2z7KaXiSGovq6jT1EtEM9nVD4PHtkQJjdnLpL9ukf54wEGqoax0r3ld9fry97BmlLQHfzCQuWsyBlxx6YXhWEJtkWSaSjTV2nEd2ZSnbtPb8zznGVPM42xua1ZxRp0ZHKUJOf5LYcJXjtNuKJOwCior2HkSXXt0vRUH/qy3tpCNAfuZXx75xoLpgwUDd7semWEM0v+IXgQGDoyZaWWNepWMrblOYKyxZPmB3qlkMRXLqhuZ5oKY/TJHxnaUHqekGbgOQeBkMfY9WTaoqvag=='); // fill this later with the value from session.save()


const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 })
async function eventPrint(event) {
    const message = event.message;
   // console.log(message);
    // Checks if it's a private message (from user or bot)
    if (event.isPrivate){
        // prints sender id
        console.log(message.senderId);
        // read message
        if (message.text == "hello"){
            const sender = await message.getSender();
            console.log("sender is",sender);
            await client.sendMessage(sender,{
                message:`hi your id is ${message.senderId}`
            });
        }
    }
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

    await client.sendMessage('me', { message: 'Hello!' });
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
                    var obj={};
                    obj.title=result[i].title;
                    obj.name=result[i].name;
                    obj.id=result[i].id;
                    dialogs.push(obj);
                }

               // obj_str = util.inspect(result[0].title);
               
                res.send(JSON.stringify(dialogs));
        }).catch(err => {
            console.log(err)
            res.send("error")
        });
        
        
    }
})
// adds an event handler for new messages
