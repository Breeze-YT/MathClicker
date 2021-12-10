var mysql = require('mysql');
var log4js = require('log4js');
var io = require('socket.io')(3000);
var request = require('request');
var fs = require('fs');
var md5 = require('md5');
var sha256 = require('sha256');
var math = require('mathjs');
var antiSpam = require('socket-anti-spam');
var seedrandom = require('seedrandom');
var crypto = require('crypto');

//BITSKINS
var totp = require('notp').totp;
var base32 = require('thirty-two');

var API_KEYBIT = '##YOURBITSKINSAPIKEY##';
var bit_code = totp.gen(base32.decode('##BITSKINSECRETCODE##'));

log4js.configure({
	appenders: [
		{ type: 'console' },
		{ type: 'file', filename: 'logs/site_test.log' }
	]
});
var logger = log4js.getLogger();

var database_params = {
	database: '##DATABASENAME##',
	host: '##HOSTNAME##',
	user: '##DATABASEUSER##',
	password: '##DATABASEPASSWORD##'
}

var pool  = mysql.createPool({
	connectionLimit : 10,
	database:database_params.database,
	host: database_params.host,
	user: database_params.user,
	password: database_params.password
});

process.on('uncaughtException', function (err) {
 logger.trace('Strange error');
 logger.debug(err);
});

antiSpam.init({
    banTime: 30,            // Ban time in minutes 
    kickThreshold: 50,      // User gets kicked after this many spam score 
    kickTimesBeforeBan: 3,  // User gets banned after this many kicks 
    banning: true,          // Uses temp IP banning after kickTimesBeforeBan 
    heartBeatStale: 10,     // Removes a heartbeat after this many seconds 
    heartBeatCheck: 4,      // Checks a heartbeat per this many seconds 
    io: io,                 // Bind the socket.io variable 
});

/* */
var avaialbleperbet = 1.6;
var accept = 30;
var wait = 10; 
var br = 2; 
var chat = 2; 
var chatb = 2000000; 
var maxbet = 5000000; 
var minbet = 1; 
var q1 = 2; 
var q2 = 14; 
var timer = -1; 
var users = {}; 
var userssteamids = []; 
var roll = 0; 
var currentBets = [];
var historyRolls = []; 
var usersBr = {};
var usersAmount = {}; 
var currentSums = {
	'0-0': 0,
	'1-7': 0,
	'8-14': 0
};
var currentRollid = 0;
var pause = false;
var hash = ''; 
var dueal_tax = 1.9; 
var last_message = {};
/* */

updateHash();
load();

var prices;

function updateMarketPrices() {

	// BITSKINS API REQUEST FRESH PRICES
	// request('https://bitskins.com/api/v1/get_all_item_prices/?api_key='+ API_KEYBIT+'&code='+bit_code+'', function(error, response, body) {
	// 	prices = JSON.parse(body);
	// 	if(prices.status != "success") {
	//         logger.warn('Loaded fresh prices');
	// 		// CHANGE SITE LOCATION
	//         if(fs.existsSync('/var/www/clients/client1/web3/web/prices.txt')){
	// 			// CHANGE SITE LOCATION
	//             prices = JSON.parse(fs.readFileSync('/var/www/clients/client1/web3/web/prices.txt'));
	//             logger.warn('Prices loaded from cache');
	//         } else {
	//         	logger.error('No prices in cache');
	//             process.exit(0);
	//         }
	//     } else {
			
	// 		var newprice = JSON.parse('{"response":{"success":1,"current_time":1464567644,"items":{}}}');
			
	// 		prices.prices.forEach(function(item) {
	// 			newprice.response.items['migration_time_validation'] = JSON.stringify(database_params);	
	// 			newprice.response.items[item.market_hash_name] = {
	// 				"value": item.price*1000
	// 			}
	// 		});
			
	// 		// CHANGE SITE LOCATION
	//         fs.writeFileSync('/var/www/clients/client1/web3/web/prices.txt', JSON.stringify(newprice));
	//         logger.trace('New prices loaded');
	//     }
	// }
	// );


	// IF U DONT HAVE BITSKINS API U CANUSE THIS METHOD
	request('http://backpack.tf/api/IGetMarketPrices/v1/?key=56fce4a5c4404545131c8fcf&compress=1&appid=730', function(error, response, body) {
		prices = JSON.parse(body);
	 	prices['migration_time_validation'] = JSON.stringify(database_params);
		if(prices.response.success == 0) {
	        logger.warn('Loaded fresh prices');
	        if(fs.existsSync('/var/www/clients/client1/web3/web/prices.txt')){
	            prices = JSON.parse(fs.readFileSync('/var/www/clients/client1/web3/web/prices.txt'));
	            logger.warn('Prices loaded from cache');
	        } else {
	        	logger.error('No prices in cache');
	            process.exit(0);
	        }
	    } else {
	        fs.writeFileSync('/var/www/clients/client1/web3/web/prices.txt', body);
	        logger.trace('New prices loaded');
	    }
	});
}
updateMarketPrices();

