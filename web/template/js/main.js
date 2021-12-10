function getPage(page) {
	$.get( "template/"+page+".php", function(site) {
	  $('#siteload').html(site);
	  loadVariables();
	  checking('all');
	  if(page == '/withdraw'){
	  	loadCaptcha();
	  	
	  }

	  if(page == 'duel'){
	  	SOCKET.emit('get_duels');
	  	SOCKET.emit('get_duels_history');
	  	
	  }

	  if(page == 'roulette'){
	  	SOCKET.emit('join_roulette');
	  }
	})
	  .fail(function() {
	    $('#siteload').html('error');
	  })
}


function loadCaptcha(id) {
	if($('#captcha_container')){
	  captchaContainer = grecaptcha.render('captcha_container', {
	    'sitekey' : '6LfQVwsUAAAAAInqFyAacuDgCW6bAToJPAQDt1uH',
	    'callback' : function(response) {
	      none();
	    }
	  });
	}
};

function getHistorydetails(id) {
	$.get( "template/history.php?id="+id, function(site) {
	  $('#siteload').html(site);
	})
	  .fail(function() {
	    $('#siteload').html('error');
	  })
}


function loadVariables() {
	$CASE = $("#case");
	$BANNER = $("#banner");
}

function saveTradelink() {
	$.ajax({
		url:"api/savetradelink",
		type:"POST",
		data:{ t: $("#tradelnikinput").val() },
		success:function(data){
			addNotification("success", "Settings saved!");
			saveSettings();
		},
		error:function(err){
			addNotification("error", "Try again later!");
			// bootbox.alert("AJAX error: "+err.statusText);
		}
	});
}

function checking(name) {
	if(name == 'affiliate'){
		$.ajax({
			url:"api/affiliates",
			type:"POST",
			success:function(data){
				data = JSON.parse(data);
				$('.aff_level').html(data.data.level);
				$('.aff_visitors').html(data.data.visitors);
				$('.aff_depositors').html(data.data.depositors);
				$('.aff_total_bet').html(data.data.total_bet);
				$('.aff_lifetime_earnings').html(data.data.lifetime_earnings);
				$('.aff_available').html(data.data.available);
				$("#thecode").html(data.data.code);			
			},
			error:function(err){
				addNotification("error", "Try again later!");
				// bootbox.alert("AJAX error: "+err.statusText);
			}
		});
	}
}


