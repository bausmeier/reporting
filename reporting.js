var clientId = '16305868429-70lrbni5o6mi87bifvps8unt04fbl0ak.apps.googleusercontent.com';
var apiKey = 'AIzaSyBukblQ5fz05neRK5B02AiwvGG6MaqmQ90';
var scopes = 'https://www.googleapis.com/auth/analytics.readonly';

var handleClientLoad = function() {
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth, 1);
}

var checkAuth = function() {
  var data = {
    client_id: clientId,
    scope: scopes,
    immediate: true
  }
  gapi.auth.authorize(data, handleAuthResult);
}

var handleAuthResult = function(authResult) {
  if (authResult) {
    gapi.client.load('analytics', 'v3', handleAuthorized);
    $('.loading').show();
    $('#authorize').hide();
  } else {
    console.log('Authorization failed');
    var data = {
      client_id: clientId,
      scope: scopes,
      immediate: false
    }
    var authButton = $('#authorize');
    authButton.on('click', function() {
      gapi.auth.authorize(data, handleAuthResult);
    });
    $('.loading').hide();
    authButton.show();
  }
}

var handleAuthorized = function() {
  async.parallel({
    thisMonth: queryThisMonth,
    lastMonth: queryLastMonth
  }, function(err, results) {
    $('.loading').hide();
    handleResults(results);
  });
}

var queryThisMonth = function(callback) {
  var today = moment().format('YYYY-MM-DD'),
      endOfLastMonth = moment().subtract('months', 1).format('YYYY-MM-DD');
  runQuery(endOfLastMonth, today, callback);
}

var queryLastMonth = function(callback) {
  var endOfLastMonth = moment().subtract('months', 1).format('YYYY-MM-DD');
      startOfLastMonth = moment().subtract('months', 2).format('YYYY-MM-DD');
  runQuery(startOfLastMonth, endOfLastMonth, callback)
}

var runQuery = function(startDate, endDate, callback) {
  var wrapResult = function(result) {
    callback(null, result);
  }
  var query = {
    'ids': 'ga:68220841',
    'start-date': startDate,
    'end-date': endDate,
    'metrics': 'ga:visitors,ga:newVisits',
    'dimensions': 'ga:customVarValue1',
    'sort': 'ga:customVarValue1'
  }
  gapi.client.analytics.data.ga.get(query).execute(wrapResult);
}

var handleResults = function(results) {
  var content = $('#this-month');
  content.empty();
  content.append('<tr><th>Tenant</th><th>Unique visitors</th><th>New visitors</th></tr>');
  results.thisMonth.rows.forEach(function(row) {
    content.append('<tr><td>'+row[0]+'</td><td>'+row[1]+'</td><td>'+row[2]+'</td></tr>');
  });
  content = $('#last-month');
  content.empty();
  content.append('<tr><th>Tenant</th><th>Unique visitors</th><th>New visitors</th></tr>');
  results.lastMonth.rows.forEach(function(row) {
    content.append('<tr><td>'+row[0]+'</td><td>'+row[1]+'</td><td>'+row[2]+'</td></tr>');
  });
}
