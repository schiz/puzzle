<?

require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");

$return = array('res'=>0, 'message'=>'Ошибка. Обратитесь к разработчику', 'data'=>'/404.php');
$encode_key = 'J9gw4jyt75thf';


if (!CModule::IncludeModule("iblock")) {
    print json_encode($return);
    exit;
}

if ($_REQUEST["action"] == 'getkey') {
    print json_encode(array('res'=>1, 'message'=>'', 'data'=>$encode_key));
    exit;
} elseif ($_REQUEST["action"] == 'store') {
    if(!$USER->IsAuthorized()) {
        print json_encode(array('res'=>0, 'message'=>'Вам надо авторизоваться', 'data'=>'/auth/404'));
        exit;
    }

    //проверка введенного кода
    if (!$_REQUEST["have_code"]) {
        print json_encode(array('res'=>0, 'message'=>'Вам надо ввести код', 'data'=>'/entercode/404'));
        exit;
    } else {
        print json_encode(array('res'=>1, 'message'=>'Результат сохранен', 'data'=>'/link-to-rating'));
        exit;
    }
}

print json_encode($return);
exit;






