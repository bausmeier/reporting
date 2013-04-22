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
    'metrics': 'ga:visits'
  }
  gapi.client.analytics.data.ga.get(query).execute(handleResults);
}

var handleResults = function(results) {
  alert('Total visits: '+results.rows[0][0]);
}