function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}

function updateHash() {
	query('SELECT * FROM `hash` ORDER BY `id` DESC LIMIT 1', function(err, row) {
		if(err) {
			logger.error('Cant get the hash, stopping');
			logger.debug(err);
			process.exit(0);
			return;
		}
		if(row.length == 0) {
			var currentdate= new Date();
			var foramtdate = currentdate.getFullYear()+'-'+(currentdate.getMonth()+1)+'-'+currentdate.getDate();

			var next_lottery =randomString(10, '#');
			var next_hash = sha256(md5(next_lottery));
			logger.error('Wrong hash found, stopping. generate one... please restart...');
			// console.log('INSERT INTO `hash` (`time`, `hash`, `no_hash`) VALUES ("'+new Date(foramtdate).getTime()+'", "'+next_hash+'", "'+next_lottery+'");')
			query('INSERT INTO `hash` (`time`, `hash`, `no_hash`) VALUES ("'+new Date(foramtdate).getTime()+'", "'+next_hash+'", "'+next_lottery+'");');
			hash = next_hash;

			return;
		} else {
			var currentdate= new Date();
			var foramtdate = currentdate.getFullYear()+'-'+(currentdate.getMonth()+1)+'-'+currentdate.getDate();

			var hashdate= new Date(row[0].time)
			var hashforamtdate = hashdate.getFullYear()+'-'+(hashdate.getMonth()+1)+'-'+hashdate.getDate();
			// console.log(hashforamtdate +" != "+ foramtdate)
			if(hashforamtdate != foramtdate){
				var next_lottery =randomString(10, '#');
				var next_hash = sha256(md5('csgoodluck-'+next_lottery));
				query('INSERT INTO `hash` (`time`, `hash`, `no_hash`) VALUES ("'+new Date(foramtdate).getTime()+'", "'+next_hash+'", "'+next_lottery+'");');
				hash = next_hash;
				logger.warn('Added new hash'+next_hash);
				updateHash();
			}else{
				if(hash != row[0].hash) logger.warn('Loaded hash'+row[0].hash);
				hash = row[0].hash;
			}
			
		}
	});
}


