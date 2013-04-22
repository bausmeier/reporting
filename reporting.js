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
  } else {
    console.error('Authorization failed');
  }
}

var handleAuthorized = function() {
  var query = {
    'ids': 'ga:68220841',
    'start-date': '2013-04-17',
    'end-date': '2013-04-22',
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
