$(document).ready(function() {

  $("#jquery_jplayer_1").jPlayer({
    ready: function() {
      $(this).jPlayer("setMedia", {
        mp3: "http://www.dormirei.com/mp3/chuva.mp3",
        oga: "http://www.dormirei.com/mp3/chuva.ogg"
      });
      $(this).jPlayer("volume", 0.9);
      $(this).jPlayer("repeat");
    },

    play: function() {
      $(this).jPlayer(play);
    },
    swfPath: "js",
    supplied: "mp3, m4a, oga",
    cssSelectorAncestor: "#jp_container_1",
    wmode: "window"
  });

  $("#jquery_jplayer_2").jPlayer({
    ready: function() {
      $(this).jPlayer("setMedia", {
        mp3: "http://www.dormirei.com/mp3/mar.mp3",
        oga: "http://www.dormirei.com/mp3/mar.ogg"
      });
      $(this).jPlayer("volume", 0.9);
      $(this).jPlayer("repeat");
    },
    play: function() {
      $(this).jPlayer("play");
    },
    cssSelectorAncestor: "#jp_container_2",
    volume: 0.85,
    swfPath: "js",
    supplied: "mp3, m4a, oga",
    wmode: "window"
      // .bind($.jPlayer.event.pause,function(){$(this).jPlayer("stop");})
  });


  $("#jquery_jplayer_3").jPlayer({
    ready: function() {
      $(this).jPlayer("setMedia", {
        mp3: "http://www.dormirei.com/mp3/lareira.mp3",
        oga: "http://www.dormirei.com/mp3/lareira.ogg"
      });
      $(this).jPlayer("volume", 0.9);
      $(this).jPlayer("repeat");
    },
    play: function() { // To avoid both jPlayers playing together.
      $(this).jPlayer();
    },
    swfPath: "js",
    supplied: "mp3, m4a, oga",
    cssSelectorAncestor: "#jp_container_3",
    wmode: "window"
  });

  $("#jquery_jplayer_5").jPlayer({
    ready: function() {
      $(this).jPlayer("setMedia", {
        mp3: "http://www.dormirei.com/mp3/trovao.mp3",
        oga: "http://www.dormirei.com/mp3/trovao.ogg"
      });
      $(this).jPlayer("volume", 0.9);
      $(this).jPlayer("repeat");
    },
    play: function() { // To avoid both jPlayers playing together.
      $(this).jPlayer();
    },
    cssSelectorAncestor: "#jp_container_5",
    swfPath: "js",
    supplied: "mp3, m4a, oga",
    wmode: "window"
  });

  $("#jquery_jplayer_6").jPlayer({
    ready: function() {
      $(this).jPlayer("setMedia", {
        mp3: "http://www.dormirei.com/mp3/chuva2.mp3",
        oga: "http://www.dormirei.com/mp3/chuva2.ogg"
      });
      $(this).jPlayer("volume", 0.9);
      $(this).jPlayer("repeat");
    },
    play: function() { // To avoid both jPlayers playing together.
      $(this).jPlayer();
    },
    cssSelectorAncestor: "#jp_container_6",
    swfPath: "js",
    supplied: "mp3, m4a, oga",
    wmode: "window"
  });
  $("#jplayer_inspector_1").jPlayerInspector({
    jPlayer: $("#jquery_jplayer_1")
  });
  $("#jplayer_inspector_2").jPlayerInspector({
    jPlayer: $("#jquery_jplayer_2")
  });
  $("#jplayer_inspector_3").jPlayerInspector({
    jPlayer: $("#jquery_jplayer_3")
  });
  $("#jplayer_inspector_5").jPlayerInspector({
    jPlayer: $("#jquery_jplayer_5")
  });
  $("#jplayer_inspector_6").jPlayerInspector({
    jPlayer: $("#jquery_jplayer_6")
  });
});