$(document).ready(function() {
	if(window.location.pathname && window.location.pathname != '' && window.location.pathname != '/'){
		getPage(window.location.pathname);
	}else{
		if(window.location.hash && window.location.hash != '' && window.location.hash != '/'){
			var repaced =  window.location.hash.replace('#','');
			getPage(repaced);
		} else{
			getPage('/roulette');
		}
	}

 	$('.signin_popup').show();
    $(document).on('click', '.signin', function() {
        if ($('#eighteen').prop('checked') == true) {
            window.location.href = '/api/login';
        }
    });

 	$(document).on('click', '.leftmenupoint', function (e) {
 		$('.leftmenupoint').removeClass('active');
 		$(this).addClass('active');
 		$('.juerktoz').hide();
 		$('.'+$(this).data('name')).show();
 		checking($(this).data('name'));
	});

    $(document).on('click', '.link', function (e) {
    	$('.overlay').show();
    });

    $(document).on('click', '.overlay', function (e) {
    	$('.overlay').hide();
    });

	resizeFooter();
	for(var i=0;i<SETTINGS.length;i++){
		var v = getCookie("settings_"+SETTINGS[i]);
		if(v=="true"){
			$("#settings_"+SETTINGS[i]).prop("checked",true);	
		}else if(v=="false"){
			$("#settings_"+SETTINGS[i]).prop("checked",false);	
		}			
	}

	$CASE = $("#case");
	$BANNER = $("#banner");
	$CHATAREA = $("#chatArea");

	connect();

	if ($("#settings_dongers").is(":checked")) {
		$("#dongers").html("$");
	}
	$("#lang").on("change", function() {
		LANG = $(this).val();
		addNotification("alert", "You moved to room: " + $(this).find("option:selected").text());
	});
	$("#scroll").on("change", function() {
		SCROLL = !$(this).is(":checked");
	});
	$(window).resize(function() {
		snapRender();
	});

	$(document).on('click', '#sendMessage', function (e) {
		var msg = $("#chatMessage").val();
		if (msg) {
			var res = null;
			if (res = /^\/send ([0-9]*) ([0-9]*)/.exec(msg)) {
				bootbox.confirm("You are going to send " + res[2] + " to the Steam ID " + res[1] + " - are you sure?", function(result) {
					if (result) {
						send({
							"type": "chat",
							"msg": msg,
							"lang": LANG
						});
						$("#chatMessage").val("");
					}
				});
			} else {
				var hideme = $("#settings_hideme").is(":checked");
				send({
					"type": "chat",
					"msg": msg,
					"lang": LANG,
					"hide": hideme,
				});
				$("#chatMessage").val("");
			}
		}
		return false;
	});

	$(document).on("click", ".ball", function() {
		var rollid = $(this).data("rollid");
	});


	$(document).on("click", ".betButton", function() {
		var lower = $(this).data("lower");
		var upper = $(this).data("upper");
		var amount = str2int($("#betAmount").val());
		if ($("#settings_dongers").is(":checked")) {
			amount = amount * 1000;
		}
		amount = Math.floor(amount);
		var conf = $("#settings_confirm").is(":checked");
		if (conf && amount > 10000) {
			var pressed = false;
			bootbox.confirm("Are you sure you want to bet " + formatNum(amount) + " credits?<br><br><i>You can disable this in settings.</i>", function(result) {
				if (result && !pressed) {
					pressed = true;
					send({
						"type": "bet",
						"amount": amount,
						"lower": lower,
						"upper": upper,
						"round": ROUND
					});
					LAST_BET = amount;
					$(this).prop("disabled", true);
				}
			});
		} else {
			send({
				"type": "bet",
				"amount": amount,
				"lower": lower,
				"upper": upper,
				"round": ROUND
			});
			LAST_BET = amount;
			$(this).prop("disabled", true);
		}
		return false;
	});

	$(document).on("click", "#create_duel_game", function() {
		$(this).hide();
		$('#duel_game_bet_form').show();
	});

	$(document).on("click", "#cancel_duel_game", function() {
		$('#duel_game_bet_form').hide();
		$('#create_duel_game').show();
	});


	$(document).on("click", "#add_duel_game", function() {
		var points = parseInt($("#betwager").val());
		// console.log(points);
        $("#betwager").val("");
        if (isNaN(points)) {
            addNotification("alert", "Points must be a numeric value!");
            return;
        }
        points = Number(points);
        if (points < 1) {
             addNotification("alert", "Minimum wager 1 coin!");
            return;
        }
        if (points > 5000000) {
             addNotification("alert", "Maximum wager 5000000 coins!");
            return;
        }
        if (Number($("#balance").html()) < points) {
            addNotification("alert", "You must be able to afford the bet!");
            return;
        }
        SOCKET.emit('duel_create', { points: points });
        $('#duel_game_bet_form').hide();
        $('#create_duel_game').show();
	});


	$(document).on("click", ".joinDuelGame", function() {
		$('#duel_game_bet_form').hide();
		$('#create_duel_game').show();

        if (Number($("#balance").html()) < $(this).data("point")) {
            addNotification("alert", "You must be able to afford the bet!");
            return;
        }
        SOCKET.emit('duel_join', { id: $(this).data("id") });

	});


	$(document).on("click", "#oneplusbutton", function() {
		// console.log('+1');
		// send({
		// 	"type": "plus"
		// });
	});

	$(document).on("click", ".betshort", function() {
		var target = "";
		// console.log($("#betwager"));
		if(window.location.pathname == 'duel' || window.location.hash == '#duel') {
			target = $("#betwager");
		}
		if(window.location.pathname == '' || window.location.pathname == 'roulette' || window.location.pathname == '/' || window.location.hash == '#roulette') {
			if(window.location.pathname != 'duel' && window.location.hash != '#duel'){
				target = $("#betAmount");
			}
		}
		// console.log(target)
		var bet_amount = str2int(target.val());
		var action = $(this).data("action");
		if (action == "clear") {
			bet_amount = 0;
		} else if (action == "double") {
			bet_amount *= 2;
		} else if (action == "half") {
			bet_amount /= 2;
		} else if (action == "max") {
			var MX = MAX_BET;
			if ($("#settings_dongers").is(":checked")) {
				MX = MAX_BET / 1000;
			}
			bet_amount = Math.min(str2int($("#balance").html()), MX);
		} else if (action == "last") {
			bet_amount = 0;
		} else {
			bet_amount += parseInt(action);
		}
		target.val(bet_amount);
	});
	$(document).on('click', '#getbal', function (e) {
		send({
			"type": "balance"
		});
	});
	$(document).on('click', '.button.close', function (e) {
		$(this).parent().addClass("hidden");
	});
	$("#referrals").DataTable({
		"searching":false,
		"pageLength":100,
		"lengthChange":false,
	});
	$(document).on("contextmenu", ".chat-img", function(e) {
		if (e.ctrlKey) return;
		$("#contextMenu [data-act=1]").hide();
		$("#contextMenu [data-act=2]").hide();
		if (RANK == 100) {
			$("#contextMenu [data-act=1]").show();
			$("#contextMenu [data-act=2]").show();
		} else if (RANK == 1) {
			$("#contextMenu [data-act=1]").show();
		}
		e.preventDefault();
		var steamid = $(this).data("steamid");
		var name = $(this).data("name");
		$("#contextMenu [data-act=0]").html(name);
		var $menu = $("#contextMenu");
		$menu.show().css({
			position: "absolute",
			left: getMenuPosition(e.clientX, 'width', 'scrollLeft'),
			top: getMenuPosition(e.clientY, 'height', 'scrollTop')
		}).off("click").on("click", "a", function(e) {
			var act = $(this).data("act");
			e.preventDefault();
			$menu.hide();
			if (act == 0) {
				var curr = $("#chatMessage").val(steamid);
			} else if (act == 1) {
				var curr = $("#chatMessage").val("/mute " + steamid + " ");
			} else if (act == 2) {
				var curr = $("#chatMessage").val("/kick " + steamid + " ");
			} else if (act == 3) {
				var curr = $("#chatMessage").val("/send " + steamid + " ");
			} else if (act == 4) {
				IGNORE.push(String(steamid));
				addNotification("alert", steamid + " Ignored.");
			}
			$("#chatMessage").focus();
		});
	});
	$(document).on("click", function() {
		$("#contextMenu").hide();
	});
	$(".side-icon").on("click", function(e) {
		e.preventDefault();
		var tab = $(this).data("tab");
		if ($(this).hasClass("active")) {
			$(".side-icon").removeClass("active");
			$(".tab-group").addClass("hidden");
			$("#mainpage").css("margin-left", "50px");
			$("#pullout").addClass("hidden");
		} else {
			$(".side-icon").removeClass("active");
			$(".tab-group").addClass("hidden");
			$(this).addClass("active");
			$("#tab" + tab).removeClass("hidden");
			$("#mainpage").css("margin-left", "450px");
			$("#pullout").removeClass("hidden");
			if (tab == 1) {
				$("#newMsg").html("");
			}
		}
		snapRender();
		return false;
	});
    $(".smiles li img").on("click", function() {
        $("#chatMessage").val($("#chatMessage").val() + $(this).data("smile") + " ")
    });
    $('.clearChat').on("click", function() {
        $('#chatArea').html("<div><b class='text-success'>Chat cleared!</b></div>")
    });
    $(document).on("click", ".deleteMsg", function(e) {
        var t = $(this).data("id");
        send({
            type: "delmsg",
            id: t
        })
    });
    $(".side-icon[data-tab='1']").trigger("click")
});


