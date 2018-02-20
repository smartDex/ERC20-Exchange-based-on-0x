var web3 = new Web3();
var global_keystore;

//set Web3 provider
function setWeb3Provider(keystore) {
    var web3Provider = new HookedWeb3Provider({
        host: "https://kovan.infura.io/",
        // host: "http://localhost:8545/",
        transaction_signer: keystore
    });
    web3.setProvider(web3Provider);
}

//generate new address
function newAddresses(password, randomSeed, flag) {
    if (password == '') {
        return false;
    }

    var numAddr = 1;

    global_keystore.keyFromPassword(password, function(err, pwDerivedKey) {

        global_keystore.generateNewAddress(pwDerivedKey, numAddr);

        var addresses = global_keystore.getAddresses();
        var address = addresses[0];
        $("#wallet_address").val(address);
        $("#wallet_seed").val(randomSeed);
        // $("#new-private-key").text(randomSeed);
        // getBalances();
        // if(flag == 'import')
        //     importAccount(address, randomSeed);
    });
}

//import existing address from seed
function importAccountFromSeed() {

    var password = 'Password';
    lightwallet.keystore.createVault({
        password: password,
        seedPhrase: document.getElementById('private-key').value,
        //random salt 
        hdPathString: "m/0'/0'/0'"
    }, function(err, ks) {

        global_keystore = ks;

        newAddresses(password, document.getElementById('private-key').value, 'import');
        setWeb3Provider(global_keystore);
    });
}

//create new wallet
function newWallet() {
    var extraEntropy = '';
    var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
    var password = 'Password';
    lightwallet.keystore.createVault({
        password: password,
        seedPhrase: randomSeed,
        //random salt 
        hdPathString: "m/0'/0'/0'"
    }, function(err, ks) {

        global_keystore = ks;

        newAddresses(password, randomSeed);
        setWeb3Provider(global_keystore);
        // return addr;
        // getBalances();
    });

}

//get account information on ManageAccount page
function getAccountInfo() {

    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('reduxPersistAccount');
    var retrievedData = JSON.parse(retrievedObject);

    if (retrievedData) {
        var html_data = '';
        for (var i = retrievedData.length - 1; i >= 1; i--) {
            var balance = getBalances(retrievedData[i]['account'][0]['addr']);
            html_data += '<div class="account-row">';
            html_data += '<div class="wallet-balance clearfix">';
            html_data += '<div class="cols cols-1" style="width:100%">';
            html_data += '<b>Wallet Balance</b> <a href="#"><span class="glyphicon">&#xe086;</span></a>';
            html_data += '<div class="btn btn-success btn-sm balance balance-success"><span class="badge badge-light">ETH</span> <span class="number">' + balance + '</span></div>';
            html_data += '</div>';
            html_data += '<div class="cols cols-2">';
            // html_data += '<b>Nonce</b> <a href="#"><span class="glyphicon">&#xe086;</span></a>';
            // html_data += '<div class="btn btn-success btn-sm balance balance-success"><span class="badge badge-light">Nonce</span> <span class="number">'+'nonce'+'</span></div>';
            html_data += '</div>';
            html_data += '</div>';
            html_data += '<b>Address</b> (<a href="#">What is it? <span class="glyphicon">&#xe086;</span></a>)';
            html_data += '<div class="address" id="addrInfor">' + retrievedData[i]['account'][0]['addr'] + '</div>';
            html_data += '<b>Private Key</b> (<a href="#">What is it? <span class="glyphicon">&#xe086;</span></a>)';
            html_data += '<div class="private-key">';
            html_data += '<a style="color:#007bff;cursor:pointer;" onclick="javascript:toogle_me(this)">Show Private Key&nbsp;&nbsp;<span class="glyphicon">&#xe105;</span></a>';
            html_data += '<div class="hidden" data-visibility="0">' + retrievedData[i]['account'][0]['privateKey'] + '</div>';
            html_data += '</div>';
            html_data += '<div class="button-container">';
            html_data += '<button class="btn btn-primary" onclick="swithcAccount(' + "'" + retrievedData[i]['account'][0]['addr'] + "'" + ')">';
            html_data += 'Switch to account';
            html_data += '</button>';
            html_data += '</div>';
            html_data += '</div>';
        }
        $("#account_info").html(html_data);
    }
}

