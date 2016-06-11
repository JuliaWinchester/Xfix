<?php
        //Enter your code here, enjoy!

include_once('db.class.php');

$DB = new DB();

#echo var_dump($DB->create("model",["name","type","description","section_id"],[["Mandible","Bone","Image of mandible bone",3],["Alveolar nerve","Nerve","Image of nerve",3],["Ment foramen","Feature","Image of feature",3]]));

#echo var_dump($DB->delete("model",[24,25,26]));

#echo var_dump($DB->update("model",["name", "type", "description"],["Femur","Bone","Image of femur bone"],3));

echo var_dump($DB->read("view", $where=["model_id","in",[3,4,5]]));
?>