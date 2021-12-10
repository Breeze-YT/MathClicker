<?php

class DEBUG {

    public $Errors = array();
    public $Flags = array();

    public function handle_errors() {
        error_reporting(E_WARNING | E_ERROR | E_PARSE);
        //set_error_handler(array($this, 'php_error_handler'));
    }

    public function set_flag($Event) {
        global $ScriptStartTime;
        $this->Flags[] = array($Event, (microtime(true) - $ScriptStartTime) * 1000, memory_get_usage(true));
    }

}
