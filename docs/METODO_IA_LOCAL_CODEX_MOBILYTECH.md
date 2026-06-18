# Metodo IA local + Codex - MobilyTech BR

Origem: handoff recebido em 2026-06-18 de
`C:\Users\MF\Documents\Codex\2026-06-18\oi-eu-tava-vendo-aqui-alguma\outputs\handoff-ia-local-para-codex-mobilytech.md`.

## Objetivo

Usar uma IA local/gratis para economizar creditos do Codex em tarefas leves e repetitivas, sem transferir para ela decisoes sensiveis de negocio, producao, contas, afiliados, pagamentos ou credenciais.

Regra central:

- IA local prepara.
- Codex revisa, testa, decide e executa o que envolve producao ou risco real.
- Tudo que a IA local gerar ou alterar deve passar por cheque final do Codex antes de ser considerado entregue.
- O criterio minimo de aprovacao e qualidade praticamente equivalente ao que o Codex entregaria diretamente, sem regressao visual, funcional, textual ou tecnica.

## Ferramentas locais disponiveis

- Ollama `0.30.6`
- Modelo local: `qwen2.5-coder:7b`
- Aider `0.86.2`
- Python `3.12.10`
- Git `2.54.0.windows.1`

Scripts prontos:

- Perguntas simples:
  `C:\Users\MF\Documents\Codex\2026-06-18\oi-eu-tava-vendo-aqui-alguma\outputs\ask-local-model.cmd`
- Agente local de codigo:
  `C:\Users\MF\Documents\Codex\2026-06-18\oi-eu-tava-vendo-aqui-alguma\outputs\start-local-aider.cmd`
- Guia:
  `C:\Users\MF\Documents\Codex\2026-06-18\oi-eu-tava-vendo-aqui-alguma\outputs\local-ai-setup-guide.md`

## Uso permitido

A IA local pode ser usada para:

- explicar erros;
- resumir trechos de codigo ou texto;
- criar rascunhos de descricoes de produtos;
- sugerir ideias de layout;
- montar checklists de teste;
- revisar funcoes pequenas;
- propor pequenas alteracoes em arquivos especificos;
- fazer primeira leitura de arquivos nao sensiveis;
- gerar prompts auxiliares para crocheck ou auditoria visual.

Ela pode receber o maximo possivel de tarefas leves e repetitivas, desde que:

- nao entre nas areas proibidas abaixo;
- nao fique mais lenta do que resolver diretamente pelo Codex de forma desproporcional;
- o Codex faca revisao final obrigatoria antes de aproveitar o resultado.

## Uso proibido sem revisao do Codex

A IA local nao deve executar sozinha:

- deploy em Vercel, Wix ou producao;
- alteracao de dominio, DNS ou rotas oficiais;
- alteracao de checkout, Mercado Pago, Abacate Pay ou pagamentos;
- configuracao real de afiliados em conta logada;
- manipulacao de tokens, senhas, `.env`, chaves de API ou credenciais;
- envio de emails reais;
- compras, cancelamentos, contratacoes ou acoes financeiras;
- mudancas grandes em muitos arquivos;
- comandos destrutivos.

## Comandos base

Pergunta simples:

```powershell
& "C:\Users\MF\Documents\Codex\2026-06-18\oi-eu-tava-vendo-aqui-alguma\outputs\ask-local-model.cmd" -Prompt "Explique este erro em portugues: ..."
```

Leitura segura do repo sem edicao:

```powershell
& "C:\Users\MF\Documents\Codex\2026-06-18\oi-eu-tava-vendo-aqui-alguma\outputs\start-local-aider.cmd" -ProjectPath "C:\Users\MF\Documents\GitHub\mobilytechbr" -Message "Explique os arquivos principais deste projeto sem editar nada."
```

Edicao pequena e localizada:

```powershell
& "C:\Users\MF\Documents\Codex\2026-06-18\oi-eu-tava-vendo-aqui-alguma\outputs\start-local-aider.cmd" -ProjectPath "C:\Users\MF\Documents\GitHub\mobilytechbr" -Message "Sugira uma melhoria pequena e localizada em ARQUIVO_ESPECIFICO. Nao mexa em pagamento, afiliados, tokens, senhas, deploy, DNS ou producao."
```

Depois de qualquer uso no projeto real, o Codex deve verificar:

```powershell
git status --short
git diff
```

E tambem deve fazer um cheque de qualidade do resultado:

- confirmar que a tarefa pedida foi realmente cumprida;
- comparar o resultado com o padrao visual/funcional/textual esperado;
- corrigir ou descartar saidas fracas, incompletas, confusas ou abaixo do padrao;
- nao publicar, commitar, enviar, copiar para producao ou tratar como pronto qualquer resultado da IA local sem essa revisao.

## Melhor uso pratico no fluxo atual

Para a pendencia ativa dos botoes/publicacao do MobilyTech Finds, a IA local pode ajudar em:

- comparar descricoes dos botoes de referencia;
- gerar checklist visual para o crocheck;
- revisar CSS de botao antes do crocheck externo;
- resumir diferencas entre a implementacao local e as referencias;
- preparar prompts para a conversa fixada `Analise Visual MobilyTech BR`.

Mas o Codex deve continuar responsavel por:

- editar arquivos finais;
- validar links de afiliado;
- rodar build/testes;
- fazer deploy/publicacao;
- conferir o dominio oficial `https://www.mobilytech.com.br`;
- usar ChatGPT/crocheck como aprovador visual externo.

## Primeira acao recomendada

Antes de usar a IA local em producao, fazer um teste somente leitura no repo real:

```powershell
& "C:\Users\MF\Documents\Codex\2026-06-18\oi-eu-tava-vendo-aqui-alguma\outputs\start-local-aider.cmd" -ProjectPath "C:\Users\MF\Documents\GitHub\mobilytechbr" -Message "Explique rapidamente a estrutura deste projeto sem editar nada."
```

Se a resposta for util, usar a IA local apenas como camada de rascunho/triagem. Se for ruim ou confusa, descartar sem travar o trabalho.
