<?php
declare(strict_types=1);
$root=realpath(__DIR__);
$requested=$_GET['file']??'';
if(!is_string($requested)){http_response_code(400);exit('Solicitação inválida.');}
$requested=trim(rawurldecode($requested));
if($requested===''||basename($requested)!==$requested||!preg_match('/^[\p{L}\p{N}._ -]+\.html$/u',$requested)){http_response_code(400);exit('Endereço inválido.');}
$lower=static function(string $value):string{return function_exists('mb_strtolower')?mb_strtolower($value,'UTF-8'):strtolower($value);};
$aliases=[
'home.html'=>'Index.html',
'categoria-consultoria-e-servicos.html'=>'consultoria.html',
'categoria-normas-tecnicas-e-regulamentacoes.html'=>'categoria-tecnicas.html',
'categoria-impermeabilização-de-edificações.html'=>'categoria-edificacoes.html',
'categoria-sustentabilidade-na-construção.html'=>'categoria-sustentabilidade.html',
'categoria-técnicas-de-impermeabilização.html'=>'categoria-tecnicas.html',
'categoria-impermeabilização-de-subsolos.html'=>'categoria-subsolos.html',
'categoria-impermeabilização-de-piscinas.html'=>'categoria-piscinas.html',
'categoria-impermeabilização-de-telhados.html'=>'categoria-telhados.html',
'projetos-impermeabilizacao-terraco.html'=>'consultoria.html'
];
$targetName=$requested;
if(!is_file($root.DIRECTORY_SEPARATOR.$targetName)){
$alias=$aliases[$lower($requested)]??null;
if(is_string($alias))$targetName=$alias;
else{
$targetName='';
foreach(glob($root.DIRECTORY_SEPARATOR.'*.html')?:[] as $candidate){
if($lower(basename($candidate))===$lower($requested)){$targetName=basename($candidate);break;}
}
if($targetName===''){
http_response_code(404);header('Content-Type:text/html; charset=utf-8');
echo '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Página não encontrada | Ralif Engenharia</title><body><h1>Página não encontrada</h1><p>O endereço solicitado não está disponível.</p><p><a href="index.html#/">Voltar ao site da Ralif Engenharia</a></p></body></html>';exit;
}
}
}
$filePath=realpath($root.DIRECTORY_SEPARATOR.$targetName);
if($filePath===false||dirname($filePath)!==$root||!is_file($filePath)||!is_readable($filePath)){http_response_code(404);exit('Página não encontrada.');}
$html=file_get_contents($filePath);
if($html===false){http_response_code(500);exit('Não foi possível carregar esta página.');}
header('Content-Type:text/html; charset=utf-8');header('X-Content-Type-Options:nosniff');header('Cache-Control:public, max-age=60');
$isRedirect=preg_match('/http-equiv\s*=\s*["\']?refresh/i',$html)===1;
$isIndex=strcasecmp(basename($filePath),'Index.html')===0;
if($isRedirect||$isIndex||strlen($html)<2000){echo $html;exit;}
$css='<link rel="stylesheet" href="ralif-site-shell.css?v=20261121">';
$js='<script src="ralif-site-shell.js?v=20261121" defer></script>';
$html=preg_replace('/<\/head\s*>/i',$css.'</head>',$html,1,$headCount);
$html=preg_replace('/<\/body\s*>/i',$js.'</body>',$html,1,$bodyCount);
if(($headCount??0)!==1||($bodyCount??0)!==1){error_log('Ralif shell: estrutura head/body ausente em '.basename($filePath));echo $html;exit;}
echo $html;