"use strict";
var CASEW = 1050;
var LAST_BET = 0;
var MAX_BET = 0;
var HIDEG = false;
var USER = "";
var RANK = 0;
var ROUND = 0;
var HOST = "ws.csgoepoch.com:3000";
var SOCKET = null;
var showbets = true;

function todongers(x) {
	if ($("#settings_dongers").is(":checked")) {
		return (x / 1000);
	}
	return x;
}

function accept18() {
	$("#accept18year").modal("show");
}

function redirectTologin() {
	if ($("#accept18year").is(":visible")) {
		$("#accept18year").modal("hide");
		window.location.href = "/login";
	}
}

function todongersb(x) {
	if ($("#settings_dongers").is(":checked")) {
		return (x / 1000).toFixed(3);
	}
	return x;
}
var snapX = 0;
var R = 0.999;
var S = 0.01;
var tf = 0;
var vi = 0;
var animStart = 0;
var isMoving = false;
var LOGR = Math.log(R);
var $CASE = null;
var $BANNER = null;
var $CHATAREA = null;
var SCROLL = true;
var LANG = 1;
var IGNORE = [];
var sounds_rolling = new Audio('/template/sounds/rolling.mp3');
sounds_rolling.volume = 0.5;
var sounds_tone = new Audio('/template/sounds/tone.wav');
sounds_tone.volume = 0.75;

function play_sound(x) {
	var conf = $("#settings_sounds").is(":checked");
	if (conf) {
		if (x == "roll") {
			sounds_rolling.play();
		} else if (x == "finish") {
			sounds_tone.play();
		}
	}
}

function snapRender(x, wobble) {
    CASEW = $("#case").width();
    if (isMoving) return;
    else if (typeof x === 'undefined') view(snapX);
    else {
        var order = [1, 14, 2, 13, 3, 12, 4, 0, 11, 5, 10, 6, 9, 7, 8];
        var index = 0;
        for (var i = 0; i < order.length; i++) {
            if (x == order[i]) {
                index = i;
                break
            }
        }
        var max = 32;
        var min = -32;
        var w = Math.floor(wobble * (max - min + 1) + min);
        var dist = index * 70 + 36 + w;
        dist += 1050 * 5;
        snapX = dist;
        view(snapX)
    }
}

function spin(m) {
    var x = m.roll;
    play_sound("roll");
    var order = [1, 14, 2, 13, 3, 12, 4, 0, 11, 5, 10, 6, 9, 7, 8];
    var index = 0;
    for (var i = 0; i < order.length; i++) {
        if (x == order[i]) {
            index = i;
            break
        }
    }
    var max = 32;
    var min = -32;
    var w = Math.floor(m.wobble * (max - min + 1) + min);
    var dist = index * 70 + 36 + w;
    dist += 1050 * 5;
    animStart = new Date().getTime();
    vi = getVi(dist);
    tf = getTf(vi);
    isMoving = true;
    setTimeout(function() {
        finishRoll(m, tf)
    }, tf);
    render()
}

function d_mod(vi, t) {
	return vi * (Math.pow(R, t) - 1) / LOGR;
}

function getTf(vi) {
	return (Math.log(S) - Math.log(vi)) / LOGR;
}

function getVi(df) {
	return S - df * LOGR;
}

function v(vi, t) {
	return vi * Math.pow(R, t);
}

function render() {
	var t = new Date().getTime() - animStart;
	if (t > tf)
		t = tf;
	var deg = d_mod(vi, t);
	view(deg);
	if (t < tf) {
		requestAnimationFrame(render);
	} else {
		snapX = deg;
		isMoving = false;
	}
}

function view(offset) {
	offset = -((offset + 1050 - CASEW / 2) % 1050);
	$CASE.css("background-position", offset + "px 0px");
}
jQuery.fn.extend({
	countTo: function(x, opts) {
		opts = opts || {};
		var dpf = "";
		var dolls = $("#settings_dongers").is(":checked");
		if (dolls) {
			dpf = "$";
			x = x / 1000;
		}
		var $this = $(this);
		var start = parseFloat($this.html());
		var delta = x - start;
		if (opts.color) {
			if (delta > 0) {
				$this.addClass("text-success");
			} else if (delta < 0) {
				$this.addClass("text-danger");
			}
		}
		var prefix = "";
		if (opts.keep && delta > 0) {
			prefix = "+";
		}
		var durd = delta;
		if (dolls) {
			durd *= 1000;
		}
		var dur = Math.min(400, Math.round(Math.abs(durd) / 500 * 400));
		$({
			count: start
		}).animate({
			count: x
		}, {
			duration: dur,
			step: function(val) {
				var vts = 0;
				if (dolls) {
					vts = val.toFixed(3);
				} else {
					vts = Math.floor(val);
				}
				$this.html("" + prefix + (vts));
			},
			complete: function() {
				if (!opts.keep) {
					$this.removeClass("text-success text-danger");
				}
				if (opts.callback) {
					opts.callback();
				}
			}
		});
	}
});

