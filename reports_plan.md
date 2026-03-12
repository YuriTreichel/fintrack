# Plano de Implementação dos Relatórios

## Relatórios Solicitados:
1. Fluxo de Caixa ✓ (já existe)
2. Entradas vs Saídas ✓ (já existe como "Fluxo de Caixa")
3. Receitas por Categoria (novo)
4. Despesas por Categoria ✓ (já existe)
5. Despesas Fixas vs Variáveis (novo)
6. Evolução do Saldo (novo)
7. Saldo por Conta (novo)
8. Contas a Pagar (novo)
9. Contas a Receber (novo)
10. Relatório de Cartão de Crédito (novo)
11. Limite Utilizado do Cartão (novo)
12. Metas Financeiras (novo)
13. Comparação Mensal de Receitas e Despesas (novo)
14. Comparação Anual (novo)
15. Média de Gastos Mensais (novo)
16. Maiores Despesas (novo)
17. Despesas por Período (novo)
18. Receitas por Período (novo)
19. Projeção de Saldo (novo)
20. Histórico de Transações (novo)

## Estrutura da Página:
- Grid responsivo com cards para cada relatório
- Cada relatório terá seu próprio card com título, gráfico/tabela e opções de filtro
- Organização por categorias:
  1. **Análise de Fluxo**: Fluxo de Caixa, Entradas vs Saídas
  2. **Análise por Categoria**: Receitas por Categoria, Despesas por Categoria, Despesas Fixas vs Variáveis
  3. **Análise de Saldo**: Evolução do Saldo, Saldo por Conta, Projeção de Saldo
  4. **Contas e Cartões**: Contas a Pagar, Contas a Receber, Relatório de Cartão, Limite Utilizado
  5. **Comparativos**: Comparação Mensal, Comparação Anual, Média de Gastos
  6. **Detalhamento**: Maiores Despesas, Despesas por Período, Receitas por Período, Histórico
  7. **Metas**: Metas Financeiras

## Implementação Técnica:
1. Criar hooks useMemo para cada cálculo de relatório
2. Adicionar componentes de gráficos adicionais (LineChart, AreaChart, etc.)
3. Implementar filtros comuns (período, tipo, categoria)
4. Criar componentes reutilizáveis para cards de relatório
5. Adicionar opções de exportação/visualização

## Dependências:
- Recharts já está instalado
- date-fns já está instalado
- Lucide React já está instalado