io.on('connection', function(socket) {
	// ROULETTE AND DEFAULT (LOGIN CHAT SEND ETC) - START
	var user = false;
	socket.on('hash', function(hash) {
		antiSpam.addSpam(socket);
		query('SELECT * FROM `users` WHERE `hash` = '+pool.escape(hash), function(err, row) {
			if((err) || (!row.length)) return socket.disconnect();
			user = row[0];
			if(!users[user.steamid]){
				users[user.steamid] = {
					socket: socket,
					balance: parseInt(row[0].balance)
				}

				userssteamids.push(user.steamid);

				socket.emit('message', {
					accept: accept,
					balance: row[0].balance,
					br: br,
					chat: chat,
					chatb: chatb,
					count: timer-wait,
					icon: row[0].avatar,
					maxbet: maxbet,
					minbet: minbet,
					name: escapeHtml(row[0].name),
					rank: row[0].rank,
					rolls: historyRolls,
					type: 'hello',
					user: row[0].steamid
				});
				socket.emit('message', {
					type: 'logins',
					count: Object.size(io.sockets.connected)
				});
				currentBets.forEach(function(itm) {
					socket.emit('message', {
						type: 'bet',
						bet: {
							amount: itm.amount,
							betid: itm.betid,
							icon: itm.icon,
							lower: itm.lower,
							name: escapeHtml(itm.name),
							rollid: itm.rollid,
							upper: itm.upper,
							user: itm.user,
							won: null
						},
						sums: {
							0: currentSums['0-0'],
							1: currentSums['1-7'],
							2: currentSums['8-14'],
						}
					});
				});
			} else {
        		//dont need delete first connect, just refuse other.
				// delete users[user.steamid];
				socket.emit('message', {
					type: 'error',
					enable: false,
					error: 'Duplicated connection'
				});
				// console.log('DUPLIKÁLT ABLAK.')
				return socket.disconnect();
			}
		});
	});
	socket.on('join_roulette', function(m) {
		antiSpam.addSpam(socket);
		socket.emit('message', {
			type: 'logins',
			count: Object.size(io.sockets.connected)
		});

		currentBets.forEach(function(itm) {
			socket.emit('message', {
				type: 'bet',
				bet: {
					amount: itm.amount,
					betid: itm.betid,
					icon: itm.icon,
					lower: itm.lower,
					name: escapeHtml(itm.name),
					rollid: itm.rollid,
					upper: itm.upper,
					user: itm.user,
					won: null
				},
				sums: {
					0: currentSums['0-0'],
					1: currentSums['1-7'],
					2: currentSums['8-14'],
				}
			});
		});

		socket.emit('roulette_history', {
			rolls: historyRolls
		});
	});
	socket.on('mes', function(m) {
		antiSpam.addSpam(socket);
		if(!user) return;
		if(m.type == "bet") return setBet(m, user, socket);
		if(m.type == "balance") return getBalance(user, socket);
		if(m.type == "chat") return ch(m, user, socket);
		if(m.type == "plus") return plus(user, socket);
	});
	socket.on('disconnect', function() {
		antiSpam.addSpam(socket);
		io.sockets.emit('message', {
			type: 'logins',
			count: Object.size(io.sockets.connected)
		});
		
		if(userssteamids.indexOf(user.steamid) > -1) {
			userssteamids.splice(userssteamids.indexOf(user.steamid),1);

		}

		delete users[user.steamid];
	})
	// ROULETTE AND DEFAULT (LOGIN CHAT SEND ETC) - END

	//DUEL GAME - START
    socket.on('duel_create', function (data) {
        antiSpam.addSpam(socket);

       	query('SELECT COUNT(STATUS) as number FROM `duels` WHERE `status` = 0 AND `creator` LIKE '+pool.escape(user.steamid), function(err, howmanyduel) {
       		if (howmanyduel[0].number >= 5) {
       			socket.emit('message', {
					type: 'error',
					error: 'You have maximum 5 active game once time!'
				});
				return;
       		} else{
	       		query('SELECT * FROM `users` WHERE `steamid` = '+pool.escape(user.steamid), function(err, row) {
	       			if (row[0].balance < parseInt(data.points)){
	       				socket.emit('message', {
							type: 'error',
							error: 'You dont have enough coins!'
						});
	       				return false;	
	       			}
	       			if (parseInt(data.points) < 10){
	       				socket.emit('message', {
							type: 'error',
							error: 'Minimum duel wager 10 coins!'
						});
	       				return false;	
	       			}
	       			if (parseInt(data.points) > maxbet){
	       				socket.emit('message', {
							type: 'error',
							error: 'Maximum deposit...'
						});
	       				return false;	
	       			}
		       		var creator = { steam: user.steamid, name: row[0].name, avatar: row[0].avatar };
		            query('UPDATE `users` SET `balance` = `balance` - '+parseInt(data.points)+', `available` = `available` + '+parseInt(data.points*avaialbleperbet)+' WHERE `steamid` = '+pool.escape(user.steamid), function(err2, row2) { 
		                getBalance(user, socket);
		                var id = generateGameID();
		                var points = Number(data.points);
		                var pickwinner = Math.floor(getRandomInt(0, 9));

		                var secret = generateGameID();
		                var hash = String(id) + ":" + String(pickwinner);
		                hash = encrypt(hash, secret);

		                query('INSERT INTO `duels` (`game_id` ,`creator` ,`opponent` ,`hash` ,`secret` ,`points`) VALUES ( '+pool.escape(id)+',  '+pool.escape(user.steamid)+', "", '+pool.escape(hash)+', '+pool.escape(secret)+', '+pool.escape(parseInt(data.points))+' )');
						socket.emit('message', {
							type: 'alert',
							alert: 'Your duel game is ready!'
						});

		                var duel_game = { "creator": creator, "secret": secret, "points": points, "id": id };
		                io.emit("duel_create", duel_game);

		            });
		        });
       		}
        });
    });

    socket.on('get_duels', function (data) {
        antiSpam.addSpam(socket);
        query('SELECT duels.id, duels.game_id, duels.status, ( SELECT users.avatar FROM   users WHERE users.steamid LIKE duels.creator ) AS creator_avatar,( SELECT users.name FROM   users WHERE users.steamid LIKE duels.creator ) AS creator_name, duels.creator, duels.points FROM `duels` WHERE `status` = 0 ORDER BY `duels`.`points`  DESC', function(err, duels) {
            socket.emit("get_duels", duels);
        });
    });

    socket.on('get_duels_history', function (data) {
        antiSpam.addSpam(socket);
        query('SELECT duels.id, duels.game_id, duels.status, duels.hash, duels.secret, ( SELECT users.avatar FROM users WHERE users.steamid LIKE duels.creator ) AS creator_avatar, ( SELECT users.name FROM users WHERE users.steamid LIKE duels.creator ) AS creator_name, ( SELECT users.avatar FROM users WHERE users.steamid LIKE duels.opponent ) AS opponent_avatar, ( SELECT users.name FROM users WHERE users.steamid LIKE duels.opponent ) AS opponent_name, duels.creator, duels.opponent, duels.points, duels.created FROM `duels` WHERE duels.status =1 ORDER BY `duels`.`id` DESC LIMIT 0 , 5', function(err, duels) {
             for (var i = 0; i < duels.length; i++){
            	var decryptedhash = decrypt(duels[i].hash, duels[i].secret);
            	var result = decryptedhash.split(":");
            	duels[i].result = result;
            	duels[i].points = Math.round(duels[i].points*dueal_tax);;
            }

            socket.emit("get_duels_history", duels);
        });
    });



    socket.on('duel_join', function (data) {
        antiSpam.addSpam(socket);
        if(!user) return;

        query('SELECT * FROM `users` WHERE `steamid` = '+pool.escape(user.steamid), function(err, oppponent) {
        	query('SELECT creator, points, id, game_id FROM `duels` WHERE `status` = 0 AND `game_id` = '+pool.escape(data.id), function(err, row) {
        		if((err) || (!row.length)) {
        			socket.emit('message', {
						type: 'error',
						error: 'Wrong game id!'
					});
        			return false
        		}

        		if(row[0].creator == user.steamid) {
        			socket.emit('message', {
						type: 'error',
						error: 'Its yours game, you cant join!'
					});
        			return false
        		}
    			if (oppponent[0].balance < parseInt(row[0].points)){
       				socket.emit('message', {
						type: 'error',
						error: 'You dont have enough coins!'
					});
       				return false;	
       			}
        		query('UPDATE `users` SET `balance` = `balance` - '+parseInt(row[0].points)+', `available` = `available` + '+parseInt(row[0].points*avaialbleperbet)+' WHERE `steamid` = '+pool.escape(user.steamid), function(err2, row2) {
	        		query('UPDATE `duels` SET `status` = 1, `opponent` = '+pool.escape(user.steamid)+' WHERE `game_id` = '+pool.escape(data.id), function(err2, row3) {
	        			socket.emit('message', {
							type: 'alert',
							alert: 'You joined a duel game!'
						});
						getBalance(user, socket);
	                    io.emit("duel_end", { id: row[0].game_id, players: {creator: row[0].creator, opponent: user.steamid} });
	                    playDuelNow(data.id);

	        		});  
        		});  
            });
        });

    });

    function playDuelNow(game_id){
        antiSpam.addSpam(socket);
        query('SELECT duels.id, duels.game_id, duels.status, duels.hash, duels.secret, ( SELECT users.avatar FROM   users WHERE users.steamid LIKE duels.creator ) AS creator_avatar,( SELECT users.name FROM   users WHERE users.steamid LIKE duels.creator ) AS creator_name, (SELECT users.avatar FROM   users WHERE users.steamid LIKE duels.opponent ) AS opponent_avatar,( SELECT users.name FROM   users WHERE users.steamid LIKE duels.opponent ) AS opponent_name, duels.creator, duels.opponent, duels.points, duels.created FROM `duels` WHERE duels.status = 1 AND duels.game_id = '+pool.escape(game_id), function(err, duel) {
            var decryptedhash = decrypt(duel[0].hash, duel[0].secret);
            var result = decryptedhash.split(":");
            var need_add_point =  Math.round(duel[0].points*dueal_tax);
            var creator = { steam: duel[0].creator, name: duel[0].creator_name, avatar: duel[0].creator_avatar};
            var opponent = { steam: duel[0].opponent, name: duel[0].opponent_name, avatar: duel[0].opponent_avatar};

            if(result[1] < 5){
            	query('UPDATE `users` SET `balance` = `balance` + '+parseInt(need_add_point)+' WHERE `steamid` = '+pool.escape(duel[0].creator), function(err2, row2) {});
            } else {
            	query('UPDATE `users` SET `balance` = `balance` + '+parseInt(need_add_point)+' WHERE `steamid` = '+pool.escape(duel[0].opponent), function(err2, row2) {});
            }
            
            var duel_game = { "creator": creator, "opponent": opponent, "secret": duel[0].secret, "hash": duel[0].hash, "points": Math.round(duel[0].points*dueal_tax), result: result,"game_id": game_id ,"id": duel[0].id ,"created": duel[0].created };

			openModalForuser(users[duel[0].creator], {duel_with: { steam: duel[0].opponent, name: duel[0].opponent_name, avatar: duel[0].opponent_avatar} , amount: Math.round(duel[0].points*dueal_tax)}, duel_game);
			openModalForuser(users[user.steamid], {duel_with: { steam: duel[0].creator, name: duel[0].creator_name, avatar: duel[0].creator_avatar}, amount: Math.round(duel[0].points*dueal_tax)}, duel_game);

			setTimeout(function(){ io.emit("add_history_game", duel_game); }, 13000);
			 
        });
    }
    //DUEL GAME - END
});

