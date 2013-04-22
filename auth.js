var clientId = '16305868429.apps.googleusercontent.com';
var apiKey = 'AIzaSyBukblQ5fz05neRK5B02AiwvGG6MaqmQ90';
var scopes = 'https://www.googleapis.com/auth/analytics.readonly';

var handleClientLoad = function() {
  console.debug('handleClientLoad');
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth, 1);
}

var checkAuth = function() {
  console.debug('checkAuth');
  var data = {
    client_id: clientId,
    scope: scopes,
    immediate: true
  }
  gapi.auth.authorize(data, handleAuthResult);
}

var handleAuthResult = function(authResult) {
  console.debug('handleAuthResult');
  if (authResult) {
    console.debug('Auth success');
    gapi.client.load('analytics', 'v3', handleAuthorized);
  } else {
    console.error('Auth failed');
  }
}

var handleAuthorized = function() {
  alert('Client loaded!');
}