// eye icon toogle on Private-key(Account Manage Page)
function toogle_me(data) {
    if ($(data).next().attr('data-visibility') == '0') {
        $(data).next().attr('data-visibility', '1');
        $(data).next().removeClass('hidden');
        $(data).html('Hide Private Key&nbsp;&nbsp;<span class="glyphicon">&#xe106;</span>');
    } else {
        $(data).next().attr('data-visibility', '0');
        $(data).next().addClass('hidden');
        $(data).html('Show Private Key&nbsp;&nbsp;<span class="glyphicon">&#xe105;</span>');
    }
}

//import account function
$("#importAccount").click(function() {
    importAccountFromSeed();
});

//when click `i saved it` button, the address data will save to local storage
$(".saveaddr").click(function() {

    var addr = $("#new_address").text();
    var privateKey = $("#new-private-key").text();

    //return false before generate
    if (addr == 'Generating...') {
        return false;
    }

    // create new local storage if the storage is emptied.
    if (localStorage.getItem('reduxPersistAccount')) {
        //
    } else {
        var a = [];
        a.push(JSON.parse(localStorage.getItem('reduxPersistAccount')));
        localStorage.setItem('reduxPersistAccount', JSON.stringify(a));
    }


    var tmp = [];
    // Parse the serialized data back into an aray of objects
    tmp = JSON.parse(localStorage.getItem('reduxPersistAccount'));

    //avoid save if address is same
    for (var i = 1; i < tmp.length; i++) {
        if (tmp[i]['account'][0]['addr'] == addr)
            return false;
    }

    //JSON data to input
    var reduxPersistAccount = {
        "account": [{
                "addr": addr,
                "privateKey": privateKey
            }]
            //  "selectedAddr":addr
    };
    // Push the new data (whether it be an object or anything else) onto the array
    tmp.push(reduxPersistAccount);
    // Re-serialize the array back into a string and store it in localStorage
    localStorage.setItem('reduxPersistAccount', JSON.stringify(tmp));

});

//import account function
function importAccount(address, randomSeed) {
    // create new local storage if the storage is emptied.
    if (localStorage.getItem('reduxPersistAccount')) {
        //
    } else {
        var a = [];
        a.push(JSON.parse(localStorage.getItem('reduxPersistAccount')));
        localStorage.setItem('reduxPersistAccount', JSON.stringify(a));
    }

    var tmp = [];
    // Parse the serialized data back into an aray of objects
    tmp = JSON.parse(localStorage.getItem('reduxPersistAccount'));

    //avoid save if address is same
    for (var i = 1; i < tmp.length; i++) {
        if (tmp[i]['account'][0]['addr'] == address)
            return false;
    }

    //JSON data to input
    var reduxPersistAccount = {
        "account": [{
                "addr": address,
                "privateKey": randomSeed
            }]
            //  "selectedAddr":addr
    };
    // Push the new data (whether it be an object or anything else) onto the array
    tmp.push(reduxPersistAccount);
    // Re-serialize the array back into a string and store it in localStorage
    localStorage.setItem('reduxPersistAccount', JSON.stringify(tmp));
    $(".alret-area").fadeIn().fadeOut(5000);
}

//switch account
function swithcAccount(address) {
    //display acctive account text
    var sub = address.slice(0, 8);
    $(".current_address").text(sub + '...');
    localStorage.setItem('selectedAddress', address);

    //display balance
    $(".current_address").text(address.slice(0, 8) + '...');

    web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io"));
    var cBalance = web3.fromWei(web3.eth.getBalance(address).toString(10), "ether");
    if (cBalance.length > 17) {
        cBalance = cBalance.slice(0, 14) + '...';
    }
    $(".cBalance").text(cBalance);
}