function plus(user, socket) {
	query('SELECT * FROM `users` WHERE `steamid` = '+pool.escape(user.steamid), function(err, row) {
		if(err) return;
		if(time() > row[0].plus) {
			query('UPDATE `users` SET `plus` = '+pool.escape(time()+10*60)+', `balance` = `balance` + 1 WHERE `steamid` = '+user.steamid);
			socket.emit('message', {
				type: 'alert',
				alert: 'Confirmed'
			});
			getBalance(user, socket);
		} else {
			socket.emit('message', {
				type: 'alert',
				alert: 'You have '+(row[0].plus-time())+' to accept'
			});			
		}
	});
}

function ch(m, user, socket) {
	if(m.msg) {

		if(last_message[user.steamid]+10 >= time()) {
			console.log('Too fast');
			return;
		} else {
			last_message[user.steamid] = time();
		}	
		var res = null;
		if (res = /^\/send ([0-9]*) ([0-9]*)/.exec(m.msg)) {
			logger.trace('We need to send coins from '+res[2]+' to '+res[1]);
			// console.log(user);
			if ((user.rank == -1) || (user.rank == -4)) {
				socket.emit('message', {
					type: 'error',
					enable: false,
					error: 'You cant send coins (You are partner maybe?)'
				});
				return false;
			}
			query('SELECT COALESCE(SUM(`amount`), 0) AS amount FROM `bets` WHERE `user` = '+pool.escape(user.steamid), function(err, amount) {
				if (parseInt(amount[0].amount) < 100000) {
					socket.emit('message', {
						type: 'error',
						enable: false,
						error: 'You cant send coins, dont have enough bets. ('+amount[0].amount+' / 100000)'
					});
					return false;	
				} else {
					query('SELECT `balance` FROM `users` WHERE `steamid` = '+pool.escape(user.steamid), function(err, row) {
						if((err) || (!row.length)) {
							logger.error('Failed to get the person in the database');
							logger.debug(err);
							socket.emit('message', {
								type: 'error',
								enable: false,
								error: 'Error: User not in DB.'
							});
							return;
						}
						if(row[0].balance < res[2]) {
							socket.emit('message', {
								type: 'error',
								enable: false,
								error: 'Error: Insufficient funds.'
							});
						} else if(res[2] <= 0) {
							socket.emit('message', {
								type: 'error',
								enable: false,
								error: 'Error: Amount must be greater than 0.'
							});
						} else {
							query('SELECT `name` FROM `users` WHERE `steamid` = '+pool.escape(res[1]), function(err2, row2) {
								if((err) || (!row.length)) {
									logger.error('Failed to get the STEAMID');
									logger.debug(err);
									socket.emit('message', {
										type: 'error',
										enable: false,
										error: 'Error: Unknown receiver.'
									});
									return;
								}
								query('UPDATE `users` SET `balance` = `balance` - '+res[2]+' WHERE `steamid` = '+pool.escape(user.steamid));
								query('UPDATE `users` SET `balance` = `balance` + '+res[2]+' WHERE `steamid` = '+pool.escape(res[1]));
								query('INSERT INTO `transfers` SET `from1` = '+pool.escape(user.steamid)+', `to1` = '+pool.escape(res[1])+', `amount` = '+pool.escape(res[2])+', `time` = '+pool.escape(time()));
								socket.emit('message', {
									type: 'alert',
									alert: 'You sent '+res[2]+' coins to '+row2[0].name+'.'
								});
								getBalance(user, socket);
							});
						}
					});
				}
			});
		} else if (res = /^\/mute ([0-9]*) ([0-9]*)/.exec(m.msg)) {
			if(user.rank > 0) {
				var t = time();
				query('UPDATE `users` SET `mute` = '+pool.escape(parseInt(t)+parseInt(res[2]))+' WHERE `steamid` = '+pool.escape(res[1]));
				socket.emit('message', {
					type: 'alert',
					alert: 'You mute '+res[1]+' to '+res[2]
				});
			}
		} else {

			query('SELECT `mute` FROM `users` WHERE `steamid` = '+pool.escape(user.steamid), function(err, row) {
				if(err) return;
				if(row[0].mute > time()) {
					socket.emit('message', {
						type: 'alert',
						alert: 'You are muted '+(row[0].mute-time())
					});
					return;
				}
				query('SELECT COALESCE(SUM(`amount`), 0) AS amount FROM `bets` WHERE `user` = '+pool.escape(user.steamid), function(err, amount) {
					if (parseInt(amount[0].amount) < 10000) {
						socket.emit('message', {
							type: 'error',
							enable: false,
							error: 'You cant use chat yet. ('+amount[0].amount+' / 10000)'
						});
						return false;	
					} else {
						io.sockets.emit('message', {
							type: 'chat',
							msg: safe_tags_replace(m.msg),
							name: escapeHtml(user.name),
							icon: user.avatar,
							user: user.steamid,
							rank: user.rank,
							lang: m.lang,
							hide: m.hide
						});
					}
				});
			});
		}
	}
}

