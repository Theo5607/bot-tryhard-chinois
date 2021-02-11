const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'ODA2MjUwOTI5OTI1MjU5MzQ1.YBmtsQ.QpdvE9pcderLYOjoZEIMnFU2wVs';

const fs = require('fs');

caracteres={
    1 : [],
    2 : [],
    3 : [],
    4 : [],
    5 : [],
    6 : []
};

for(let i = 1; i < 7; i++) {
    let caracteres_hsk = require('./Caracteres/hsk-level-'+i+'.json');
    caracteres[i]=caracteres_hsk;
}

function register_data(language, channel_id, serveur_id, niveau_hsk, nb_cara_jour, nb_actuel, message_test, liste_de_la_correction, id_role) {
    let channel_data = {
        channel : channel_id,
        langue : language,
        niveau_hsk : niveau_hsk,
        nb_cara_jour : nb_cara_jour,
        nb_actuel : nb_actuel,
        id_message_test : message_test,
        liste_correction : liste_de_la_correction,
        role : id_role
    };

    console.log(channel_data);

    let data = JSON.stringify(channel_data, null, 2);

    fs.writeFileSync(serveur_id+'.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
}

function get_data(serveur_id) {
    console.log(serveur_id+'.json');
    let data = fs.readFileSync(serveur_id+'.json');
    console.log(data);
    let infos = JSON.parse(data);
    console.log(infos);
    return infos;
}

function leftToEight(){
    var d = new Date();
    return (-d + d.setHours(8,0,0,0));
}

function sendMessage(userID, serveurID) {
    var date = new Date();
    var jour = date.getDay();
    var infos = get_data(serveurID);

    if(jour < 6) {
        if(infos['role'].length==0) {
            if(infos['langue']=='fr') {
                bot.channels.cache.get(channel_id).send('**Caractère du jour :**\n:arrow_right: Caractère: '+caracteres[infos['niveau_hsk']][infos['nb_actuel']]['hanzi']+'\n:arrow_right: Pinyin: '+caracteres[infos['niveau_hsk']][infos['nb_actuel']]['pinyin']+'\n:arrow_right: Traduction: '+caracteres[infos['niveau_hsk']][infos['nb_actuel']]['translations']);
            } else if(infos['langue']=='en') {
                bot.channels.cache.get(channel_id).send('**Character of the day :**\n:arrow_right: Caractère: '+caracteres[infos['niveau_hsk']][infos['nb_actuel']]['hanzi']+'\n:arrow_right: Pinyin: '+caracteres[infos['niveau_hsk']][infos['nb_actuel']]['pinyin']+'\n:arrow_right: Traduction: '+caracteres[infos['niveau_hsk']][infos['nb_actuel']]['translations']);
            }
        } else {
            if(infos['langue']=='fr') {
                bot.channels.cache.get(channel_id).send(infos['role']+' **Caractère du jour :**\n:arrow_right: Caractère: '+caracteres[infos['niveau_hsk']][infos['nb_actuel']]['hanzi']+'\n:arrow_right: Pinyin: '+caracteres[infos['niveau_hsk']][infos['nb_actuel']]['pinyin']+'\n:arrow_right: Traduction: '+caracteres[infos['niveau_hsk']][infos['nb_actuel']]['translations']);
            } else if(infos['langue']=='en') {
                bot.channels.cache.get(channel_id).send(infos['role']+' **Character of the day :**\n:arrow_right: Caractère: '+caracteres[infos['niveau_hsk']][infos['nb_actuel']]['hanzi']+'\n:arrow_right: Pinyin: '+caracteres[infos['niveau_hsk']][infos['nb_actuel']]['pinyin']+'\n:arrow_right: Traduction: '+caracteres[infos['niveau_hsk']][infos['nb_actuel']]['translations']);
            }
        }
        register_data(infos['langue'], infos['channel'], serveurID, infos['niveau_hsk'], infos['nb_cara_jour'], infos['nb_actuel']+1, '', []);
    } else if(jour==6) {
        if(nb_actuel==0) {
            if(infos['langue']=='fr') {
                bot.channels.cache.get(infos['channel']).send("**Vous n'avez pas encore appris de caractères !**");
            } else if(infos['langue']=='en') {
                bot.channels.cache.get(infos['channel']).send("**You haven't learned any characters yet!**");
            }
        } else {
            var nb_pinyin=infos['nb_actuel']-5

            if(nb_pinyin<0) {
                nb_pinyin=nb_pinyin+(nb_pinyin*(-1))
            }
            liste_pinyin='';
            for(let i=nb_pinyin; i < nb_pinyin+5; i++) {
                if(liste_pinyin.length==0) {
                    liste_pinyin = liste_pinyin+caracteres[infos['niveau_hsk']][i]['pinyin'];
                } else {
                    liste_pinyin = liste_pinyin+' **//** '+caracteres[infos['niveau_hsk']][i]['pinyin'];
                }
            }

            if(infos['role'].length==0) {
                if(infos['langue']=='fr') {
                    bot.channels.cache.get(infos['channel']).send("**Aujourd'hui, entraînement sur les pinyins de la semaine:**\n:arrow_right: "+liste_pinyin);
                } else if(infos['langue']=='en') {
                    bot.channels.cache.get(infos['channel']).send("**Today, training on the pinyins of the week:**\n:arrow_right: "+liste_pinyin);
                }
            } else {
                if(infos['langue']=='fr') {
                    bot.channels.cache.get(infos['channel']).send(infos['role']+" **Aujourd'hui, entraînement sur les pinyins de la semaine:**\n:arrow_right: "+liste_pinyin);
                } else if(infos['langue']=='en') {
                    bot.channels.cache.get(infos['channel']).send(infos['role']+" **Today, training on the pinyins of the week:**\n:arrow_right: "+liste_pinyin);
                }
            }
        }
    } else if(jour==7) {
        if(infos['nb_actuel']==0) {
            if(infos['langue']=='fr') {
                bot.channels.cache.get(infos['channel']).send("**Vous n'avez pas encore appris de caractères !**");
            } else if(infos['langue']=='en') {
                bot.channels.cache.get(infos['channel']).send("**You haven't learned any characters yet!**");
            }
        } else {
            if(infos['role'].length==0) {
                if(infos['langue']=='fr') {
                    bot.channels.cache.get(infos['channel']).send("**Contrôle sur les mots appris cette semaine :**\nEssayez de réécrire le caractère et le pinyin, puis réagissez avec :page_facing_up: pour obtenir la correction en MP.");
                } else if(infos['langue']=='en') {
                    bot.channels.cache.get(infos['channel']).send("**Check on the words learned this week :**\nTry to rewrite the character and pinyin, then react with :page_facing_up: to get the correction in DM.");
                }
            } else {
                if(infos['langue']=='fr') {
                    bot.channels.cache.get(infos['channel']).send(infos['role']+" **Contrôle sur les mots appris cette semaine :**\nEssayez de réécrire le caractère et le pinyin, puis réagissez avec :page_facing_up: pour obtenir la correction en MP.");
                } else if(infos['langue']=='en') {
                    bot.channels.cache.get(infos['channel']).send(infos['role']+" **Check on the words learned this week :**\nTry to rewrite the character and pinyin, then react with :page_facing_up: to get the correction in DM.");
                }
            }

            var nb_trad=infos['nb_actuel']-5

            if(nb_trad<0) {
                nb_trad=nb_trad+(nb_trad*(-1))
            }
            var liste_trad='';
            for(let i=nb_trad; i < nb_trad+5; i++) {
                liste_trad = liste_trad+' **//** '+caracteres[niveau_hsk][i]['translations']
                liste_correction.push('**'+caracteres[niveau_hsk][i]['translations']+':** '+caracteres[niveau_hsk][i]['hanzi']+'  '+caracteres[niveau_hsk][i]['pinyin'])
            }
            
            bot.channels.cache.get(channel_id).send(":arrow_right: "+liste_trad).then(msg => {
                msg.react('📄');
                register_data(infos['langue'], infos['channel'], serveurID, infos['niveau_hsk'], infos['nb_cara_jour'], infos['nb_actuel'], msg.id, liste_correction);
            })
        }
    }
}

bot.on('ready', () => {
    console.log('Tryhard Chinois est en ligne');
    bot.user.setActivity('tc!help', { type: 'LISTENING' });
})

bot.on('messageReactionAdd', (reaction, user) => {
    let msg = reaction.message, emoji = reaction.emoji;

    if(msg.id == get_data(msg.guild.id)['id_message_test'] && emoji.name=='📄' && user.id!='806250929925259345') {
        var date = new Date();
        var jour = date.getDay();
        if(jour==7) {
            mess_correction='**Correction:\n**'
            get_data(msg.guild.id)['liste_correction'].forEach(element => mess_correction=mess_correction+'\n'+element);
            user.send(mess_correction)
        } else {
            if(langue=='fr') {
                bot.channels.cache.get(get_data(msg.guild.id)['channel_id']).send('<@'+user.id+'> **Il est trop tard pour faire ce contrôle !**')
            } else if(langue=='en') {
                bot.channels.cache.get(get_data(msg.guild.id)['channel_id']).send('<@'+user.id+'> **It is too late to do this check !**')
            }
        }
        reaction.remove();
        msg.react('📄');
    } else if(msg.id == get_data(msg.guild.id)['id_message_test'] && emoji.name!='📄') {
        reaction.remove();
    }
})

bot.on('message', msg => {
    if (msg.content.substring(0, 3) == 'tc!') {
        var args = msg.content.substring(3).split(' ');
        console.log(args);
        var cmd = args[0];

        args = args.splice(1);

        switch(cmd) {
            case 'setup':
                channel_id = msg.channel.id;
                
                if(typeof args[0] != undefined) {
                    if(args[0]=='en') {
                        langue=args[0]
                        msg.channel.send('**Registered channel and language.**');
                        register_data(langue, msg.channel.id, msg.guild.id, 0, 0, 0, '', [], '')
                    } else if(args[0]=='fr') {
                        langue=args[0]
                        msg.channel.send('**Channel et langue enregistrés.**');
                        register_data(langue, msg.channel.id, msg.guild.id, 0, 0, 0, '', [], '')
                    } else {
                        msg.channel.send('**Unrecognized language.**');
                    }
                } else {
                    msg.channel.send('**No language specified.**');
                }
            break;

            case 'start':
                if(fs.existsSync(msg.guild.id+'.json')) {
                    if(msg.channel.id==get_data(msg.guild.id)['channel']) {
                        if(typeof args[1] != undefined) {
                            if(parseInt(args[0])!=1 && parseInt(args[0])!=2 && parseInt(args[0])!=3 && parseInt(args[0])!=4 && parseInt(args[0])!=5 && parseInt(args[0])!=6) {
                                if(get_data(msg.guild.id)['langue']=='fr') {
                                    msg.channel.send('**Une valeur entre 1 et 6 est attendue.**');
                                } else if(get_data(msg.guild.id)['langue']=='en') {
                                    msg.channel.send('**A value between 1 and 6 is expected.**');
                                }
                            } else if(isNaN(args[1]) == true){
                                if(get_data(msg.guild.id)['langue']=='fr') {
                                    msg.channel.send("**La valeur n'est pas un nombre.**");
                                } else if(get_data(msg.guild.id)['langue']=='en') {
                                    msg.channel.send('**The value is not a number.**');
                                }
                            } else if(parseInt(args[1]) > 20 || parseInt(args[1]) < 1) {
                                if(get_data(msg.guild.id)['langue']=='fr') {
                                    msg.channel.send("**Une valeur entre 1 et 20 est attendue.**");
                                } else if(get_data(msg.guild.id)['langue']=='en') {
                                    msg.channel.send('**A value between 1 and 20 is expected.**');
                                }
                            } else {
                                niveau_hsk = args[0];
                                nb_cara_jour = args[1];
                                register_data(get_data(msg.guild.id)['langue'], get_data(msg.guild.id)['channel'], msg.guild.id, args[0], args[1], 0, '', [], get_data(msg.guild.id)['role'])
                                if(get_data(msg.guild.id)['langue']=='fr') {
                                    msg.channel.send("**Données enregistrées.**");
                                } else if(get_data(msg.guild.id)['langue']=='en') {
                                    msg.channel.send('**Recorded data.**');
                                }
    
                                setTimeout(function(){ // in leftToEight() miliseconds run this:
                                    sendMessage(msg.author.id, msg.guild.id); // send the message once
                                    
                                    var dayMillseconds = 1000 * 60 * 60 * 24;
                                    //var dayMillseconds = 1000;
                                    setInterval(function(){ // repeat this every 24 hours
                                        sendMessage(msg.author.id, msg.guild.id);
                                    }, dayMillseconds)
                                }, leftToEight())
                            }
                        } else {
                            if(get_data(msg.guild.id)['langue']=='fr') {
                                msg.channel.send('**Mauvais paramètres spécifiés :** tc!start [niveau_hsk] [nb_caracteres_par_jour]');
                            } else if(get_data(msg.guild.id)['langue']=='en') {
                                msg.channel.send('**Wrong parameters specified :** tc!start [hsk_level] [number_of_characters_per_day]');
                            }
                        }
                    } else {
                        if(get_data(msg.guild.id)['langue']=='fr') {
                            msg.channel.send('**Mauvais channel.**');
                        } else if(get_data(msg.guild.id)['langue']=='en') {
                            msg.channel.send('**Wrong channel.**');
                        }
                    }
                } else {
                    msg.channel.send('**First choose a channel and a language with command** tc!setup [language]');
                }
            break;

            case 'role':
                if(fs.existsSync(msg.guild.id+'.json')) {
                    if(msg.channel.id==get_data(msg.guild.id)['channel']) {
                        if(typeof args[0] != undefined) {
                            if (args[0].startsWith('<@') && args[0].endsWith('>')) {
                                register_data(get_data(msg.guild.id)['langue'], get_data(msg.guild.id)['channel'], msg.guild.id, get_data(msg.guild.id)['niveau_hsk'], get_data(msg.guild.id)['nb_cara_jour'], get_data(msg.guild.id)['nb_actuel'],  get_data(msg.guild.id)['id_message_test'], get_data(msg.guild.id)['liste_correction'], args[0])
                                if(get_data(msg.guild.id)['langue']=='fr') {
                                    msg.channel.send('**Rôle enregistré.**');
                                } else if(get_data(msg.guild.id)['langue']=='en') {
                                    msg.channel.send('**Registered role.**');
                                }
                            } else {
                                if(get_data(msg.guild.id)['langue']=='fr') {
                                    msg.channel.send('**Pas de rôle spécifié.**');
                                } else if(get_data(msg.guild.id)['langue']=='en') {
                                    msg.channel.send('**No role specified.**');
                                }
                            }
                        } else {
                            if(get_data(msg.guild.id)['langue']=='fr') {
                                msg.channel.send('**Pas de rôle spécifié.**');
                            } else if(get_data(msg.guild.id)['langue']=='en') {
                                msg.channel.send('**No role specified.**');
                            }
                        }
                    } else {
                        if(get_data(msg.guild.id)['langue']=='fr') {
                            msg.channel.send('**Mauvais channel.**');
                        } else if(get_data(msg.guild.id)['langue']=='en') {
                            msg.channel.send('**Wrong channel.**');
                        }
                    }
                } else {
                    msg.channel.send('**First choose a channel and a language with command** tc!setup [language]');
                }
            break;
            }
    }
})

bot.login(token);