//set current address text
var cAddres = localStorage.getItem('selectedAddress');
if (cAddres) {
    $(".current_address").text(cAddres.slice(0, 8) + '...');

    web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io"));
    var cBalance = web3.fromWei(web3.eth.getBalance(cAddres).toString(10), "ether");
    if (cBalance.length > 17) {
        cBalance = cBalance.slice(0, 14) + '...';
    }
    $(".cBalance").text(cBalance);
}
//get balance on address
function getBalances(addr) {
    web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io"));
    var cBalance = web3.fromWei(web3.eth.getBalance(addr).toString(10), "ether");
    return cBalance;
}

var price_usd = 0;
var proxy = 'https://cors-anywhere.herokuapp.com/';
// for get usd value
$.ajax({
    url: proxy + 'https://api.coinmarketcap.com/v1/ticker/ethereum/',
    type: 'GET',
    success: function(res) {
        price_usd = res[0].price_usd;
    },
    error: function(e) {
        console.log(e);
    }
});

//get token list
var h_data = '';
$.ajax({
    url: proxy + 'https://api.cobinhood.com/v1/market/stats',
    type: 'GET',
    success: function(data) {
        var r = data.result;
        for (var key in r) {
            var eth = r[key].id.split("-");
            if (eth[1] != 'ETH')
                continue;
            // h_data += '<div id="eth_id" style="float:left; margin-right:10px;" onclick="getOrdoerList('+"'"+r[key].id+"'"+')">'+r[key].id+'</div>';
            // h_data += '<div id="last_val" style="float:left;margin-right:10px;">'+r[key].last_price+'</div>';
            // h_data += '<div id="usd_val"> ≈ $'+(price_usd*r[key].last_price).toFixed(2)+'</div><span style="clear:both"></span>';
            h_data += '<li class="option" data-value="residential" onclick="getOrdoerList(' + "'" + r[key].id + "'" + ')">' + r[key].id + '</li>';
        }
        $("#img_category_options").html(h_data);
    },
    error: function(err) {
        console.log(err);
    },
    complete: function() {
        $("#img_category_options li:nth-child(1)").click();
        $("#img_category_options").click();
        $(".charts").LoadingOverlay("show");
        $(".orderask").LoadingOverlay("show");
        $(".orderbid").LoadingOverlay("show");
        $(".orderhistory").LoadingOverlay('show');
    }
});

//check type of number
function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}

