//here we load all the modules

//temporarily find specific modules
//var Interface = require("./interface.js");
var Babel = require("babel-core");
Babel.transformFile("./interface.js", {}, function(err, result)
{
    if(!err)
    {
        eval(result.code);
    }
});
