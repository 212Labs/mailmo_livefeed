var has_addr = function(mail, addr_type) {
  return mail['addresses'] && mail['addresses'][addr_type];
};

var print_name = function(addr) {
  return addr['name'] || addr['email'];
};

var print_names = function(addrs) {
  var names = $.map(addrs, print_name);
  return names.join(', ');
};

var pretty_date = function(date) {
  var d = new Date(date * 1000);
  return d;
};


$(function() {
  
  // First, parse the query string
  var params = {};
  var queryString = location.hash.substring(1);
  var regex = /([^&=]+)=([^&]*)/g;
  var m;
  
  while (m = regex.exec(queryString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  
  if ("token" in params) {
    // Authenticated!  
    
    // Should remove hash
    window.location.hash = '';
    
    var socket = io.connect('https://mailmo.at:4433/?token=' + params["token"], {secure: true});
    socket.on('message', function(data) {
      $("#content").prepend(new EJS({url: 'ejs/mail.ejs'}).render({mail: data}));
    });

  } else {
    // Redirect to Mailmo!
    var auth_params = {
      consumer_key : 'd624a612-8e07-44c1-9809-514a968442ce',
      redirect : window.location.href.split('#')[0],
      response_type : 'token',
      state : 'asdfasdfsdf',
    }; 
    
    window.location.replace("https://mailmo.at/authorize?" + $.param(auth_params));
  }
});