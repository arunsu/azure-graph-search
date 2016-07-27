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
        var name = <a href='http://aka.ms/genevaarg'>{item.id}</a>
        return (
          <div className="row" key={i}>
            <TreeView nodeLabel={name} defaultCollapsed={collapsed}>{divRows}</TreeView>
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

var SearchBox =  React.createClass({
    displayName: "SearchBox",

    searchClicked: function() {
        var inputValue = this.myTextInput.value;
        if (inputValue) {
            this.props.searchLink.requestChange(inputValue);
        }
    },

    // To enable search as typing text in search box add onChange={this.handleQuery}
    handleQuery: function(evt){
        this.props.searchLink.requestChange(evt.target.value);
    },

    render: function() {
        var self = this;
        // Check if the key is enter
        var handleInput = function(evt){
            if (evt.keyCode == 13) {
                self.searchClicked();
            }
        }

        return (
            <div className='container'>
                <div className="row">
                    <div className="col-sm-2">
                        <a href="#" className="my-tool-tip" data-toggle="tooltip" data-placement="left" data-html="true" title={this.props.searchLink.title}>
                            <span className="glyphicon glyphicon-info-sign"></span>
                        </a>
                        <label style={{'color':"#337ab7"}}>Search:</label>
                    </div>
                    <div className="col-md-3">
                        <input type="text" ref={(ref)=> this.myTextInput = ref} onKeyDown={handleInput} placeholder={this.props.searchLink.title}/>
                    </div>
                </div>
            </div>
        );
    }
});

var SearchResult = React.createClass({displayName: "SearchResult",
  getInitialState: function(){
    var items = resultsStr;
    return {
      query:this.props.query,
      items: items
    };
  },

  searchClicked: function(query) {
    if (!query) {
        console.log("Graph query is empty");
    } else{
      console.log("query "+query);
      $.ajax({
        url: '/searchgraph/?q='+query,
        dataType: 'json',
        cache: false,
        // If the call to the URL succeeds, extract data from response
        success: function(data) {
          this.setState({
            query:query,
            items: data
          })
        }.bind(this),
        error: function(xhr, status, err) {
          console.log(query, status, err.toString());
        }.bind(this)
      });
    }
  },

  render: function () {
    var self = this;
    var searchLink = {
        value: this.state.query,
        requestChange: this.searchClicked,
        title: "Enter search text"
    }

    //var decodeitems = $('<div />').html(this.props.items).text();
    var itemsObj = this.state.items;

    var rows;
    if (itemsObj){
      var goodRows = $.map(itemsObj, function(item){
        if (item.results[0])
          return item;
      });
      if (goodRows[0]){
        rows = $.map(goodRows, function (item, i) {
          return (
            <div className="row" key={i}>
                <IndexResult index={item.index} results={item.results}></IndexResult>
            </div>
          );
        });
      }
      else {
      rows = <span>No results found for {this.state.query}</span>;
      }
    }

    return (
      <div className='container'>
        <div className="row">
          <SearchBox searchLink={searchLink} />
        </div>
        <br/>
        {rows}
      </div>
    );
  }
});
