// Questões que a "IA" devolve por etapa (chave: modelo:etapa).
// Etapas sem banco recebem questões gerais montadas em ia.ts.
import type { Questao } from './tipos'

export const bancoDeQuestoes: Record<string, Questao[]> = {
  'frontend:JavaScript': [
    { conteudo: 'Funções e escopo', enunciado: 'Qual palavra-chave declara uma variável que não pode ser reatribuída?', opcoes: ['let', 'const', 'var', 'static'], correta: 1, explicacao: 'const impede reatribuição; let e var permitem.' },
    { conteudo: 'Funções e escopo', enunciado: 'O que é exibido no console?', codigo: 'let x = 1;\nfunction f() { let x = 2; return x; }\nconsole.log(f(), x);', opcoes: ['2 2', '1 1', '2 1', 'undefined 1'], correta: 2, explicacao: 'O x de dentro da função vive em outro escopo; o de fora continua valendo 1.' },
    { conteudo: 'Funções e escopo', enunciado: 'O que uma arrow function não tem?', opcoes: ['Parâmetros', 'this próprio', 'Retorno', 'Corpo'], correta: 1, explicacao: 'Arrow functions herdam o this do escopo onde foram criadas.' },
    { conteudo: 'Manipulação do DOM', enunciado: 'Qual método seleciona o primeiro elemento que casa com um seletor CSS?', opcoes: ['querySelectorAll', 'getElementsByClassName', 'querySelector', 'getElementById'], correta: 2, explicacao: 'querySelector devolve o primeiro; querySelectorAll devolve todos.' },
    { conteudo: 'Manipulação do DOM', enunciado: 'Qual evento dispara quando o usuário clica em um botão?', opcoes: ['click', 'change', 'submit', 'input'], correta: 0, explicacao: 'click dispara no clique; submit é do formulário.' },
    { conteudo: 'Manipulação do DOM', enunciado: 'Qual propriedade troca só o texto de um elemento, sem interpretar HTML?', opcoes: ['innerHTML', 'textContent', 'outerHTML', 'value'], correta: 1, explicacao: 'textContent trata tudo como texto, o que também evita injeção de HTML.' },
    { conteudo: 'APIs REST', enunciado: 'O que fetch() retorna?', opcoes: ['Um objeto JSON', 'Uma string', 'Uma Promise', 'Um array'], correta: 2, explicacao: 'fetch é assíncrono: devolve uma Promise que resolve com a resposta.' },
    { conteudo: 'APIs REST', enunciado: 'Como ler o corpo JSON de uma resposta do fetch?', opcoes: ['resposta.body', 'await resposta.json()', 'JSON(resposta)', 'resposta.text'], correta: 1, explicacao: 'json() também é assíncrono, por isso o await.' },
    { conteudo: 'APIs REST', enunciado: 'Qual código de status HTTP indica sucesso?', opcoes: ['404', '500', '301', '200'], correta: 3, explicacao: 'A família 2xx indica sucesso; 200 é o "OK".' },
  ],
  'dados:Python básico': [
    { conteudo: 'Variáveis e tipos', enunciado: 'Qual é o tipo de 3.14 em Python?', opcoes: ['int', 'float', 'str', 'decimal'], correta: 1, explicacao: 'Números com casa decimal são float.' },
    { conteudo: 'Variáveis e tipos', enunciado: 'O que type("10") retorna?', opcoes: ["<class 'int'>", "<class 'str'>", "<class 'float'>", "<class 'number'>"], correta: 1, explicacao: 'Entre aspas é texto, mesmo que pareça número.' },
    { conteudo: 'Listas e dicionários', enunciado: 'Como pegar o último item da lista nums?', opcoes: ['nums[last]', 'nums[-1]', 'nums.end()', 'nums[len(nums)]'], correta: 1, explicacao: 'Índices negativos contam do fim; -1 é o último.' },
    { conteudo: 'Listas e dicionários', enunciado: 'Como ler o valor da chave "nome" no dicionário p?', opcoes: ['p.nome', 'p("nome")', 'p["nome"]', 'p->nome'], correta: 2, explicacao: 'Dicionários usam colchetes com a chave.' },
    { conteudo: 'Funções', enunciado: 'Qual palavra-chave define uma função?', opcoes: ['func', 'function', 'def', 'fn'], correta: 2, explicacao: 'Em Python, funções começam com def.' },
    { conteudo: 'Funções', enunciado: 'O que é exibido?', codigo: 'def dobro(n):\n    return n * 2\n\nprint(dobro(4))', opcoes: ['8', '44', 'n * 2', 'None'], correta: 0, explicacao: 'dobro(4) devolve 4 * 2 = 8.' },
  ],
  'ingles:Comunicação': [
    { conteudo: 'Apresentação pessoal', enunciado: 'Qual frase abre bem uma entrevista?', opcoes: ["Hi, I'm Ana. Nice to meet you.", 'Hello, give me the job.', 'Who are you?', 'I am fine, and you?'], correta: 0, explicacao: 'Cumprimento + nome + "nice to meet you" é o padrão cordial.' },
    { conteudo: 'Apresentação pessoal', enunciado: '"Tell me about yourself" pede…', opcoes: ['Sua vida pessoal completa', 'Um resumo profissional curto', 'Seu salário atual', 'Só seus hobbies'], correta: 1, explicacao: 'O esperado é um resumo de 1 a 2 minutos da trajetória profissional.' },
    { conteudo: 'Small talk', enunciado: 'Resposta natural para "How was your weekend?"', opcoes: ['Yes, I was.', 'It was great, I went hiking.', 'I am weekend.', 'No, thanks.'], correta: 1, explicacao: 'Responda com uma frase curta e um detalhe.' },
    { conteudo: 'Small talk', enunciado: 'Small talk serve para…', opcoes: ['Negociar salário', 'Criar conexão antes do assunto principal', 'Testar gramática', 'Encerrar a conversa'], correta: 1, explicacao: 'É a conversa leve que quebra o gelo.' },
    { conteudo: 'Pronúncia', enunciado: 'Em "developer", a sílaba tônica é…', opcoes: ['de', 've', 'lo', 'per'], correta: 1, explicacao: 'de-VE-lo-per.' },
    { conteudo: 'Pronúncia', enunciado: 'O "th" de "think" soa como…', opcoes: ['t', 'f', 'língua entre os dentes', 's'], correta: 2, explicacao: 'O th surdo sai com a língua entre os dentes, soprando o ar.' },
  ],
  'concurso:Língua Portuguesa': [
    { conteudo: 'Interpretação de texto', enunciado: 'Inferir uma informação significa…', opcoes: ['Copiar um trecho literal', 'Deduzir algo não dito explicitamente', 'Discordar do autor', 'Resumir o título'], correta: 1, explicacao: 'Inferência é a conclusão que o texto permite, mesmo sem dizer.' },
    { conteudo: 'Interpretação de texto', enunciado: 'A ideia principal de um texto costuma estar…', opcoes: ['Só no título', 'Na tese defendida pelo autor', 'Nas palavras difíceis', 'No último parágrafo, sempre'], correta: 1, explicacao: 'A tese organiza o texto; o resto a sustenta.' },
    { conteudo: 'Concordância', enunciado: 'Qual frase está correta?', opcoes: ['Fazem dois anos que estudo.', 'Faz dois anos que estudo.', 'Fazem dois ano que estudo.', 'Faz dois anos que estudamos-se.'], correta: 1, explicacao: '"Fazer" indicando tempo é impessoal: fica no singular.' },
    { conteudo: 'Concordância', enunciado: 'Qual frase está correta?', opcoes: ['Haviam muitos candidatos.', 'Houveram muitos candidatos.', 'Havia muitos candidatos.', 'Haverão muitos candidatos.'], correta: 2, explicacao: '"Haver" no sentido de existir é impessoal.' },
    { conteudo: 'Pontuação', enunciado: 'Onde a vírgula está correta?', opcoes: ['Os candidatos, estudaram muito.', 'Ana, estude hoje.', 'Eu, gosto de estudar.', 'O edital saiu, ontem.'], correta: 1, explicacao: 'O vocativo (Ana) é separado por vírgula.' },
    { conteudo: 'Pontuação', enunciado: 'A vírgula NÃO deve separar…', opcoes: ['Sujeito e verbo', 'Vocativo', 'Itens de uma enumeração', 'Aposto explicativo'], correta: 0, explicacao: 'Sujeito e verbo nunca são separados por vírgula.' },
  ],
}