function cd(ms, cb) {
	$("#counter").animate({
		width: "0%"
	}, {
		"duration": ms * 1000,
		"easing": "linear",
		progress: function(a, p, r) {
			var c = (r / 1000).toFixed(2);
			$BANNER.html("Rolling in <span style='font-size:40px;'>" + parseInt(c) + "</span>");
		},
		complete: cb
	});
}

function send(msg) {
	if (SOCKET) {
		SOCKET.emit('mes', msg);
	}
}

function finishRoll(m, tf) {
	$BANNER.html("Rolled number " + m.roll + "!");
	addHist(m.roll, m.rollid);
	play_sound("finish");
	for (var i = 0; i < m.nets.length; i++) {
		$("#panel" + m.nets[i].lower + "-" + m.nets[i].upper).find(".total").countTo(m.nets[i].swon > 0 ? m.nets[i].swon : -m.nets[i].samount, {
			"color": true,
			"keep": true
		});
	}
	var cats = [
		[0, 0],
		[1, 7],
		[8, 14]
	];
	for (var i = 0; i < cats.length; i++) {
		var $mytotal = $("#panel" + cats[i][0] + "-" + cats[i][1]).find(".mytotal");
		if (m.roll >= cats[i][0] && m.roll <= cats[i][1]) {
			$mytotal.countTo(m.won, {
				"color": true,
				"keep": true
			});
		} else {
			var curr = parseFloat($mytotal.html());
			if ($("#settings_dongers").is(":checked")) {
				curr *= 1000;
			}
			$mytotal.countTo(-curr, {
				"color": true,
				"keep": true
			});
		}
	}
	send({
		"type": "balance"
	});
	setTimeout(function() {
		cd(m.count);
		$(".total,.mytotal").removeClass("text-success text-danger").html(0);
		$(".betlist li").remove();
		snapRender();
		$(".betButton").prop("disabled", false);
		showbets = true;
	}, m.wait * 1000 - tf);
}

function checkplus(balance) {
	if(balance < 20) {
		$('#oneplusbutton').show();
	} else {
		$('#oneplusbutton').hide();
	}
}

function addHist(roll, rollid) {
	var count = $("#past .ball").length;
	if (count >= 10) {
		$("#past .ball").first().remove();
	}
	if (roll == 0) {
		$("#past").append("<div data-rollid='" + rollid + "'class='ball ball-0 bounceInRight animated'>" + roll + "</div>");
	} else if (roll <= 7) {
		$("#past").append("<div data-rollid='" + rollid + "'class='ball ball-1 bounceInRight animated'>" + roll + "</div>");
	} else {
		$("#past").append("<div data-rollid='" + rollid + "'class='ball ball-8 bounceInRight animated'>" + roll + "</div>");
	}
}

function onMessage(msg) {
	var m = msg;
	if (m.type == "preroll") {
			$("#counter").finish();
			// $("#banner").html("Confirming " + m.totalbets + "/" + (m.totalbets + m.inprog) + " total bets...");
            $("#panel0-0-t .total").countTo(m.sums[0]);
            $("#panel1-7-t .total").countTo(m.sums[1]);
            $("#panel8-14-t .total").countTo(m.sums[2]);
		try {
			tinysort("#panel1-7-t .betlist>li", {
				data: "amount",
				order: "desc"
			});
		} catch (e) {}
		try {
			tinysort("#panel8-14-t .betlist>li", {
				data: "amount",
				order: "desc"
			});
		} catch (e) {}
		try {
			tinysort("#panel0-0-t .betlist>li", {
				data: "amount",
				order: "desc"
			});
		} catch (e) {}
	} else if (m.type == "roll") {
		$(".betButton").prop("disabled", true);
		$("#counter").finish();
		$("#banner").html("***ROLLING***");
		ROUND = m.rollid;
		showbets = false;
		spin(m);
	} else if (m.type == "chat") {
		chat("player", m.msg, m.name, m.icon, m.user, m.rank, m.lang, m.hide);
	} else if (m.type == "hello") {
		if(m.count <= 0) {
			var timeremainfornextgame = (10+m.count);
			// setTimeout(function() {
			// 	cd(30);
			// }, (10+m.count)*1000);
			// console.log((10+m.count)*1000)
			$BANNER.html("Next game starting soon...("+timeremainfornextgame+" sec)");
			setTimeout(function() {
				cd(30);
			}, (10+m.count)*1000);
		}else{
			cd(m.count);
		}
		USER = m.user; // steamid
		RANK = m.rank; // rank admin
		$("#balance").countTo(m.balance);
		$("#mobilebalance").countTo(m.balance);
		checkplus(m.balance);
		var last = 0;
		for (var i = 0; i < m.rolls.length; i++) {
			addHist(m.rolls[i].roll, m.rolls[i].rollid);
			last = m.rolls[i].roll;
			ROUND = m.rolls[i].rollid;
		}
		snapRender(last, m.last_wobble);
		MAX_BET = m.maxbet;

		if(window.location.pathname == '/roulette') {
			addNotification("alert", "Minimum bet: " + m.minbet + " coins, " + "Maximum bet: " + formatNum(MAX_BET) + " coins, " + " Bets per round: " + m.br + ", Round time : " + m.accept + " sec, " + " Chat delay: " + m.chat + " sec. ");
		}
    } else if (m.type == "bet") {
            if (showbets) {
                addBet(m.bet);
                $("#panel0-0-t .total").countTo(m.sums[0]);
                $("#panel1-7-t .total").countTo(m.sums[1]);
                $("#panel8-14-t .total").countTo(m.sums[2])
            }
	} else if (m.type == "betconfirm") {
		$("#panel" + m.bet.lower + "-" + m.bet.upper + "-m .mytotal").countTo(m.bet.amount);
		$("#balance").countTo(m.balance, {
			"color": true
		});
		$("#mobilebalance").countTo(m.balance, {
			"color": true
		});
		checkplus(m.balance);
		$(".betButton").prop("disabled", false);
		addNotification("alert", "Bet #" + m.bet.betid + " confirmed " + m.mybr + "/" + m.br + " (" + (m.exec / 1000) + " sec) ");
	} else if (m.type == "error") {
		addNotification("error", m.error);
		if (m.enable) {
			$(".betButton").prop("disabled", false);
		}
	} else if (m.type == "alert") {
		addNotification("alert", m.alert);
		if (m.maxbet) {
			MAX_BET = m.maxbet;
		}
		if (!isNaN(m.balance)) {
			// console.log("setting balance = %s", m.balance);
			$("#balance").countTo(m.balance, {
				"color": true
			});
			$("#mobilebalance").countTo(m.balance, {
				"color": true
			});
			checkplus(m.balance);
		}
	} else if (m.type == "logins") {
		$("#isonline").html(m.count);
	} else if (m.type == "balance") {
		$("#balance").fadeOut(100).html(todongersb(m.balance)).fadeIn(100);
		$("#mobilebalance").fadeOut(100).html(todongersb(m.balance)).fadeIn(100);
		checkplus(m.balance);
	}
}

