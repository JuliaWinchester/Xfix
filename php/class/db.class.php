<?php

/**
 * DB is a MySQl database abstraction class that uses PDO to provide create,
 * read, update, and delete methods. This class is required by class 
 * DBObjectManager.
 *
 * @package Xfix
 * @author Julie Winchester <julie.m.winchester@gmail.com>
 * @access public
 */
class DB {
	protected $dbdriver = 'mysql';
	protected $host     = '127.0.0.1';
	protected $dbname   = 'Xfix_test';
	protected $charset  = 'utf8';
	protected $username = 'Moocow';
	protected $password = 'salmiakki';
	public $dbh;

	function __construct() 
	{
		// Error catching isn't necessary, but in case of bad server config
		try {
			$dsn = "$this->dbdriver:host=$this->host;port=3306;dbname=$this->dbname;charset=$this->charset";
			$opt = [PDO::ATTR_ERRMODE			 => PDO::ERRMODE_EXCEPTION,
					PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
					PDO::ATTR_EMULATE_PREPARES	 => false];
			$this->dbh = new PDO($dsn, $this->username, $this->password, $opt);
		} catch (PDOException $e) {
			print "Error!: " . $e->getMessage() . "<br/>";
			die();
		}	
	}
	
	/**
	 * Encloses string in back-ticks and escapes back-ticks within string. For
	 * strings with '.' (as in 'section.name'), sub-strings on either side of 
	 * '.' are enclosed in back-ticks
	 *
	 * @param string $i
	 * @return string Enclosed and escaped string
	 * @access public
	 */
	function prepareidentifier($i) 
	{
		$i_array = explode(".",$i);
		$i_array = array_map(function($i) {
			return "`".str_replace("`","``",$i)."`";
		}, $i_array);
		return implode(".",$i_array);
		
	}

	/**
	 * Inserts new row(s) into database table. For multiple rows, values should
	 * be provided sequentially in a single array, i.e. [A.name, A.age, B.name,
	 * B.age, C.name, C.age, ...]
	 *
	 * @param string $table
	 * @param mixed $column String or array of strings of column name(s)
	 * @param array $values Values array. For >1 rows, [[A.a, A.b],[B.a, B.b]]
	 * @return bool Success of row insert
	 * @access public
	 */
	function create($table, $column, $value) 
	{
		$table = $this->prepareidentifier($table);
		if (gettype($column) == 'string') {
			$column = $this->prepareidentifier($column);
		} elseif (gettype($column) == 'array') {
			$column = implode(',', array_map(array($this, "prepareidentifier"), $column));
		}

		if (gettype($value[0]) == 'array') {
			$value_placeholder = implode(',',array_map(function($x) {
    				return "(".implode(',', array_fill(0, count($x),'?')).")";
					}, $value));
			$value = call_user_func_array('array_merge', $value);
		} else {
			$value_placeholder = "(".implode(',', array_fill(0, count($value), '?')).")";
		}

		$sql = "INSERT INTO $table($column) VALUES $value_placeholder";
		$stmt = $this->dbh->prepare($sql);
		$stmt->execute($value);
		return $this->dbh->lastInsertId();
	}

	/**
	 * Prepares and executes SQL database read queries using PDO methods.  
	 *
	 * @param string $sql SQL database read query
	 * @param array Parameters to be inserted into query 
	 * @return array Indexed array of database results for query
	 * @access public
	 */
	function executereadquery($sql, $params)
	{
		// construct query, prepare, and execute
		$stmt = $this->dbh->prepare($sql);
		$stmt->execute($params);

		$result = $stmt->fetchAll();
		return $result;
	}

	/**
	 * Reads data from database table. 
	 *
	 * @param string $table
	 * @param array $where Optional where clause e.g. ["column","=","value"],
	 					   "=" can also be "in" with "value" as array of values. 
	 * @param mixed $column Optional column name(s) as string or array
	 * @param bool $distinct Optional, whether or not distinct results returned
	 * @return array Array of indexed database row result arrays
	 * @access public
	 */
	function read($table, $where=NULL, $column=NULL, $distinct=FALSE, $count=FALSE)
	{
		// prepare identifiers
		$table = $this->prepareidentifier($table);

		if ($distinct) {
			$select_stmt = "SELECT DISTINCT";
		} else {
			$select_stmt = "SELECT"; 
		}

		if ($column) {
			if (gettype($column) == 'array') {
				$column = implode(',', array_map(array($this, "prepareidentifier"), $column));
			} elseif (gettype($column) == 'string') {
				$column = $this->prepareidentifier($column);
			}
		} else {
			$column = "*";
		}

		if ($count) {
			$group_by = "GROUP BY $column";
			$column = $column.", COUNT(*)";
		}

		if ($where) {
			$where_col = $this->prepareidentifier($where[0]);
			if ($where[1] == "=") {
				$where_stmt = "WHERE $where_col = ?";
				$params = [$where[2]];
			} elseif ($where[1] == "in") {
				$placeholder = "(".implode(',',array_fill(0,count($where[2]), '?')).")";
				$where_stmt = "WHERE $where_col IN $placeholder";
				if (gettype($where[2]) == 'array') {
					$params = $where[2];
				} else {
					$params = [$where[2]];
				}
			} else {
				die('Where statement problem. Where: '.var_dump($where)); 
			}
			$sql = "SELECT $column FROM $table $where_stmt";
		} else {
			$sql = "SELECT $column FROM $table";
			$params = [];
		}

		if ($count) {
			$sql = $sql." $group_by";
		}

		return $this->executereadquery($sql, $params);
	}

