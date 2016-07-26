var IndexResult = React.createClass({displayName: "IndexResult",
  render: function () {
    var rows;
    if (this.props.results[0]){
      rows = $.map(this.props.results, function (item, i) {
        //var rowValue = JSON.stringify(item, null, 4);

        var itemProps = [];
        for (var property in item) {
            if (item.hasOwnProperty(property)) {
              itemProps.push(property);
            }
        }

        var divRows = $.map(itemProps, function(itemProp, j){
          return (<div key={j} className="info">{itemProp}: {item[itemProp]}</div>)
        });

        var rowId = "row"+i;
        var rowRef = "#"+rowId;
        var collapsed = i==0?false:true;
        return (
          <div className="row" key={i}>
            <TreeView nodeLabel={item.CustomerName} defaultCollapsed={collapsed}>{divRows}</TreeView>
          </div>
        );
      });
    }

    return (
        <div className="panel panel-primary">
            <div className="panel-heading">
                <span>{this.props.index}</span>
            </div>
            <div className="panel-body">
              <div className='container'>{rows}</div>
            </div>
        </div>
    );
  }
});

var SearchResult = React.createClass({displayName: "SearchResult",
  render: function () {

    var decodeitems = $('<div />').html(this.props.items).text();
    var itemsObj = $.parseJSON(resultsStr);

    var rows;
    if (itemsObj){
      var goodRows = $.map(itemsObj, function(item){
        if (item.results[0])
          return item;
      });
      rows = $.map(goodRows, function (item, i) {
        return (
          <div className="row" key={i}>
              <IndexResult index={item.index} results={item.results}></IndexResult>
          </div>
        );
      });
    }

    return (
      <div className='container'>
        <div className="row">
          <label className="col-sm-2" style={{'color':"#337ab7"}}>Search Query</label>
          <span>{this.props.query}</span>
        </div>
        {rows}
      </div>
    );
  }
});
