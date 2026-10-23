# Protótipo navegável do TrilhaAI

Protótipo clicável das telas do TrilhaAI, feito para validar o visual e
apresentar o fluxo na disciplina de Engenharia de Requisitos. **Não é o app
final:** não tem backend, banco, login de verdade nem chamada de IA. Tudo roda
no navegador, com dados de exemplo (Ana, Desenvolvedor Front-end).

**No ar:** https://trilhaai-prototipo.vercel.app

## Como rodar

Precisa de Node 20 ou mais novo.

```bash
cd prototipo
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

- **Login:** `ana@email.com` com qualquer senha. Outro e-mail mostra o erro de
  credenciais.
- **Cadastro:** o CPF `123.456.789-00` simula um CPF já cadastrado.
- **Falha da IA (RNF11):** abra `/roadmaps/novo?falha` e clique em "Gerar
  roadmap"; a primeira tentativa falha e oferece "Tentar de novo".

## Telas e rotas

| Rota | Tela | Casos de uso |
|---|---|---|
| `/` | Login | UC02.1 |
| `/cadastro` | Cadastro | UC01.1 |
| `/inicio` | Início (home) | RF06.4, RF06.1 |
| `/conta` | Conta | UC01.2, UC01.3, UC02.2 |
| `/roadmaps` | Meus roadmaps | UC04.2 |
| `/roadmaps/novo` | Gerar roadmap | UC04.1, UC03.1, UC03.2 |
| `/roadmaps/novo/revisar` | Revisar informações extraídas | UC03.3, RF03.4 |
| `/roadmaps/novo-roadmap` | Roadmap gerado, aguardando aprovação | UC04.2 a UC04.5 |
| `/plano/novo` | Montar plano de estudos | UC05.1 |
| `/plano` | Plano da semana | UC05.2 a UC05.4, UC06.1, UC06.2 |
| `/progresso` | Progresso e histórico | UC06.3, UC06.4 |
| `/avaliacao` | Avaliação | UC07.1, UC07.2 |
| `/avaliacao/resultado` | Resultado e reforço | UC07.3, UC07.4, UC08.1 a UC08.3 |

Fluxo principal para apresentar: Login → Início → Minha trilha → Novo roadmap
→ Gerar → Revisar → Confirmar → Aprovar roadmap → Gerar plano → Plano da
semana (marcar e desfazer) → Avaliações → Resultado → Adicionar revisão ao
plano.

## Stack

React 18, Vite 6, Tailwind CSS 4, React Router 6 e ícones Lucide. A fonte é
Nunito. As cores e o mascote vêm do brand book do projeto. A escolha vale só
para o protótipo; a stack do produto ainda não foi decidida.

## Organização

- `src/pages/`: uma tela por arquivo, com o número da tela de referência
  comentado.
- `src/components/`: barra lateral, trilha pontilhada, botões, cartões e
  mascote.
- `src/data/mock.ts`: todos os dados de exemplo.
- `src/data/estado.tsx`: estado em memória (atividades concluídas, aprovação
  do roadmap, documento enviado e avisos).
