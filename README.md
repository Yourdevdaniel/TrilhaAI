# TrilhaAi

Plataforma web que usa Inteligência Artificial para transformar um objetivo de estudo em um **roadmap** em etapas e em um **plano semanal**, com acompanhamento de progresso, avaliações e reforço.

Projeto da disciplina de Engenharia de Requisitos e Modelagem de Software (Ciência da Computação e Engenharia de Software).

**Protótipo no ar:** https://trilhaai-prototipo.vercel.app

> Este é um protótipo de demonstração. Não tem backend nem IA de verdade: as respostas da "IA" são simuladas e os dados ficam salvos no navegador.

## Rodar

Precisa de Node 20 ou mais novo.

```bash
cd prototipo
npm install
npm run dev
```

Abra http://localhost:5173 e clique em **Entrar com a conta de demonstração**.

## Roteiro da demonstração

1. **Conta demo (Ana):** início com trilha em andamento, plano da semana, progresso e último resultado.
2. **Novo roadmap:** escreva um objetivo (dados, front-end, inglês ou concurso), gere, edite e aprove.
3. **Plano:** escolha horas, prazo e dias. Marque atividades; ao fechar uma etapa, a trilha avança.
4. **Avaliação:** a IA gera as questões, corrige e mostra o aproveitamento por conteúdo. Abaixo de 70%, sugere revisão e materiais, e você decide se entra no plano.
5. **Conta nova:** "Criar conta" leva ao onboarding e começa do zero.

Para mostrar exceções: CPF `123.456.789-00` já cadastrado; arquivo que não é PDF; prazo curto demais no plano (sobrecarga); `/roadmaps/novo?falha` simula a IA fora do ar (RNF11). Em **Conta → Reiniciar demonstração** tudo volta ao início.

## Estrutura

```
prototipo/src/
  pages/        uma pasta por área: auth, onboarding, inicio, roadmaps, plano, progresso, avaliacao, conta
  components/   peças de interface (trilha, botões, tela da IA, confete, avisos)
  layouts/      moldura das telas logadas e de login
  state/        estado da aplicação e cálculos de progresso
  data/         tipos, IA simulada, banco de questões e dados da conta demo
```

Stack: React 18, Vite, Tailwind CSS 4, React Router e ícones Lucide.

## Equipe

- Daniel Bernardes, desenvolvimento
- Eduarda Pilon, desenvolvimento
- Matheus Pagel, documentação
- Vitor Mateus, UI/UX
- Pablo Caldeira, análise e liderança
