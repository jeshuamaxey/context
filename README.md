# Context

A neat Chrome plugin to provide context when browsing [wikipedia](http://wikipedia.org) built with the help of [extensionizr](http://extensionizr.com).

Thanks also goes to Remy Sharp's [Wikitext javascript library](http://remysharp.com/2008/04/01/wiki-to-html-using-javascript/).

## To Do Before Next Release

* ~~ensure first sentence is shown every time~~
* ~~account for links that start with '/wiki/Help:something' (see pronuciation guides in first line of first para)~~
* ~~account for links with a hyphen in the URL - [this article](http://en.wikipedia.org/wiki/Branching_process) has a link to "Galton-Watson process" which brings up info on Galton~~

## Ideas for Future Versions

* allow option to drag the height of the context box to any height (from anywhere along the top of the context box)
* stop the context box resizing when it shows 'loading...'
* deal with redirects properly - link to 'with probability 1' in [this article](http://en.wikipedia.org/wiki/Branching_process) is an example of this
* fail gracefully
* allow links within table to be clicked for context
* make an icon