function addBet(bet) {
	var betid = bet.user + "-" + bet.lower;
	var pid = "#panel" + bet.lower + "-" + bet.upper;
	var $panel = $(pid);
	$panel.find("#" + betid).remove();
	var f = "<li class='list-group-item' id='{0}' data-amount='{1}'>";
	f += "<div style='overflow: hidden;line-height:32px'>";
	f += "<div class='pull-left'><img class='rounded' src='https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars{2}'> <b>{3}</b></div>";
	f += "<div class='amount pull-right'>{4}</div>";
	f += "</div></li>";
	var $li = $(f.format(betid, bet.amount, bet.icon, bet.name, todongersb(bet.amount)));
	$li.hide().prependTo($panel.find(".betlist")).slideDown("fast", function() {
		snapRender();
	});
}

function connect() {
	if(!SOCKET) {
		if(window.location.pathname == '/roulette') {
			addNotification("info", "Generating token...");
		}
		var hash = getCookie('hash');
		if(!hash) {
			addNotification("info", "Please, sign through steam.");
		} else {
			if(window.location.pathname == '/roulette') {
				addNotification("info", "Connecting...");
			}
			SOCKET = io(HOST);
			SOCKET.on('connect', function(msg) {
				if(window.location.pathname == '/roulette') {
					addNotification("italic", "Connected!");
				}
				SOCKET.emit('hash', hash);
			});
			SOCKET.on('connect_error', function(msg) {
				addNotification("italic", "Conection lost...");
			});
			SOCKET.on('message', function(msg) {
				onMessage(msg);
			});
			SOCKET.on('duel_create', function (data) {
			    var html = '<div class="game slideInDown animated duel_'+data.id+'">'+
								'<div class="user">' +
									'<img src="'+data.creator.avatar+'" alt="" >' +
									'<div class="name">'+escapeHtml(data.creator.name)+'</div>' +
								'</div>' +
								'<div class="wager">'+data.points+'</div>' +
								'<button data-point="'+data.points+'" data-id="'+data.id+'" class="joinDuelGame">Join Game</button>' +
							'</div>';
			    $("#current_game_list").prepend(html);
			});
			SOCKET.on('roulette_history', function (m) {
				var last = 0;
				for (var i = 0; i < m.rolls.length; i++) {
					addHist(m.rolls[i].roll, m.rolls[i].rollid);
					last = m.rolls[i].roll;
					ROUND = m.rolls[i].rollid;
				}
			});
			SOCKET.on('add_history_game', function (data) {
				var winner = '';
				if (data.result[1] < 5) { 
					winner = data.creator;
				} else {
					winner = data.opponent;
				}
				var html = '<div class="prevGame slideInDown animated ">'+
					'<div class="versus">'+
						'<div class="game">'+
							'<div class="user">'+
								'<img alt="" src="'+data.creator.avatar+'">'+
								'<div class="name">'+escapeHtml(data.creator.name)+'</div>'+
							'</div>'+
							'<span>vs.</span>'+
							'<div class="user">'+
								'<img alt="" src="'+data.opponent.avatar+'">'+
								'<div class="name">'+escapeHtml(data.opponent.name)+'</div>'+
							'</div>'+
						'</div>'+
						'<div class="winner">'+
							'<span>'+
								'<img alt="" src="'+winner.avatar+'">'+
								'<span>'+
									'<b>'+escapeHtml(winner.name)+'</b>'+
									'<span>Won '+data.points+' coins</span>'+
								'</span>'+
							'</span>'+
						'</div>'+
					'</div>'+
				'</div>';
			    $("#prevgames").prepend(html);
			    // console.log($("#prevgames").children())
			    if($("#prevgames").children().length > 5){
			    	$("#prevgames").children().slice(5, $("#prevgames").children().length).remove();
			    }

			});
			SOCKET.on('get_duels', function (data) {
				data.forEach(function(element) {
				    var html = '<div class="game slideInDown animated duel_'+element.game_id+'">'+
									'<div class="user">' +
										'<img src="'+element.creator_avatar+'" alt="" >' +
										'<div class="name">'+escapeHtml(element.creator_name)+'</div>' +
									'</div>' +
									'<div class="wager">'+element.points+'</div>' +
									'<button data-point="'+element.points+'" data-id="'+element.game_id+'" class="joinDuelGame">Join Game</button>' +
								'</div>';
				    $("#current_game_list").append(html);
				});
			});
			SOCKET.on('get_duels_history', function (data) {
				data.forEach(function(element) {
					var winner = '';
					if (element.result[1] < 5) { 
						winner = {name: element.creator_name, avatar: element.creator_avatar};
					} else {
						winner = {name: element.opponent_name, avatar: element.opponent_avatar};
					}
				    var html = '<div class="prevGame">'+
									'<div class="versus">'+
										'<div class="game">'+
											'<div class="user">'+
												'<img alt="" src="'+element.creator_avatar+'">'+
												'<div class="name">'+escapeHtml(element.creator_name)+'</div>'+
											'</div>'+
											'<span>vs.</span>'+
											'<div class="user">'+
												'<img alt="" src="'+element.opponent_avatar+'">'+
												'<div class="name">'+escapeHtml(element.opponent_name)+'</div>'+
											'</div>'+
										'</div>'+
										'<div class="winner">'+
											'<span>'+
												'<img alt="" src="'+winner.avatar+'">'+
												'<span>'+
													'<b>'+escapeHtml(winner.name)+'</b></i>'+
													'<span>won '+element.points+' coins</span>'+
												'</span>'+
											'</span>'+
										'</div>'+
									'</div>'+
								'</div>';
				    $("#prevgames").append(html);
				});
			});
			SOCKET.on('duel_end', function (data) {
				$(".duel_"+data.id).fadeOut( "slow" );
			});
			SOCKET.on('open_modal', function (data) {
				$("#active_duel_games .endedgame").each(function () { 
					$(this).remove();
				});

				var html = ' <div class="modal-content '+data.game.id+'nibiflip" uib-modal-transclude=""><div class="close" data-dismiss="modal">×</div>'+
								'<h2 class="header">Duel with <span class="duel_partner_'+data.game.id+'">'+escapeHtml(data.playwith.duel_with.name)+'</span></h2>'+
								'<div class="coinflipping">'+
								'<div class="col-cont">'+
								'<div class="col">'+
								'<div class="totalWagered">'+data.game.points+'</div>'+
								'</div>'+
								'<div class="col">'+
								'<div class="coin-flip-cont">'+
								'<div class="coin '+data.game.id+'coin">'+
								'<div class="front '+data.game.id+'_player_1"></div>'+
								'<div class="back '+data.game.id+'_player_2"></div>'+
								'</div>'+
								'</div>'+
								'</div>'+
								'</div>'+
								'</div>'+
							'</div>';

				$("#active_duel_games").prepend(html);
				$("#duelgamemodal").modal({backdrop: 'static', keyboard: false});
				$("#duelgamemodal").modal("show");
				$('.'+data.game.id+'_player_1').css('background-image', 'url(' + data.game.creator.avatar + ')');
				$('.'+data.game.id+'_player_2').css('background-image', 'url(' + data.game.opponent.avatar + ')');

				setTimeout(function(){ playDuel(data.game.id, data.game.result[1]); }, 5000);
			});
		}
	} else {
		console.log("Error: connection already exists.");
	}
}

