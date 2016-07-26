var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

$(function() {
    $("#scenarioName").change(function() {
        config = getConfig($('option:selected', this).text());
        //alchemy = new Alchemy(config);
    });

    $("#btnSubmit").click(function(){
      var scenario = $("#scenarioName option:selected").text();
      var sendData = {
        "query" : "{MATCH (n:Cloud) RETURN n LIMIT 25}"
      };

       var config = {
         graphHeight: function() {return 700;},
         graphWidth: function() {return 1200;},

         linkDistance: function(){ return 40; },

         nodeTypes: {"node_type": ["Maintainer", "Contributor"]},
         caption: function(node){ return node.caption; }
       }

      if(scenario === "Contributors"){
        sendData.query = "MATCH (n:Cloud) RETURN n LIMIT 25";

        getData(sendData, function(source){
          config.dataSource = source;
          alchemy = new Alchemy(config);
        });
      } else {
        config.dataSource = '/alchemy/actors.json';
        alchemy = new Alchemy(config);
      }
    });
});

function getData(sendData, callback) {
  // call the URL, get JSON object back
  $.ajax({
    url: 'http://40.86.87.248:7474/db/data/cypher',
     username: "neo4j",
     password: "arg123$",
     type: "POST",
     contentType: "application/json",
    cache: false,
    beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa("neo4j:arg123$"));
        xhr.setRequestHeader('Access-Control-Allow-Credentials', true);
    },
    data : JSON.stringify(sendData),
    // If the call to the URL succeeds, extract data from response
    success: function(data) {
        console.log(data);
        callback(data);
    },
    error: function(xhr, status, err) {
        console.log(sendData, status, err.toString());
    }
  });
}

function getConfig(scenario){
   var config = {
     dataSource: '/alchemy/contrib.json',
     graphHeight: function() {return 700;},
     graphWidth: function() {return 1200;},

     linkDistance: function(){ return 40; },

     nodeTypes: {"node_type": ["Maintainer", "Contributor"]},
     caption: function(node){ return node.caption; }
   }

   return config;
}
