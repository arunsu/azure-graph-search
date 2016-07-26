var client = AzureSearch({
    url: "https://arg.search.windows.net",
    key: "6BDDF0E8DC8959B985436A5F6905823B"
});

// Call Azure search to get indexes
var getIndexes = function(cb) {
    client.listIndexes(function(err, schemas){
        if (err){
            cb(err, null);
        }
        if (schemas.length > 0){
            var indexNames = $.map(schemas, function(schema) {
                return(schema.name);
            });
            cb(null, indexNames);
        }
    });
};

var getDocuments = function(indexName, query, cb) {
    client.search(indexName, {search: query, $top: 4}, function(err, results){
        if (err){
            return;
        }
        cb(results);
    });
};

var DashBoard = React.createClass({displayName: "DashBoard",

    getInitialState: function(){
      this.loadTableItems(this.props.query);
      return {
          query:this.props.query,
          tableRows:[],
          rowSelected: -1
      };
    },

    loadTableItems: function(query) {
        getIndexes(function(err, indexNames)
        {
            if (err){
                return;
            }

            for (var i = 0; i < indexNames.length; i++) {
                getDocuments(indexName[i], query, function(results)
                {
                  var rows = this.state.tableRows;
                  rows.push(results);
                  this.setState({
                    tableRows: rows
                  });
                });
            }
        });
    },

    rowClick: function(row, rowIndex) {
        var cb = function(root) {
            this.setState({
                rowSelected: rowIndex
            })
        };
        searchclient.rowClick(row, cb.bind(this));
    },

    searchClicked: function(query) {
        if (query) {
            this.setState({
                query: query
            })
        }
    },

    render: function() {
        var self = this;
        var searchLink = {
            value: this.state.query,
            requestChange: this.searchClicked,
            title: "Enter the text to search"
        }

        var dataRow;
        if (this.state.tableRows[0]) {
            dataRow = <DataLayout dashboard={dashboards[this.state.focused]} alias={this.state.searchBy.keyword} items={this.state.tableRows} rowSelected={this.state.rowSelected} onRowClick={this.rowClick}/>;
        }

        return (
            <div>
                <SearchBox searchLink={searchLink} />
                <br/>
                <div>
                    <div className='container-fluid'>
                        <div className="row" key="1">
                            <div className="col-md-10">
                                {dataRow}
                            </div>
                        </div>
                    </div>
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

var DataLayout = React.createClass({displayName: "DataLayout",

    clicked: function(index){
        this.props.onRowClick(this.props.items[index], index);
    },

    render: function () {
        var self = this;

        var tableStyle = {
            height: '200px',
            overflow: 'auto'
        };

        var rows = $.map(this.props.items, function (item, i) {
            var rowValue = JSON.stringify(item, null, 4);
            return (
                <li className="list-group-item">{rowValue}</li>
            );
        });

        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h4>{this.props.dashboard.header}</h4>
                </div>
                <div className="panel-body">
                  <ul className="list-group">{rows}</ul>
                </div>
                <div className="panel-footer">
                    {footer}
                </div>
            </div>
        );
    }
});
