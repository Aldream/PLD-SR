var logger = require("../logger");
var mysql = require("mysql-native");

function sqlCreateClient(address, user, passwd, dbname) {
	var db = mysql.createTCPClient(address);
	db.set("charset", "utf8");
	db.auto_prepare = true;
	db.auth(dbname, user, passwd);
	return db;
}

function sqlClose(db) {
	db.close();
}

function sqlAsyncQuery(db, query, callbackAsync, callbackEnd) { 
	var timestamp = new Date().getTime();
	var result={};
	result.fields = [];
	result.count = 0;
	result.hits = [];
	logger.debug("Query : " + query.toString());
	db.query(query)
		.on('field', function(f) {
			result.fields.push(f.name);
		})
		.on('row', function(hit) {
			result.hits.push(hit);
			result.count++;
			if(callbackAsync != null) callbackAsync(hit);
		})
		.on('end', function() {
			result.took = new Date().getTime() - timestamp;
			logger.debug("Took : "+result.took+"ms - Hits : "+result.count);
			callbackEnd(result);
		});
}

function sqlQuery(db, query, callback) {
	sqlAsyncQuery(db, query, null, callback);
}

function sqlDumpResult(result) {
	logger.info("Took : "+result.took+"ms\nHits : "+result.count);
	var strFields = "";
	for(var i in result.fields) strFields+=result.fields[i]+"\t";
	logger.debug("Fields : "+strFields);
	for(var i in result.hits) {
		var hit = result.hits[i];
		logger.debug("================================");
		logger.debug("Hit n°"+i);
		for(var field in hit) logger.debug(field+":\t"+hit[field]);
	}

}

exports.createClient = sqlCreateClient;
exports.close = sqlClose;
exports.asyncQuery = sqlAsyncQuery;
exports.query = sqlQuery;
exports.dumpResult = sqlDumpResult;

// Utilisation :
//var db = sqlCreateClient("localhost", "rithm", "rithm", "pld");
//sqlQuery(db, "select 1+1,2,3,'4',length('hello')", function(result) {sqlDumpResult(result);});
//sqlClose(db);
