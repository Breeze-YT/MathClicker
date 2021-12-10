<?php

class DB_MYSQL {

    public $LinkID = false;
    protected $Res = false;
    protected $Record = array();
    protected $Row;
    protected $Errno = 0;
    protected $Error = '';
    public $Procedures = array();
    public $Queries = array();
    public $Time = 0.0;
    protected $Database = '';
    protected $Server = '';
    protected $User = '';
    protected $Pass = '';
    protected $Port = 0;
    protected $Socket = '';

    public function __construct($Database = SQLDB, $User = SQLLOGIN, $Pass = SQLPASS, $Server = SQLHOST, $Port = SQLPORT, $Socket = SQLSOCK) {
        $this->Database = $Database;
        $this->Server = $Server;
        $this->User = $User;
        $this->Pass = $Pass;
        $this->Port = $Port;
        $this->Socket = $Socket;
    }

    public function halt($Msg) {
        $DBError = 'MySQL: ' . strval($Msg) . ' SQL error: ' . strval($this->Errno) . ' (' . strval($this->Error) . ')';
        if (DEBUGE_MODE) {
            echo '<pre>' . display_str($DBError) . '</pre>';
            echo "Queries:<br>";
            if (count($this->Queries) > 0) {
                print_r($this->Queries);
            }
            echo "Stored Procedures:<br>";
            if (count($this->Procedures) > 0) {
                print_r($this->Procedures);
            }
            die();
        } else {
            error("-1");
        }
    }

    public function connect() {
        if (!$this->LinkID) {
            try {
                $this->LinkID = new PDO("mysql:host=" . $this->Server . ";dbname=" . $this->Database, $this->User, $this->Pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
            } catch (PDOException $pe) {
                $this->Errno = $pe->getCode();
                $this->Error = $pe->getMessage();
                $this->halt("Connection failed (host:" . $this->Server . ")");
            }
        }
    }

    public function call_sp($Sp, $InParams = array(), $OutParams = array(), $AutoHandle = 1) {
        $QueryStartTime = microtime(true);
        
        $Sql = "CALL " . $Sp . "(" . implode(",", array_keys($InParams));

        if (count($InParams) > 0 && count($OutParams) > 0) {
            $Sql .= ",";
        }

        $Sql .= implode(",", $OutParams) . ")";

        try {
            $Stmt = $this->LinkID->prepare($Sql);


            foreach ($InParams as $name => &$value) {
                $Stmt->bindParam($name, $value);
            }
            $Stmt->execute();

            if (0 < count($OutParams)) {
                $Stmt->closeCursor();
                $this->Res = $this->LinkID->query("SELECT " . implode(",", $OutParams));
            } else {
                $this->Res = $Stmt;
            }

            $QueryEndTime = microtime(true);
            $this->Procedures[] = array($Sp, ($QueryEndTime - $QueryStartTime) * 1000);
            $this->Time+=($QueryEndTime - $QueryStartTime) * 1000;
        } catch (PDOException $pe) {
            $this->Errno = $pe->getCode();
            $this->Error = $pe->getMessage();

            if ($AutoHandle) {
                $this->halt('Invalid Stored Procedure: ' . $Sp);
            } else {
                return $this->Errno;
            }
        }

        $this->Row = 0;



        if ($AutoHandle) {
            return $this->Res;
        }
    }

    public function query($Query, $Params = array(), $AutoHandle = 1) {
        $QueryStartTime = microtime(true);

        try {
            $Stmt = $this->LinkID->prepare($Query);

            foreach ($Params as $name => $value) {
                $Stmt->bindParam($name, $value);
            }
            $Stmt->execute();
            //$Stmt->closeCursor();

            $this->Res = $Stmt;

            $QueryEndTime = microtime(true);
            $this->Queries[] = array($Query, ($QueryEndTime - $QueryStartTime) * 1000);
            $this->Time+=($QueryEndTime - $QueryStartTime) * 1000;
        } catch (PDOException $pe) {
            $this->Errno = $pe->getCode();
            $this->Error = $pe->getMessage();



            if ($AutoHandle) {
                $this->halt('Invalid Query: ' . $Query);
            } else {
                return $this->Errno;
            }
        }

        $this->Row = 0;

        if ($AutoHandle) {
            return $this->Res;
        }
    }

    public function inserted_id() {
        if ($this->LinkID) {
            return $this->LinkID->lastInsertID();
        }
    }

    public function column() {
        $columns = $this->Res->fetchAll(PDO::FETCH_NUM);

        $column = null;

        foreach ($columns as $cells) {
            $column[] = $cells[0];
        }

        return $column;
    }

    public function row($fetchmode = PDO::FETCH_ASSOC) {
        return $this->Res->fetch($fetchmode);
    }

    public function single() {
        return $this->Res->fetchColumn();
    }

    public function all($fetchmode = PDO::FETCH_ASSOC) {
        return $this->Res->fetchAll($fetchmode);
    }

    public function rowCount() {
        return $this->Res->rowCount($fetchmode);
    }

}
