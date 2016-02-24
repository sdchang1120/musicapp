$(function() {

  $userPlaylist = $('.user-playlist');
  $viewUserPlaylist = $('.view-user-playlist');

  $td = $('td');
  $trLength = $('tr').children.length;
  console.log($trLength);

  $td.css('width', 'calc(100%/5)');

  // $userPlaylist.hover(function() {$viewUserPlaylist.show()}, function() {$viewUserPlaylist.hide()});

});