//get order list
function getOrdoerList(ethid) {
    var url = 'https://api.cobinhood.com/v1/market/orderbooks/' + ethid;
    $.ajax({
        url: proxy + url,
        type: 'GET',
        success: function(res) {
            var r = res.result;
            var h_askdata = '';
            var h_biddata = '';
            for (var key in r) {
                //asks
                if (r[key]['asks']) {
                    for (var i = 0; i < r[key]['asks'].length; i++) {
                        var amount = Number(r[key]['asks'][i][2]);
                        var val = Number(r[key]['asks'][i][0] * r[key]['asks'][i][1]);
                        h_askdata += '<div class="col-4 entry colmn-1">' + r[key]['asks'][i][0] + '</div>';
                        if (isInt(amount))
                            h_askdata += '<div class="col-4 entry colmn-2">' + amount + '</div>';
                        else if (isFloat(amount))
                            h_askdata += '<div class="col-4 entry colmn-2">' + amount.toFixed(5) + '</div>';
                        if (isInt(val))
                            h_askdata += '<div class="col-4 entry colmn-3">' + val + '</div>';
                        else if (isFloat(val))
                            h_askdata += '<div class="col-4 entry colmn-3">' + val.toFixed(5) + '</div>';
                    }
                }
                //bids
                if (r[key]['bids']) {
                    for (var j = 0; j < r[key]['bids'].length; j++) {
                        var amount1 = Number(r[key]['bids'][j][2]);
                        var val1 = Number(r[key]['bids'][j][0] * r[key]['bids'][j][1]);
                        h_biddata += '<div class="col-4 entry colmn-1">' + r[key]['bids'][j][0] + '</div>';
                        if (isInt(amount1))
                            h_biddata += '<div class="col-4 entry colmn-2">' + amount1 + '</div>';
                        else if (isFloat(amount1))
                            h_biddata += '<div class="col-4 entry colmn-2">' + amount1.toFixed(5) + '</div>';
                        if (isInt(val1))
                            h_biddata += '<div class="col-4 entry colmn-3">' + val1 + '</div>';
                        else if (isFloat(val1))
                            h_biddata += '<div class="col-4 entry colmn-3">' + val1.toFixed(5) + '</div>';
                    }
                }
            }
            $(".orderask").html(h_askdata);
            $(".orderask").css('font-size', '13px');
            $(".orderbid").html(h_biddata);
            $(".orderbid").css('font-size', '13px');

            $(".orderask").LoadingOverlay("hide", true);
            $('.orderbid').LoadingOverlay('hide', true);
            $('.orderhistory').LoadingOverlay('hide', true);

        },
        error: function(e) {
            console.log(e);
        }
    });

    getChartData(ethid);
    getTickerData(ethid);
}

// get ticker data function
function getTickerData(token_pair) {
    var url = 'https://api.cobinhood.com/v1/market/tickers/' + token_pair;
    $.ajax({
        url: proxy + url,
        type: 'GET',
        success: function(res) {
            var r = res.result;
            for (var key in r) {
                var l_price = '<h3 style="color:yellow; font-size:20px;">' + Number(r[key].last_trade_price).toFixed(5) + '</h3><h5 style="color:white;">Last Trade Price</h5>';
                var high = '<h3 style="color:yellow; font-size:20px;">' + Number(r[key]['24h_high']).toFixed(5) + '</h3><h5 style="color:white;">24h High</h5>';
                var low = '<h3 style="color:yellow; font-size:20px;">' + Number(r[key]['24h_low']).toFixed(5) + '</h3><h5 style="color:white;">24h Low</h5>';
                var total = '<h3 style="color:yellow; font-size:20px;">' + Number(r[key]['24h_volume']).toFixed(5) + '</h3><h5 style="color:white;">24h Volume</h5>';
                $("#last_price").html(l_price);
                $("#high_vol").html(high);
                $("#low_vol").html(low);
                $("#total_vol").html(total);
            }

        },
        error: function(e) {
            console.log(e);
        }
    });
}


$('#login_form').submit(function() {
    var log_email = $("#log_email").val();
    var log_password = $("#log_password").val();

    $(this).ajaxSubmit({
        error: function(xhr) {
            status('Error: ' + xhr.status);
        },
        success: function(response) {
            if (response.responseDesc == 'Sucess') {
                logIn(log_email, log_password);
            } else {
                alert(response.responseDesc);
            }
        }
    });
    //Very important line, it disable the page refresh.
    return false;
});

