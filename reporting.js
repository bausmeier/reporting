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
  console.log('Authorizing');
  gapi.auth.authorize(data, handleAuthResult);
}

var handleAuthResult = function(authResult) {
  if (authResult) {
    console.log('Authorization succeeded');
    gapi.client.load('analytics', 'v3', handleAuthorized);
    $('#authorize').hide();
    $('.loading').show();
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
  $('.loading').hide();
  $('.search').show();
}

var search = function() {
  console.log('searching');
  $('#pages').empty();
  $('#events').empty();
  $('.report').show();
  var tenant = $('input').val()
    .replace('\\','\\\\')
    .replace(',', '\\,')
    .replace(';','\\;');
  console.log(tenant);
  queryPages(tenant);
  queryEvents(tenant);
}

var queryPages = function(tenant) {
  var query = {
    'ids': 'ga:68220841',
    'start-date': '2013-04-01',
    'end-date': '2013-05-08',
    'metrics': 'ga:pageViews',
    'dimensions': 'ga:pagePath',
    'filters': 'ga:customVarValue1=~' + tenant
  }
  gapi.client.analytics.data.ga.get(query).execute(handlePageResults);
}

var queryEvents = function(tenant) {
  var query = {
    'ids': 'ga:68220841',
    'start-date': '2013-04-01',
    'end-date': '2013-05-08',
    'metrics': 'ga:totalEvents,ga:uniqueEvents',
    'dimensions': 'ga:eventCategory,ga:eventAction',
    'filters': 'ga:customVarValue1=~' + tenant
  }
  gapi.client.analytics.data.ga.get(query).execute(handleEventResults);
}

var handlePageResults = function(results) {
  var content = $('#pages');
  content.append('<tr><th>Page path</th><th>Page views</th></tr>');
  results.rows.forEach(function(row) {
    content.append('<tr><td>'+row[0]+'</td><td>'+row[1]+'</td></tr>');
  });
}

var handleEventResults = function(results) {
  var content = $('#events');
  content.append('<tr><th>Event category</th><th>Event action</th><th>Count</th><th>Unique</th></tr>');
  results.rows.forEach(function(row) {
    content.append('<tr><td>'+row[0]+'</td><td>'+row[1]+'</td><td>'+row[2]+'</td><td>'+row[3]+'</td><</tr>');
  });
}
