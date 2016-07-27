var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

$(function() {
    $("#scenarioName").change(function() {
        var scenario = $('option:selected', this).text();
        var query = "MATCH (n:Cloud) RETURN n LIMIT 25";
        if(scenario === "Get cluster changes"){
          query = "MATCH p=()-[*1]-(sub:Subscription)-[*1]-()-[*1]-()-[*1]-()-[*1]-()-[*1]-(cluster:Cluster)-[r:HasDataCenter|ClusterHasNetworkSwitch]-(n) WHERE sub.SubscriptionId=\"1eb17067-73a5-403a-8aa8-cc7cc0b6fed3\" AND cluster.ClusterName=\"dm3prdapp12\" AND( n.DataCenter=\"DM3\" OR n.Hostname=\"DM3-0101-0115-20TS2\") Return * LIMIT 25";
        }
        $("#parameters").val(query);
    });

    $("#btnSubmit").click(function(){
      var scenario = $("#scenarioName option:selected").text();
      var sendData = {
        "query" : $("#parameters").val()
      };

      var config = {
       graphHeight: function() {return 700;},
       graphWidth: function() {return 1200;},

       linkDistance: function(){ return 40; },

       nodeTypes: {"node_type": ["Maintainer", "Contributor"]},
       caption: function(node){ return node.caption; }
      }

      getData(sendData, function(source){
        config.dataSource = source;
        var str = JSON.stringify(source, null, 4);
        $("#response").val(str);
        //alchemy = new Alchemy(config);
      });
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
        $("#response").val(err.toString());
    }
  });
}

function getConfig(){
   var config = {
     dataSource: '',
     graphHeight: function() {return 500;},
     graphWidth: function() {return 1200;},

     linkDistance: function(){ return 40; },

     nodeTypes: {"node_type": ["Maintainer", "Contributor"]},
     caption: function(node){ return node.caption; }
   }

   return config;
}