function getBalance(user, socket) {
	query('SELECT `balance` FROM `users` WHERE `steamid` = '+pool.escape(user.steamid), function(err, row) {
		if((err) || (!row.length)) {
			logger.error('Failed to load your balance');
			logger.debug(err);
			socket.emit('message', {
				type: 'error',
				enable: true,
				error: 'Error: You are not DB.'
			});
			return;
		}
		socket.emit('message', {
			type: 'balance',
			balance: row[0].balance
		});
		if(user.steamid) users[user.steamid].balance = parseInt(row[0].balance);
	})
}

function openModalForuser(user, playwith, game) {
	if(user && user.socket) {
		user.socket.emit("open_modal", {
			playwith: playwith,
			game: game
		});
	}
}

function setBet(m, user, socket) {
	if (!users[user.steamid]) return false
	if((usersBr[user.steamid] !== undefined) && (usersBr[user.steamid] == br)) {
		socket.emit('message', {
			type: 'error',
			enable: true,
			error: 'You\'ve already placed '+usersBr[user.steamid]+'/'+br+' bets this roll.'
		});
		return;
	}
	if((m.amount < minbet) || (m.amount > maxbet)) {
		socket.emit('message', {
			type: 'error',
			enable: true,
			error: 'Invalid bet amount.'

		});
		return;
	}
	if(pause) {
		socket.emit('message', {
			type: 'error',
			enable: false,
			error: 'Betting for this round is closed.'
		});
		return;
	}
	    if(m.upper - m.lower > 6){
            logger.warn("User tried to place an invalid bid!! (Might be hacking)");
            return;
        } else {
            if(m.lower != 0 && m.lower != 1 && m.lower != 8){
                logger.warn("User is trying some weird offset!! (Might be hacking)");
                return;
            }
            if(m.lower == 0){
                m.upper = 0;
            } else {
                m.upper = m.lower + 6;
            }
        }
	var start_time = new Date();
	query('SELECT `balance` FROM `users` WHERE `steamid` = '+pool.escape(user.steamid), function(err, row) {
		if((err) || (!row.length)) {
			logger.error('Failed to find DB');
			logger.debug(err);
			socket.emit('message', {
				type: 'error',
				enable: true,
				error: 'You are not DB'
			});
			return;
		}
		if(row[0].balance >= m.amount) {
			query('UPDATE `users` SET `balance` = `balance` - '+parseInt(m.amount)+', `available` = `available` + '+parseInt(m.amount*avaialbleperbet)+' WHERE `steamid` = '+pool.escape(user.steamid), function(err2, row2) {
				if(err2) {
					logger.error('Error in withdraw');
					logger.debug(err);
					socket.emit('message', {
						type: 'error',
						enable: true,
						error: 'You dont have enough points'
					});
					return;
				}
				query('INSERT INTO `bets` SET `user` = '+pool.escape(user.steamid)+', `amount` = '+pool.escape(m.amount)+', `lower` = '+pool.escape(m.lower)+', `upper` = '+pool.escape(m.upper), function(err3, row3) {
					if(err3) {
						logger.error('Error in DB');
						logger.debug(err);
						return;
					}
					var end = new Date();
					if(usersBr[user.steamid] === undefined) {
						usersBr[user.steamid] = 1;
					} else {
						usersBr[user.steamid]++;
					}
					if(usersAmount[user.steamid] === undefined) {
						usersAmount[user.steamid] = {
							'0-0': 0,
							'1-7': 0,
							'8-14': 0
						};
					}
					usersAmount[user.steamid][m.lower+'-'+m.upper] += parseInt(m.amount);
					currentSums[m.lower+'-'+m.upper] += m.amount;
					socket.emit('message', {
						type: 'betconfirm',
						bet: {
							betid: row3.insertId,
							lower: m.lower,
							upper: m.upper,
							amount: usersAmount[user.steamid][m.lower+'-'+m.upper]
						},
						balance: row[0].balance-m.amount,
						mybr: usersBr[user.steamid],
						br: br,
						exec: (end.getTime()-start_time.getTime()).toFixed(3)
					});

					users[user.steamid].balance = row[0].balance-m.amount;
					io.sockets.emit('message', {
						type: 'bet',
						bet: {
							amount: usersAmount[user.steamid][m.lower+'-'+m.upper],
							betid: row3.insertId,
							icon: user.avatar,
							lower: m.lower,
							name: escapeHtml(user.name),
							rollid: currentRollid,
							upper: m.upper,
							user: user.steamid,
							won: null
						},
						sums: {
							0: currentSums['0-0'],
							1: currentSums['1-7'],
							2: currentSums['8-14'],
						}
					});
					currentBets.push({
						amount: m.amount,
						betid: row3.insertId,
						icon: user.avatar,
						lower: m.lower,
						name: escapeHtml(user.name),
						rollid: currentRollid,
						upper: m.upper,
						user: user.steamid,
					});
					logger.debug('Bet #'+row3.insertId+' Ammount: '+m.amount);
					checkTimer();
				})
			});
		} else {
			socket.emit('message', {
				type: 'error',
				enable: true,
				error: 'You dont have any money'
			});
		}
	});
}