//email form validation
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
//check captcha
function isCaptcha(flag) {
    if (flag == 'signup') {
        var username = $("#signup_username").val();
        var useremail = $("#signup_email").val();
        var is_email = isEmail(useremail);
        var pwd = $("#sign_password").val();
        var confpwd = $("#sign_cofirm_password").val();
        if (username.trim() == '') {
            $("#signup_username").focus();
            return false;
        }
        if (!is_email) {
            $("#signup_email").focus();
            return false;
        }

        if (pwd.length < 6) {
            $("#sign_password").focus();
            return false;
        }
        if (pwd != confpwd) {
            $("#sign_cofirm_password").focus();
            return false;
        }

        $.ajax({
            url: '/submit_login',
            type: 'POST',
            data: $("#signup_form").serialize(),
            success: function(res) {
                if (res.responseDesc == 'Sucess') {
                    signUp(username, useremail, pwd);
                } else {
                    $(".captcha-alert-text").text(res.responseDesc);
                    $(".captcha-alert").show();
                }
            },
            error: function(e) {
                console.log(e);
            }
        });
    }
    if (flag == 'login') {
        // $.session.clear();
        var email = $("#log_email").val();
        var isemail = isEmail(email);
        var userpwd = $("#log_password").val();
        if (!isemail) {
            $("#log_email").focus();
            return false;
        }

        if (userpwd.length < 6) {
            $("#log_password").focus();
            return false;
        }

        $.ajax({
            url: '/submit_login',
            type: 'POST',
            data: $("#login_form").serialize(),
            success: function(res) {
                if (res.responseDesc == 'Sucess') {
                    logIn(email, userpwd);
                } else {
                    $(".captcha-log-text").text(res.responseDesc);
                    $(".captcha-log").show();
                }
            },
            error: function(e) {
                console.log(e);
            }
        });
    }
}
//sign up
function signUp(username, useremail, pwd) {
    var wallet_addr = $("#wallet_address").val();
    var wallet_seed = $("#wallet_seed").val();
    $.ajax({
        url: '/signup',
        type: 'POST',
        data: { username: username, useremail: useremail, userpassword: pwd, wallet_addr: wallet_addr, wallet_seed: wallet_seed },
        success: function(res) {
            if (res == 'exists') {
                $('.captcha-alert-text').text('Already Your email address exists.');
                $(".captcha-alert").show();
                return false;
            } else if (res == 'success') {
                $('.captcha-alert-text').text('Register Success.');
                $(".captcha-alert").show();
                $("#signupmodal").fadeOut();
            } else {
                alert(res);
            }
        },
        error: function(e) {
            console.log(e);
        }
    });
}

//login
function logIn(email, password) {
    $.ajax({
        url: '/login',
        type: 'POST',
        data: { email: email, password: password },
        success: function(res) {
            if (res.slice(0, 2) == '0x') {
                localStorage.setItem('token', res);
                $('.captcha-log-text').text('Login Success.');
                $(".captcha-log").show();
                $("#loginmodal").fadeOut();
            } else if (res == 'fail') {
                $('.captcha-log-text').text('Invalid email or password!');
                $(".captcha-log").show();
            } else {
                alert(res);
            }
        },
        error: function(e) {
            console.log(e);
        }
    });
}


// Get the modal
var modal = document.getElementById('signupmodal');
var loginmodal = document.getElementById('loginmodal');

// Get the button that opens the modal
var btn = document.getElementById("opensignup");
var openlogin = document.getElementById("openlogin");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}
openlogin.onclick = function() {
        loginmodal.style.display = "block";
    }
    // When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}
span.onclick = function() {
        loginmodal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == loginmodal) {
        loginmodal.style.display = "none";
    }
}
var token = localStorage.getItem('token');
if (token) {
    //generate qr code
    $('#qr').qrcode({
        render: 'image',
        text: token,
        ecLevel: 'H',
        size: '160',
    });

    $('#qr_val').text(token);
}


$("#copyaddr").click(function() {
    var copyText = $("#qr_val").text();
    // Select the address anchor text  
    var addr = document.querySelector('#qr_val');
    var range = document.createRange();
    range.selectNode(addr);
    window.getSelection().addRange(range);

    try {
        // Now that we've selected the anchor text, execute the copy command  
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
    } catch (err) {
        console.log('Oops, unable to copy');
    }

    // Remove the selections - NOTE: Should use
    // removeRange(range) when it is supported  
    window.getSelection().removeAllRanges();

    $(this).text('COPIED');
    // setTimeout(function(){$(this).text('COPY ADDRESS');}, 500);
    setTimeout(function() { $("#copyaddr").text('COPY ADDRESS'); }, 1000);
});