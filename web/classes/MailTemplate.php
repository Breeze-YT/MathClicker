<?php

$ScriptStartTime = microtime(true); //To track how long a page takes to create
header('Content-type: text/html; charset=UTF-8');
require "config.php";
require('class_debug.php'); //Require the debug class
require('class_mysql.php'); //Require the database wrapper
require('phpmailer/PHPMailerAutoload.php'); //Require the database wrapper

$Debug = new DEBUG;
$Debug->handle_errors();

$DB = new DB_MYSQL;
$DB->connect();

class MailTemplate{
    public $sender;
    public $body;
    public $db;
    public $domain = 'http://logmarket.hu';

    public function __construct(){
        global $DB;
        $this->db = $DB;
        $this->sender = new PHPMailer();
        $this->sender->isSMTP();
        $this->sender->Host = 'smtp.upcmail.hu';
        $this->sender->SMTPAuth = true;
        $this->sender->Username = 'deak.csaba5@upcmail.hu';
        $this->sender->Password = '30482097';
        $this->sender->isHTML(true);
    }

    public function sendMail(){
        $this->getTemplate();

        /*if(!$this->sender->send()) {
            echo 'Message could not be sent.';
            echo 'Mailer Error: ' . $this->sender->ErrorInfo;
        } else {
            echo 'Message has been sent';
        }*/
    }

    public function getTemplate(){
        $sql1  = $this->db;
        $sql1->call_sp("get_notification");
        $rows = $sql1->all();

        foreach($rows as $row){
            $msg_id = array(
                ":p_message_id" => $row['notification_message_id']
            );
            $not_id = array(
                ":p_notification_id" => $row['notification_id']
            );
            $sql2 = new DB_MYSQL();
            $sql2->connect();
            $sql2->call_sp("get_notification_message",$msg_id);
            $msgTpl = $sql2->all();

            $datas = json_decode($row['data']);

            foreach($datas->receivers as $receiver){
                $this->body = '';
                $user_id = array(
                    ":p_user_id" => $receiver->receiver
                );
                $sql3 = new DB_MYSQL();
                $sql3->connect();
                $sql3->call_sp("get_user", $user_id);
                $user_data = $sql3->row();

                if ($datas->tender_id) {
                    $sql4 = new DB_MYSQL();
                    $sql4->connect();
                    $sql4->call_sp("get_tender", $datas->tender_id);
                    $tender = $sql4->row();
                    $tender[0] = json_decode($tender[0]['tender_detail']);
                }

                $user_data['domain'] = $this->domain;
                $user_data['link'] = $this->domain;

                $messageContent = $msgTpl[0]['header'] . $msgTpl[0]['notification_message'] . $msgTpl[0]['footer'];

                $keywords[] = json_decode($msgTpl[0]['header_keyword']);
                $keywords[] = json_decode($msgTpl[0]['notification_keyword']);
                $keywords[] = json_decode($msgTpl[0]['footer_keyword']);

                foreach ($keywords as $vars) {
                    foreach ($vars as $var) {
                        $messageContent = str_replace("[$var]", $user_data[$var], $messageContent);
                        $messageContent = str_replace("[$var]", $tender['tender_' . $var], $messageContent);
                    }
                }

                // $this->body .= str_replace(array('[username]','[domain]'),array($user_data['username'],$this->domain),$msgTpl[0]['header']);
                // $this->body .= str_replace(array('[registration_token]','[domain]'),array($user_data['registration_token'],$this->domain),$msgTpl[0]['notification_message']);
                $this->body = $messageContent;
                $this->sender->setFrom('info@logmarket.hu');
                $this->sender->addAddress($user_data['email']);
                $this->sender->addCC('csbdeak@gmail.com');
                $this->sender->Subject = $msgTpl[0]['notification_subject'];
                $this->sender->Body = $this->body;

                if(!$this->sender->send()) {
                    echo 'Message could not be sent.';
                    echo 'Mailer Error: ' . $this->sender->ErrorInfo;
                } else {
                    echo 'Message has been sent';
                    $sql4 = new DB_MYSQL();
                    $sql4->connect();
                    $sql4->call_sp('set_notification',$not_id);
                }
                $this->sender->clearAddresses();
            }
        }
    }
}
$test = new MailTemplate();
$test->sendMail();