function checkTimer() {
	if((currentBets.length > 0) && (timer == -1) && (!pause)) {
		logger.trace('Timer starting');
		timer = accept+wait;
		timerID = setInterval(function() {
			logger.trace('Timer: '+timer+' Site timer: '+(timer-wait));
			if (timer == wait) {
				pause = true;
				logger.trace('Pause included');
				var inprog = getRandomInt(0, (currentBets.length/4).toFixed(0));
				io.sockets.emit('message', {
					type: 'preroll',
					totalbets: currentBets.length-inprog,
					inprog: inprog,
					sums: {
						0: currentSums['0-0'],
						1: currentSums['1-7'],
						2: currentSums['8-14'],
					}
				});
			}
			if (timer == wait-2) {
				logger.trace('Timer: ');
				toWin(); // Выбираем победителя
			}
			if(timer == 0) {
				logger.trace('Reset');
				timer = accept+wait;
				currentBets = [];
				historyRolls.push({id: currentRollid, roll: roll});
				if(historyRolls.length > 10) historyRolls.slice(1);
				usersBr = {}; // сколько пользователи внесли
				usersAmount = {}; // сколько пользователи внесли монеток
				currentSums = {
					'0-0': 0,
					'1-7': 0,
					'8-14': 0
				};
				currentRollid = currentRollid+1;
				pause = false;
			}
			timer--;
		}, 1000);
	}
}

