const mongoconn = require('db-mongos');

/**
 * OSS logger for login, action, billing, income, consume logs.
 */
class GameOSS
{
	/**
	 * @param {cfg} Mongodb configuration.
	 * @param {ossname} logs postfix name.
	 */
	constructor(cfg, ossname={ossname:'osslogs'})
	{
		this.conn = new mongoconn(cfg);
		this.ossname = ossname.ossname;
	}

	getTableName(name)
	{
		return (name+"_"+this.ossname);
	}

	log(tblname) {
		var conn = this.conn;
		var tablename = this.getTableName(tblname);		

		/**
		 * @param {data} Json object
		 * @param {callback} Callback
		 */
		function onAdd(data, callback)
		{
			conn.connection((db) => {
				conn.insertOne(db, tablename, data, (db) => {
					db.close();
					callback();
				})
			});
		}

		/**
		 * @param {datas} Array
		 * @param {callback} Callback
		 */
		function onMulti(datas, callback)
		{
			conn.connection((db) => {
				conn.insertAll(db, tablename, datas, (db) => {
					db.close();
					callback();
				})
			});
		}

		return {
			add:onAdd,
			multi:onMulti
		}
	}
}

module.exports = GameOSS;
