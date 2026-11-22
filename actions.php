<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

function text_length(string $value): int {
    if (function_exists('mb_strlen')) return mb_strlen($value, 'UTF-8');
    $count = preg_match_all('/./us', $value, $matches);
    return $count === false ? strlen($value) : $count;
}
function lower_text(string $value): string {
    return function_exists('mb_strtolower') ? mb_strtolower($value, 'UTF-8') : strtolower($value);
}
function reply(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, ['error' => 'Método não permitido.']);
}
$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 1048576) reply(413, ['error' => 'A solicitação excede o limite permitido.']);
$request = json_decode($raw, true);
if (!is_array($request)) reply(400, ['error' => 'A solicitação enviada é inválida.']);
$action = (string)($request['action'] ?? '');
$args = $request['args'] ?? [];
if (!is_array($args)) reply(400, ['error' => 'Os dados da solicitação são inválidos.']);

$privateDir = __DIR__ . DIRECTORY_SEPARATOR . 'private';
if (!is_dir($privateDir) && !mkdir($privateDir, 0700, true) && !is_dir($privateDir)) {
    reply(500, ['error' => 'Não foi possível preparar o armazenamento seguro das solicitações.']);
}
$storePath = $privateDir . DIRECTORY_SEPARATOR . 'contact_requests.jsonl';

if ($action === 'records.list') {
    $count = 0;
    if (is_file($storePath) && is_readable($storePath)) {
        $handle = fopen($storePath, 'rb');
        if ($handle !== false) {
            while (!feof($handle)) {
                $line = fgets($handle);
                if ($line !== false && trim($line) !== '') $count++;
            }
            fclose($handle);
        }
    }
    // A página usa somente a contagem. Nenhum dado pessoal é devolvido ao navegador.
    reply(200, ['data' => ['records' => array_fill(0, $count, new stdClass())]]);
}
if ($action !== 'records.create') reply(400, ['error' => 'Ação não reconhecida.']);
$value = $args['value'] ?? [];
if (!is_array($value)) reply(400, ['error' => 'Os dados do formulário são inválidos.']);

$name = trim((string)($value['name'] ?? ''));
$email = trim((string)($value['email'] ?? ''));
$phone = trim((string)($value['phone'] ?? ''));
$service = trim((string)($value['service'] ?? ''));
$message = trim((string)($value['message'] ?? ''));
$digits = preg_replace('/\D+/', '', $phone) ?? '';
if (text_length($name) < 2 || text_length($name) > 140) reply(422, ['error' => 'Informe seu nome completo.']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 || preg_match('/[\r\n]/', $email)) reply(422, ['error' => 'Informe um e-mail válido.']);
if (strlen($digits) < 10 || strlen($digits) > 13) reply(422, ['error' => 'Informe um telefone com DDD.']);
if (text_length($message) < 10 || text_length($message) > 10000) reply(422, ['error' => 'Descreva a obra com pelo menos 10 caracteres.']);
if (text_length($service) > 180) reply(422, ['error' => 'A opção de serviço selecionada é inválida.']);

// Combina a chave recebida do navegador com os campos completos, evitando duplicidades falsas.
$clientKey = trim((string)($args['idempotency_key'] ?? ''));
$idempotency = hash('sha256', $clientKey . '|' . lower_text($email) . '|' . $digits . '|' . lower_text($name) . '|' . $service . '|' . $message);
$handle = fopen($storePath, 'c+');
if ($handle !== false) @chmod($storePath, 0600);
if ($handle === false) reply(500, ['error' => 'Não foi possível acessar o armazenamento seguro das solicitações.']);
if (!flock($handle, LOCK_EX)) {
    fclose($handle);
    reply(503, ['error' => 'Não foi possível reservar o registro da solicitação. Tente novamente.']);
}
rewind($handle);
while (($line = fgets($handle)) !== false) {
    $record = json_decode($line, true);
    if (is_array($record) && ($record['idempotency_key'] ?? '') === $idempotency) {
        flock($handle, LOCK_UN);
        fclose($handle);
        reply(200, ['data' => ['id' => $record['id'] ?? null, 'duplicate' => true]]);
    }
}

$recipient = 'sac@projetodeimpermeabilizacao.com.br';
$subjectText = 'Nova solicitação de projeto — Ralif Engenharia';
$subject = function_exists('mb_encode_mimeheader') ? mb_encode_mimeheader($subjectText, 'UTF-8') : $subjectText;
$cleanName = preg_replace('/[\r\n]+/', ' ', $name) ?? $name;
$cleanPhone = preg_replace('/[\r\n]+/', ' ', $phone) ?? $phone;
$body = "Nova solicitação recebida pelo site da Ralif Engenharia\n\n"
    . "Nome: {$cleanName}\nE-mail: {$email}\nTelefone: {$cleanPhone}\n"
    . "Serviço de interesse: " . ($service !== '' ? $service : 'Não informado') . "\n\n"
    . "Sobre a obra:\n{$message}\n\nOrigem: site-institucional\nData (UTC): " . gmdate('c') . "\n";
$headers = [
    'From: Ralif Engenharia <no-reply@projetodeimpermeabilizacao.blog.br>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . PHP_VERSION,
];
$mailAccepted = false;
try {
    $mailAccepted = mail($recipient, $subject, $body, implode("\r\n", $headers));
} catch (Throwable $error) {
    $mailAccepted = false;
}
if (!$mailAccepted) {
    flock($handle, LOCK_UN);
    fclose($handle);
    reply(502, ['error' => 'O servidor não aceitou o envio do e-mail. Verifique a configuração de e-mail/SMTP da hospedagem e tente novamente.']);
}
$id = bin2hex(random_bytes(12));
$record = [
    'id' => $id,
    'idempotency_key' => $idempotency,
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'service' => $service,
    'message' => $message,
    'source' => 'site-institucional',
    'created_at' => (string)($value['created_at'] ?? gmdate('c')),
    'mail_accepted_by_server' => true,
];
$encoded = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($encoded === false || fseek($handle, 0, SEEK_END) !== 0 || fwrite($handle, $encoded . "\n") === false || !fflush($handle)) {
    flock($handle, LOCK_UN);
    fclose($handle);
    reply(500, ['error' => 'O e-mail foi aceito pelo servidor, mas não foi possível gravar o protocolo da solicitação. Entre em contato pelo WhatsApp.']);
}
flock($handle, LOCK_UN);
fclose($handle);
reply(200, ['data' => ['id' => $id, 'duplicate' => false]]);