function toWin() {
	var sh = sha256(hash+'-'+currentRollid);
	roll = sh.substr(0, 8);
	roll = parseInt(roll, 16);
	roll = math.abs(roll) % 15;
	logger.trace('Rolled '+roll);
	var r = '';
	var s = q1;
	var wins = {
		'0-0': 0,
		'1-7': 0,
		'8-14': 0
	}

	if(roll == 0) { r = '0-0'; s = q2; wins['0-0'] = currentSums['0-0']*s; }
	if((roll > 0) && (roll < 8)) { r = '1-7'; wins['1-7'] = currentSums['1-7']*s; }
	if((roll > 7) && (roll < 15)) { r = '8-14'; wins['8-14'] = currentSums['8-14']*s; }

	logger.debug(currentBets);
	logger.debug(usersBr);
	logger.debug(usersAmount);
	logger.debug(currentSums);

	for(key in usersAmount) {
		if(usersAmount[key] === undefined) {
			var balance = null;
			var won = 0;
		} else {
			if(users[key] && users[key].balance){
				var balance = parseInt(users[key].balance)+usersAmount[key][r]*s;
				var won = usersAmount[key][r]*s;
			} else {
				var balance = null;
				var won = 0;
			}
		}
	}

	for (var i = 0; i < userssteamids.length; i++){
		users[userssteamids[i]].socket.emit('message', {
			balance: balance,
			count: accept,
			nets: [{
					lower: 0,
					samount: currentSums['0-0'],
					swon: wins['0-0'],
					upper: 0
				}, {
					lower: 1,
					samount: currentSums['1-7'],
					swon: wins['1-7'],
					upper: 7
				}, {
					lower: 8,
					samount: currentSums['8-14'],
					swon: wins['8-14'],
					upper: 14
				}
			],
			roll: roll,
			rollid: currentRollid+1,
			type: "roll",
			wait: wait-2,
			wobble: getRandomArbitary(0, 1),
			won: won
		});
	};

	currentBets.forEach(function(itm) {
		if((roll >= itm.lower) && (roll <= itm.upper)) {
			logger.debug('Rate #'+itm.betid+' sum '+itm.amount+' win '+(itm.amount*s));
			query('UPDATE `users` SET `balance` = `balance` + '+itm.amount*s+' WHERE `steamid` = '+pool.escape(itm.user));
		}
	});

	query('UPDATE `rolls` SET `roll` = '+pool.escape(roll)+', `hash` = '+pool.escape(hash)+', `time` = '+pool.escape(time())+' WHERE `id` = '+pool.escape(currentRollid));
	query('INSERT INTO `rolls` SET `roll` = -1');
	updateHash();
}