function emotes(str) {
	var a = ["deIlluminati", "KappaRoss", "KappaPride", "BibleThump", "Kappa", "Keepo", "Kreygasm", "PJSalt", "PogChamp", "SMOrc", "CO", "CA", "Tb", "offFire", "Fire", "rip", "lovegreen", "heart", "FailFish"];
	for (var i = 0; i < a.length; i++) {
		str = str.replace(new RegExp(a[i] + "( |$)", "g"), "<img src='/template/img/twitch/" + a[i] + ".png'> ");
	}
	return str;
}

function playDuel(id, result) {
	var currentgame = $('.'+id+'coin');
	currentgame.removeClass('animation1980');
	currentgame.removeClass('animation2160');

	if(result < 5) {
		currentgame.addClass('animation2160'); // CREATOR WINS
	} else{
		currentgame.addClass('animation1980'); // OPONENET WINS
	}
	setTimeout(function(){
		$('.'+id+'nibiflip').addClass('endedgame');
		send({
			"type": "balance"
		});
	}, 7000);
}

$('#chatMessage').bind('keyup', function(e) {
    if ( e.keyCode === 13 ) { // 13 is enter key
    	$( "#sendMessage" ).trigger( "click" );
    }
});

function chat(x, msg, name, icon, steamid, rank, lang, hide) {
	if (IGNORE.indexOf(String(steamid)) > -1) {
		console.log("ignored:" + msg);
		return;
	}
	if (lang == LANG || x == "italic" || x == "error" || x == "alert") {
		var ele = document.getElementById("chatArea");
		msg = msg.replace(/(<|>)/g, '');
		msg = emotes(msg);
		var toChat = "";
        if (x == "italic") toChat = "<div class='chat-msg'><img class='chat-img rounded' data-steamid='0' data-name='System' src='https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg'><div><span>System</span></div> <div>" + msg + "</div></div>";
        else if (x == "error") toChat = "<div class='chat-msg'><img class='chat-img rounded' data-steamid='0' data-name='System' src='https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg'><div><span>Error</span></div> <div class='text-danger'>" + msg + "</div></div>";
        else if (x == "alert") toChat = "<div class='chat-msg'><img class='chat-img rounded' data-steamid='0' data-name='System' src='https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg'><div><span>Alert</span></div> <div class='text-success'>" + msg + "</div></div>";
        else if (x == "player") {
			var aclass = "chat-link";
			if (rank == 100) {
				aclass = "chat-link-mod";
				name = "[Owner] " + name;
			} else if (rank == 1) {
				aclass = "chat-link-pmod";
				name = "[Mod] " + name;
			} else if (rank == -1) {
				aclass = "chat-link-streamer";
				name = "[Streamer] " + name;
			} else if (rank == -2) {
				aclass = "chat-link-vet";
				name = "[Veteran] " + name;
			} else if (rank == -3) {
				aclass = "chat-link-pro";
				name = "[Pro] " + name;
			} else if (rank == -4) {
				aclass = "chat-link-yt";
				name = "[Youtuber] " + name;
			} else if (rank == -5) {
				aclass = "chat-link-mod";
				name = "[Coder] " + name;
			}
			if(msg.length > 150){
				var msg = msg.slice(0,140)+'...';	
			}
			var link = "http://steamcommunity.com/profiles/" + steamid;
			// toChat = "<div class='chat-msg animated bounceInLeft'><img class='chat-img rounded' data-steamid='" + steamid + "' data-name='" + name + "' src='https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars" + icon + "'>";
			// if (hide) {
			// 	toChat += "<div><span class='" + aclass + "'>" + name + "</span></div><div class='concretmsg'>" + msg + "</div>";
			// } else {
			// 	toChat += "<div><a href='" + link + "' target='_blank'><span class='" + aclass + "'>" + name + "</span></a></div><div>" + msg + "</div>";
			// }
			toChat += '<div class="message">';
			toChat += '<div class="head">';
			toChat += '<img class="img-responsive chat-img" alt="" data-steamid="' + steamid + '" data-name="' + name + '" src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars' + icon + '">';
			toChat += '<a href="'+link+'" target="_blank">';
			toChat += '<span class="username ' + aclass + '">' + name + '</span>';
			toChat += '</a>';
			toChat += '</div>';
			toChat += '<div class="text" >'+ msg +'</div>';
			toChat += '</div>';

		}
		$CHATAREA.append(toChat);
		if (SCROLL) {
			var curr = $CHATAREA.children().length;
			if (curr > 75) {
				var rem = curr - 75;
				$CHATAREA.children().slice(0, rem).remove();
			}
			$CHATAREA.scrollTop($CHATAREA[0].scrollHeight);
		}
		if (SCROLL && !$(".side-icon[data-tab='1']").hasClass("active")) {
			var curr = parseInt($("#newMsg").html()) || 0;
			$("#newMsg").html(curr + 1);
		}
		$('.concretmsg').emoticonize();
	}
}

