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
    handleResults(results.thisMonth);
  });
}

var queryThisMonth = function(callback) {
  var today = moment().format('YYYY-MM-DD'),
      twoWeeksAgo = moment().subtract('weeks', 2).format('YYYY-MM-DD');
  runQuery(twoWeeksAgo, today, callback);
}

var queryLastMonth = function(callback) {
  var twoWeeksAgo = moment().subtract('weeks', 2).format('YYYY-MM-DD'),
      fourWeeksAgo = moment().subtract('weeks', 4).format('YYYY-MM-DD');
  runQuery(fourWeeksAgo, twoWeeksAgo, callback)
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
    'sort': '-ga:visitors'
  }
  gapi.client.analytics.data.ga.get(query).execute(wrapResult);
}

var handleResults = function(results) {
  var content  = $('#content');
  content.empty();
  content.append('<tr><th>Tenant</th><th>Unique visitors</th><th>New visitors</th></tr>');
  results.rows.forEach(function(row) {
    content.append('<tr><td>'+row[0]+'</td><td>'+row[1]+'</td><td>'+row[2]+'</td></tr>');
  });
}
