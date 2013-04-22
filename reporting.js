var clientId = '16305868429.apps.googleusercontent.com';
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
    authButton.show();
  }
}

var handleAuthorized = function() {
  var today = moment().format('YYYY-MM-DD'),
      twoWeeksAgo = moment().subtract('weeks', 2).format('YYYY-MM-DD');
  var query = {
    'ids': 'ga:68220841',
    'start-date': twoWeeksAgo,
    'end-date': today,
    'metrics': 'ga:visitors,ga:newVisits',
    'dimensions': 'ga:customVarValue1',
    'sort': '-ga:visitors'
  }
  gapi.client.analytics.data.ga.get(query).execute(handleResults);
}

var handleResults = function(results) {
  var content  = $('#content');
  content.empty();
  content.append('<tr><th>Tenant</th><th>Unique visitors</th><th>New visitors</th></tr>');
  results.rows.forEach(function(row) {
    content.append('<tr><td>'+row[0]+'</td><td>'+row[1]+'</td><td>'+row[2]+'</td></tr>');
  });
}
