# Package Details

This repo has the UI that supports searching the attributes of a azure resource graph. The azure resource graph should be indexed in document DB and hooked up to azure search.

The search is done across multiple indexes hosted azure search. To search any text pass it as ?q=querystring to the URL. Example /?q=toyota.

This repo using azure search node module which is a library for the Azure Search service. The documentation for the Azure Search REST API is available <a href="http://msdn.microsoft.com/library/azure/dn798935.aspx">here</a>.

# Installation
Use npm:

```
$ npm install azure-graph-search
```