function saveSettings(){
	for(var i=0;i<SETTINGS.length;i++){
		setCookie("settings_"+SETTINGS[i],$("#settings_"+SETTINGS[i]).is(":checked"));
	}
	$("#settingsModal").modal("hide");
	if($("#settings_dongers").is(":checked")){
		$("#balance").html("please reload");
		$("#mobilebalance").html("please reload");
	}else{
		$("#balance").html("please reload");
		$("#mobilebalance").html("please reload");
	}
}
function redeem(){
	var code = $("#promocode").val();
	$.ajax({
		url:"api/redeem?code="+code,
		success:function(data){		
			try{
				data = JSON.parse(data);
				// console.log(data);
				if(data.success){
					bootbox.alert("Success! You've received "+data.credits+" credits.");					
				}else{
					bootbox.alert(data.error);
				}
			}catch(err){
				bootbox.alert("Javascript error: "+err);
			}
		},
		error:function(err){
			bootbox.alert("AJAX error: "+err);
		}
	});
}
	var SETTINGS = ["confirm","sounds","dongers","hideme"];
	function inlineAlert(x,y){
		$("#inlineAlert").removeClass("alert-success alert-danger alert-warning hidden");
		if(x=="success"){
			$("#inlineAlert").addClass("alert-success").html("<i class='fa fa-check'></i><b> "+y+"</b>");
		}else if(x=="error"){
			$("#inlineAlert").addClass("alert-danger").html("<i class='fa fa-exclamation-triangle'></i> "+y);
		}else if(x=="cross"){
			$("#inlineAlert").addClass("alert-danger").html("<i class='fa fa-times'></i> "+y);
		}else{
			$("#inlineAlert").addClass("alert-warning").html("<b>"+y+" <i class='fa fa-spinner fa-spin'></i></b>");
		}
	}
	function resizeFooter(){
		var f = $('.footer').outerHeight(true);
		var w = $(window).outerHeight(true);
		// $('body').css('margin-bottom',f);
	}
	$(window).resize(function(){
		resizeFooter();
	});
	if (!String.prototype.format) {
	  String.prototype.format = function() {
	    var args = arguments;
	    return this.replace(/{(\d+)}/g, function(match, number) { 
	      return typeof args[number] != 'undefined'
	        ? args[number]
	        : match
	      ;
	    });
	  };
	}
	function setCookie(key,value){
		var exp = new Date();
		exp.setTime(exp.getTime()+(365*24*60*60*1000));
		document.cookie = key+"="+value+"; expires="+exp.toUTCString();
	}
	function getCookie(key){
		var patt = new RegExp(key+"=([^;]*)");
		var matches = patt.exec(document.cookie);
		if(matches){
			return matches[1];
		}
		return "";
	}
	function formatNum(x){
		if(Math.abs(x)>=10000){
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		return x;
	}

$("#collect").on("click",function(){
	$(this).attr("disabled",true);
	$.ajax({
	url:"api/collect",
	type:"POST",
	success:function(data){
		try{
			data = JSON.parse(data);
			if(data.success){
				$("#availlll").html(0);
				bootbox.alert(data.collected+" have been credited to your account!");
				//inlineAlert("success","You collected "+data.collected+" credits!");						
			}else{
				bootbox.alert(data.error);
				//inlineAlert("error",data.error);
			}
		}catch(err){
			bootbox.alert("Javascript error: "+err);
		}
	},
	error:function(err){
		bootbox.alert("AJAX error: "+err.statusText);
	},
	complete:function(){
		$(this).attr("disabled",false);
	}
	});
});

	$("#changecode").on("click",function(e){
		// console.log('changecode');
		e.preventDefault();
		bootbox.prompt("Change promocode:",function(result){                
			if(result){
				$.ajax({
					url:"api/changecode",
					data:{"code":result},
					type:"POST",
					success:function(data){
						try{
							data = JSON.parse(data);
							if(data.success){
								bootbox.alert("Promocode changed to: "+data.code);
								$("#thecode").html(data.code);						
							}else{
								bootbox.alert(data.error);
							}
						}catch(err){
							bootbox.alert("Javascript error: "+err);
						}
					},
					error:function(err){
						bootbox.alert("AJAX error: "+err.statusText);
					}
				});                                           
			}
		});
		return false;
	});
$(".support_button").on("click",function(){
    var tid = $(this).data("x");
    var title = $("#ticketTitle").val();
    var cat = $("#ticketCat").val();
    var body = $("#text"+tid).val();
    var close = $("#check"+tid).is(":checked")?1:0;
    var flag = $("#flag"+tid).is(":checked")?1:0;
    var lmao = $("#lmao"+tid).is(":checked")?1:0;
    var conf = "Are you sure you wish to submit this reply?";
    if(tid==0){
        if(title.length==0){
            bootbox.alert("Title cannot be left blank.");
            return;
        }else if(cat==0){
            bootbox.alert("Department cannot be left blank.");
            return;
        }else if(body.length==0){
            bootbox.alert("Description cannot be left blank.");
            return;
        }
        conf = "Are you sure you wish to submit this ticket?<br><br><b style='color:red'>WARNING: Misuse of this system will result in a 1 week ban.</b>";
    }                        
    bootbox.confirm(conf,function(result){
        if(result){
            $.ajax({
                url:"api/support_new",
                type:"POST",
                data:{"tid":tid,"title":title,"reply":body,"close":close,"cat":cat,"flag":flag,"lmao":lmao},
                success:function(data){
                    try{
                        data = JSON.parse(data);
                        if(data.success){
                            bootbox.alert(data.msg,function(){
                                if(reload){
                                   location.reload(); 
                               }                                                
                            });                     
                        }else{
                            bootbox.alert(data.error);
                        }
                    }catch(err){
                        bootbox.alert("Javascript error: "+err);
                    }
                },
                error:function(err){
                    bootbox.alert("AJAX error: "+err.statusText);
                }
            });
        }
    });                                        
    return false;
});


function getAbscentPhrases(msg) {
    var phrases = ["hello", 1, "simba"];
    for (var i = 0; i < phrases.length; i++) {
        if (msg.toLowerCase().indexOf(phrases[i]) + 1) {
            return 1
        }
    }
    return 0
}
function addNotification(type, text) {
   var n = noty({
            text        : text,
            type        : type,
            dismissQueue: true,
            layout      : 'bottomRight',
             closeWith   : ['click', 'button', 'backdrop'],
            theme       : 'relax',
            maxVisible  : 10,
            animation   : {
                open  : 'animated fadeInUp',
                close : 'animated fadeOutDown',
                easing: 'swing',
                speed : 500
            }
        });
        
   setTimeout(function(){ $.noty.close(n.options.id) }, 7000);
}

function changeLang(id) {
    LANG = $(this).val();
    $(".lang-select").html($(".language > li").eq(id - 1).find("a").html());
    addNotification("alert", "Changed to the room: " + $(".language > li").eq(id - 1).find("a").html())
}

function getMenuPosition(mouse, direction, scrollDir) {
	var win = $(window)[direction](),
		scroll = $(window)[scrollDir](),
		menu = $("#contextMenu")[direction](),
		position = mouse + scroll;
	if (mouse + menu > win && menu < mouse)
		position -= menu;
	return position;
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


function str2int(s) {
	s = s.replace(/,/g, "");
	s = s.toLowerCase();
	var i = parseFloat(s);
	if (isNaN(i)) {
		return 0;
	} else if (s.charAt(s.length - 1) == "k") {
		i *= 1000;
	} else if (s.charAt(s.length - 1) == "m") {
		i *= 1000000;
	} else if (s.charAt(s.length - 1) == "b") {
		i *= 1000000000;
	}
	return i;
}
