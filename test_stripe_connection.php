<?php
require __DIR__ . '/vendor/autoload.php';

// Carregar variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$stripeSecret = $_ENV['STRIPE_SECRET'] ?? '';

if (empty($stripeSecret)) {
    echo "❌ STRIPE_SECRET não configurado no .env\n";
    exit(1);
}

\Stripe\Stripe::setApiKey($stripeSecret);

try {
    echo "=== Testando conexão com Stripe ===\n\n";
    
    // Listar produtos
    $products = \Stripe\Product::all(['limit' => 10]);
    
    echo "✅ Conexão bem-sucedida!\n";
    echo "Modo: " . (strpos($_ENV['STRIPE_KEY'] ?? '', 'pk_test') === 0 ? "Teste" : "Produção") . "\n\n";
    
    if (count($products->data) > 0) {
        echo "Produtos encontrados: " . count($products->data) . "\n\n";
        
        foreach ($products->data as $product) {
            echo "📦 Produto: " . $product->name . "\n";
            echo "   ID: " . $product->id . "\n";
            echo "   Descrição: " . ($product->description ?? 'N/A') . "\n";
            
            // Listar preços deste produto
            $prices = \Stripe\Price::all(['product' => $product->id, 'limit' => 5]);
            
            if (count($prices->data) > 0) {
                echo "   Preços:\n";
                foreach ($prices->data as $price) {
                    $amount = $price->unit_amount / 100;
                    $currency = strtoupper($price->currency);
                    $interval = $price->recurring->interval ?? 'one-time';
                    $intervalCount = $price->recurring->interval_count ?? 1;
                    
                    echo "     - R$ {$amount} {$currency}";
                    if ($interval !== 'one-time') {
                        echo " / {$intervalCount} {$interval}(s)";
                    }
                    echo " (ID: {$price->id})\n";
                }
            } else {
                echo "   ⚠️  Nenhum preço configurado para este produto\n";
            }
            echo "\n";
        }
    } else {
        echo "⚠️  Nenhum produto encontrado no Stripe\n";
        echo "   Você precisa criar produtos/preços no painel do Stripe:\n";
        echo "   1. FinTrack - Plano Família (R$ 34,90/mês)\n";
        echo "   2. FinTrack - Premium Mensal (R$ 19,90/mês)\n";
        echo "   3. FinTrack - Plano Anual (R$ 199,90/ano)\n";
    }
    
} catch (\Stripe\Exception\AuthenticationException $e) {
    echo "❌ ERRO: Falha na autenticação com Stripe\n";
    echo "   Mensagem: " . $e->getMessage() . "\n";
    echo "   Verifique se as chaves estão corretas\n";
} catch (\Exception $e) {
    echo "❌ ERRO: " . $e->getMessage() . "\n";
}

echo "\n=== Verificando configuração do Laravel ===\n\n";

// Verificar configuração do Laravel
$configPath = __DIR__ . '/config/services.php';
if (file_exists($configPath)) {
    $config = include $configPath;
    if (isset($config['stripe']['key']) && isset($config['stripe']['secret'])) {
        echo "✅ Configuração do Stripe em config/services.php OK\n";
    } else {
        echo "⚠️  Configuração do Stripe não encontrada em config/services.php\n";
    }
}

echo "\n✅ Teste concluído!\n";