	/**
	 * Reads data from two database tables using inner join equality condition.
	 * Can not currently handle duplicate column names in the two joined tables,
	 * if duplicate column names are present duplicate columns from first table
	 * will be excluded.  
	 *
	 * @param string $t1 First table name
	 * @param string $t2 Second table name
	 * @param string $j1 First table column name for joining
	 * @param string $j2 Second table column name for joining
	 * @param array $where Optional where clause e.g. ["column","=","value"],
	 					   "=" can also be "in" with "value" as array of values.
	 * @param mixed $column Optional column name(s) as string or array
	 * @return array Array of indexed database row result arrays
	 * @access public
	 */
	function readInnerJoin($t1, $t2, $j1, $j2, $where=NULL, $column=NULL)
	{
		// prepare identifiers
		$j1 = $this->prepareidentifier("$t1.$j1");
		$j2 = $this->prepareidentifier("$t2.$j2");
		$t1 = $this->prepareidentifier($t1);
		$t2 = $this->prepareidentifier($t2);
		
		if ($column) {
			if (gettype($column) == 'array') {
				$column = implode(',', array_map(array($this, "prepareidentifier"), $column));
			} elseif (gettype($column) == 'string') {
				$column = $this->prepareidentifier($column);
			}
		} else {
			$column = "*";
		}

		if ($where) {
			$where_col = $this->prepareidentifier($where[0]);
			if ($where[1] == "=") {
				$where_stmt = "WHERE $where_col = ?";
				$params = [$where[2]];
			} elseif ($where[1] == "in") {
				$placeholder = "(".implode(',',array_fill(0,count($where[2]), '?')).")";
				$where_stmt = "WHERE $where_col IN $placeholder";
				$params = $where[2];
			} else {
				return FALSE; // Add error later
			}
			$sql = "SELECT $column FROM $t1 INNER JOIN $t2 ON $j1 = $j2 $where_stmt";
		} else {
			$sql = "SELECT $column FROM section INNER JOIN model ON $j1 = $j2";
			$params = [];
		}

		return $this->executereadquery($sql, $params);
	}

	/**
	 * Updates data in single database table row.  
	 *
	 * @param string $table
	 * @param mixed $column String or array of strings of column name(s)
	 * @param mixed $value String or array of strings of values to insert
	 * @param integer $id Primary key ID of row to update
	 * @return mixed
	 * @access public
	 */ 
	function update($table, $column, $value, $id)
	{
		if (count($column) != count($value)) {
			return false;
			// add an error about not matching here
		}
		
		$table = $this->prepareidentifier($table);

		if (gettype($column) == 'array') {
			$column = array_map(array($this, "prepareidentifier"), $column);
			$columnquery = implode(',', array_map(function($c) { 
				return $c." = ?"; 
			}, $column));
		} elseif (gettype($column) == 'string') {
			$columnquery = $this->prepareidentifier($column)." = ?";
		}

		if (gettype($value) == 'array') {
			$value[] = $id;
		} elseif (gettype($value) == 'string') {
			$value = [$value, $id];
		}
		
		$sql = "UPDATE $table SET $columnquery WHERE id = ?";
		$stmt = $this->dbh->prepare($sql);
		$stmt->execute($value);
		return $stmt->rowCount();
	}

	/**
	 * Deletes database table row(s).  
	 *
	 * @param string $table
	 * @param array $id Array of IDs of row(s) to delete
	 * @return integer Number of rows deleted
	 * @access public
	 */
	function delete($table, $id)
	{
		$table = $this->prepareidentifier($table);
		$id_placeholders = implode(',', array_fill(0, count($id), '?'));
		$sql = "DELETE FROM $table WHERE id IN ($id_placeholders)";
		$stmt = $this->dbh->prepare($sql);
		$stmt->execute($id);
		return $stmt->rowCount();
	}
}

?>