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
  $('#pages-export').hide();
  $('#events-export').hide();
  $('.report').show();
  var tenant = $('input').val()
    .replace('\\','\\\\')
    .replace('.','\\.')
    .replace('^','\\^')
    .replace('$','\\$')
    .replace('*','\\*')
    .replace('+','\\+')
    .replace('?','\\?')
    .replace('|','\\|')
    .replace('(','\\(')
    .replace(')','\\)')
    .replace('[','\\[')
    .replace(']','\\]')
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
    'end-date': moment().format('YYYY-MM-DD'),
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
    'end-date': moment().format('YYYY-MM-DD'),
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
  $('#pages-export').show();
}

var handleEventResults = function(results) {
  var content = $('#events');
  content.append('<tr><th>Event category</th><th>Event action</th><th>Count</th><th>Unique</th></tr>');
  results.rows.forEach(function(row) {
    content.append('<tr><td>'+row[0]+'</td><td>'+row[1]+'</td><td>'+row[2]+'</td><td>'+row[3]+'</td></tr>');
  });
  $('#events-export').show();
}

var exportToCSV = function(item) {
  $(item).TableCSVExport({delivery: 'download', separator: '\t'});
}