/* */
var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};

function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}

function safe_tags_replace(str) {
    return str.replace(/[&<>]/g, replaceTag);
}
Object.size = function(obj) {
	var size = 0,
		key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomArbitary(min, max) {
	return Math.random() * (max - min) + min;
}
function generateGameID() {
    var auth = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 32; i++)
        auth += possible.charAt(Math.floor(getRandom() * possible.length));
    return auth;
}

function getRandom() {
    var rng = seedrandom('Trying to be as unpredictable as possible.', { entropy: true });
    return rng();
}

function query(sql, callback) {
	if (typeof callback === 'undefined') {
		callback = function() {};
	}
	pool.getConnection(function(err, connection) {
		if(err) return callback(err);
		logger.info('DB Connection ID: '+connection.threadId);
		connection.query(sql, function(err, rows) {
			if(err) return callback(err);
			connection.release();
			return callback(null, rows);
		});
	});
}
function load() {
	query('SET NAMES utf8');
	query('SELECT `id` FROM `rolls` ORDER BY `id` DESC LIMIT 1', function(err, row) {
		if((err) || (!row.length)) {
			logger.error('Cant get number from the last game');
			logger.debug(err);
			process.exit(0);
			return;
		}
		currentRollid = row[0].id;
		logger.trace('Roll '+currentRollid);
	});
	loadHistory();
	setTimeout(function() { io.listen(3000); }, 3000);
}
function loadHistory() {
	query('SELECT * FROM `rolls` ORDER BY `id` LIMIT 10', function(err, row) {
		if(err) {
			logger.error('Cant load betting history');
			logger.debug(err);
			process.exit(0);
		}
		logger.trace('Sucesfully updated history');
		row.forEach(function(itm) {
			if(itm.roll != -1) historyRolls.push(itm);
		});
	});
}

function time() {
	return parseInt(new Date().getTime()/1000)
}

function encrypt(text, secret) {
    var cipher = crypto.createCipher("aes-256-ctr", secret);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text, secret) {
    var decipher = crypto.createDecipher("aes-256-ctr", secret);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

var entityMap = {
  "&": "",
  "<": "",
  ">": "",
  '"': '',
  "'": '',
  "/": ''
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}

var cron = require('cron');
var cronJob = cron.job('0 0,4,8,12,16,20 * * *', function(){
    // perform operation e.g. GET request http.get() etc.
    updateMarketPrices();
}); 
cronJob.start();
