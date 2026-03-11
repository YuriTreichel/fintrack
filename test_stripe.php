<?php
// Teste rápido da configuração do Stripe
require __DIR__ . '/vendor/autoload.php';

// Carregar variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

echo "=== Teste de Configuração do Stripe ===\n\n";

// Verificar se as chaves estão configuradas
$stripeKey = $_ENV['STRIPE_KEY'] ?? null;
$stripeSecret = $_ENV['STRIPE_SECRET'] ?? null;

if (!$stripeKey || !$stripeSecret) {
    echo "❌ ERRO: Chaves do Stripe não configuradas no .env\n";
    echo "STRIPE_KEY: " . ($stripeKey ? "Configurada" : "Não configurada") . "\n";
    echo "STRIPE_SECRET: " . ($stripeSecret ? "Configurada" : "Não configurada") . "\n";
    exit(1);
}

echo "✅ Chaves do Stripe configuradas no .env\n";

// Testar conexão com Stripe
try {
    \Stripe\Stripe::setApiKey($stripeSecret);
    
    // Tentar listar produtos (limite 1 para teste rápido)
    $products = \Stripe\Product::all(['limit' => 1]);
    
    echo "✅ Conexão com Stripe bem-sucedida\n";
    echo "   Modo: " . (strpos($stripeKey, 'pk_test') === 0 ? "Teste" : "Produção") . "\n";
    
    if (count($products->data) > 0) {
        echo "✅ Produtos encontrados no Stripe\n";
        foreach ($products->data as $product) {
            echo "   - {$product->name} (ID: {$product->id})\n";
        }
    } else {
        echo "⚠️  Nenhum produto encontrado no Stripe\n";
        echo "   Você precisa criar produtos/preços no painel do Stripe\n";
    }
    
} catch (\Stripe\Exception\AuthenticationException $e) {
    echo "❌ ERRO: Falha na autenticação com Stripe\n";
    echo "   Mensagem: " . $e->getMessage() . "\n";
    echo "   Verifique se as chaves estão corretas\n";
} catch (\Exception $e) {
    echo "❌ ERRO: " . $e->getMessage() . "\n";
}

echo "\n=== Verificação do Backend ===\n\n";

// Verificar se o SubscriptionController existe
$controllerPath = __DIR__ . '/app/Http/Controllers/SubscriptionController.php';
if (file_exists($controllerPath)) {
    echo "✅ SubscriptionController encontrado\n";
} else {
    echo "❌ SubscriptionController não encontrado\n";
}

// Verificar rotas
$routesApiPath = __DIR__ . '/routes/api.php';
$routesWebPath = __DIR__ . '/routes/web.php';

if (file_exists($routesApiPath)) {
    $apiContent = file_get_contents($routesApiPath);
    if (strpos($apiContent, 'SubscriptionController') !== false) {
        echo "✅ Rota de API para assinaturas configurada\n";
    } else {
        echo "❌ Rota de API para assinaturas não encontrada\n";
    }
}

if (file_exists($routesWebPath)) {
    $webContent = file_get_contents($routesWebPath);
    if (strpos($webContent, 'stripe/webhook') !== false) {
        echo "✅ Webhook do Stripe configurado\n";
    } else {
        echo "❌ Webhook do Stripe não configurado\n";
    }
}

// Verificar migração
echo "\n=== Status da Migração ===\n";
exec('php artisan migrate:status 2>&1', $output, $returnCode);

if ($returnCode === 0) {
    foreach ($output as $line) {
        if (strpos($line, 'add_subscription_fields_to_users_table') !== false) {
            if (strpos($line, 'Ran') !== false) {
                echo "✅ Migração de assinaturas executada\n";
            } else {
                echo "❌ Migração de assinaturas NÃO executada\n";
            }
            break;
        }
    }
}

echo "\n=== Instruções para Configuração Completa ===\n";
echo "1. Configure as chaves do Stripe no arquivo .env\n";
echo "2. Crie produtos e preços no painel do Stripe\n";
echo "3. Atualize os Price IDs em resources/js/config/stripePlans.js\n";
echo "4. Configure o webhook no painel do Stripe\n";
echo "5. Teste com cartão 4242 4242 4242 4242\n";

echo "\n✅ Teste concluído!\n";