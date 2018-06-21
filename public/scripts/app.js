$(document).ready(function(){
  renderTweets();
  $('#new-tweet').hide();

});

function submitTweet(){
    if (formValid()){
      let data = $('form').serialize();
      $.ajax('/tweets', {
        method: 'POST',
        data: data
      }).done(function(result) {
        $('#new-tweet').hide(200);
        renderTweets();
      });
    }
}

function formValid(){
  if ($('#txtNewTweet').val().length > 140){
    const err = `<div class="alert">
            <strong>Tweets must be less than 140 characters</strong>
            </div>`;
    $('.new-tweet').append(err);
    return false;
  }else if($('#txtNewTweet').val().length === 0){
    const err = `<div class="alert">
            <strong>Enter something in!</strong>
            </div>`;
    $('.new-tweet').append(err);
    return false;
  }else{
    return true;
  }
}

function renderTweets(){
  const data = $.ajax('/tweets').done(function(res){
    for (tweet in res){
      $('.container').append(createTweet(res[tweet]));
    }
    $('.iconDiv').hide();
    initListeners();
  });
}

function createTweet(tweet){
  return `
  <section class="tweet-container">
      <header>
        <img src="${escape(tweet.user.avatars.small)}" />
        <p class="handle">
          ${escape(tweet.user.handle)}
        </p>
        <h2>
          ${escape(tweet.user.name)}
        </h2>

      </header>
      <article >
        <p><p>${escape(tweet.content.text)}</p></p>
      </article>
    <footer>
      <time>${moment(tweet.created_at).fromNow()}</time>
      <span class="iconDiv" >
        <i class="fas fa-retweet"></i>
        <i class="fas fa-flag"></i>
        <i class="fas fa-heart"></i>
      </span>
    </footer>
  </section>`;
}

function initListeners(){
  $('.new-tweet textarea').on('keypress', function(ev){
    let len = $(this).val().length;
    let newLen = 140 - len
    $('span.counter').html(newLen);
    if (newLen < 0){
      $(this).css({'color': 'red'});
    }else{
      $(this).css({'color': 'black'});
    }
  });
  $('.tweet-container').hover(function(ev){
    $(ev.delegateTarget).find('.iconDiv').toggle();
  });

  $('#btnCompose').on('click', function(ev){
    $('#new-tweet').toggle(400);
    $('#new-tweet textarea').focus();
  });

  $('form').on('submit', function(ev){
    ev.preventDefault();
    submitTweet();
  });
}


function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
