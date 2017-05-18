window.addEventListener('DOMContentLoaded', function () {
  var $contentContainer = document.querySelector('#contentContainer');
  var $searchInput = document.querySelector('#searchInput');
  var $searchForm = document.querySelector('#searchForm');
  
  var TWITCH_CLIENT_ID = '13s11xt6h2szdnpoaww8fheogbmwcy';
  
  var page = 1;
  var pageSize = 5;
  var currentSearch = ' ';
  
  function searchAndRender () {
    var offset = Math.max((page - 1) * 5, 0);
    var limit = pageSize;
    var script = document.createElement('script');
    var query = encodeURIComponent(currentSearch);
    script.src = 'https://api.twitch.tv/kraken/search/streams?limit=' + limit + '&offset=' + offset + '&query=' + query + '&callback=render&client_id=' + TWITCH_CLIENT_ID;
    document.head.appendChild(script);
    document.head.removeChild(script);
  }
  
  function incrementPage () {
    page++;
  }
  
  function decrementPage () {
    page--;
  }
  
  function resetPage () {
    page = 1;
  }
  
  function setPage (value) {
    page = value;
  }
  
  function setCurrentSearch (search) {
    currentSearch = search || ' ';
  }
  
  function renderLoader () {
    $contentContainer.innerHTML = (
      "<div class='loaderContainer'>" + 
        "<img src='ajax-loader.gif' alt='Loading'/>" +
      "</div>"
    );
  }
  
  function createContentRow (stream) {
    var imageUrl = stream.preview.template.replace('{width}', '140').replace('{height}', '140');
    var titleText = stream.channel.display_name;
    var subtitleText = stream.game + ' - ' + stream.viewers + ' viewers';
    var descriptionText = stream.channel.status;
    
    return (
      "<div class='resultRow'>" +
        "<div class='contentImageWrapper'>" +
          "<img src='https://static-cdn.jtvnw.net/previews-ttv/live_user_esl_sc2-140x140.jpg' alt='Preview'/>" +
        "</div>" +
        "<div class='contentBox'>" +
          "<pre class='titleText'>" + titleText + "</pre>" +
          "<pre class='subtitleText'>" + subtitleText + "</pre>" +
          "<pre class='description'>" + descriptionText + "</pre>" +
        "</div>" +
      "</div>"
    );
  }
  
  function createSummary (total) {
    var numPages = Math.ceil(total / pageSize);
    
    return (
      "<div id='summaryContainer'>" +
        "<div class='summaryItem'>" +
          "<div class='summaryTotal'>Total results: " + total + "</div>" +
        "</div>" +
        "<div class='summaryItem'>" +
          "<div class='summaryPagination'>" + 
            "<i class='arrow left' id='previousPage'></i> " + page + "/" + numPages + "<i class='arrow right' id='nextPage'></i>" +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }
  
  function postProcess (data) {
    var numPages = Math.ceil(data._total / pageSize);
    
    if (data.streams.length < 0) {
      if ($contentContainer.className.indexOf('hidden') === -1) {
        $contentContainer.className += ' hidden';
      }
    } else {
      $contentContainer.className = $contentContainer.className.replace('hidden', '');
    }
    
    var $previousPage = document.querySelector('#previousPage');
    var $nextPage = document.querySelector('#nextPage');
    
    if (numPages <= 1) {
      document.querySelector('.summaryPagination').className += ' hidden';
    } else {
      if (page >= numPages) {
        $nextPage.className += ' hidden';
      }
      if (page === 1) {
        $previousPage.className += ' hidden';
      }
    }
    
    $previousPage.addEventListener('click', function () {
      renderLoader();
      decrementPage();
      searchAndRender();
    });
    
    $nextPage.addEventListener('click', function () {
      renderLoader();
      incrementPage();
      searchAndRender();
    });
  }
  
  window.render = function (data) {
    var summaryContainer = createSummary(data._total);
    
    var resultsContainer = (
      "<div id='resultsContainer'>" + data.streams.map(createContentRow).join('') + "</div>"
    );
    
    $contentContainer.innerHTML = summaryContainer + resultsContainer;
    
    postProcess(data);
  }
  
  $searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var search = $searchInput.value;
    if (currentSearch !== search) {
      resetPage();
      setCurrentSearch($searchInput.value);
    }
    renderLoader();
    searchAndRender();
  });

  searchAndRender();
});
