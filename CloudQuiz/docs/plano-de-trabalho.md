# Plano de Trabalho — CloudQuiz

**Disciplina:** Desenvolvimento de Software em Nuvem  
**Projeto:** CloudQuiz — Desafio do Conhecimento  
**Equipe:** preencher com os nomes reais dos integrantes  
**Data:** 28/10/2026

## 1. Introdução
O CloudQuiz é um mini-game de perguntas e respostas sobre programação, desenvolvimento web e computação em nuvem. O jogador responde a cinco questões por rodada, recebe feedback imediato e acumula 100 pontos por resposta correta. Ao final, o sistema apresenta o resultado e registra a pontuação para compor o placar.

A arquitetura separa a interface do serviço de dados. O frontend será desenvolvido com HTML, CSS e JavaScript, em ambiente como VS Code ou Replit. O Back4App, baseado no Parse Server, será utilizado como BaaS para autenticação e persistência de pontuações. O GitHub manterá o histórico do código e automatizará verificações. O Azure Static Web Apps será utilizado para publicar a versão estática do frontend.

O uso de serviços gerenciados reduz a necessidade de administrar servidores e permite concentrar o esforço na lógica do jogo, na experiência do jogador e na integração entre os componentes.

## 2. Formação do grupo e papéis
Preencher com os integrantes reais antes da entrega. Em grupo de três pessoas, algumas responsabilidades podem ser acumuladas.

- **Gerente de Projeto:** organiza tarefas, acompanha cronograma e registra decisões.
- **Desenvolvedor Backend:** configura o Back4App, autenticação e persistência.
- **Desenvolvedor Frontend:** implementa interface, perguntas, regras e pontuação.
- **Banco de Dados/DevOps:** modela os dados, mantém GitHub e workflow, apoia testes e deploy.

## 3. Escolha do projeto
**Tema:** CloudQuiz, jogo de perguntas e respostas.  
**Público-alvo:** estudantes que desejam praticar conceitos introdutórios de tecnologia.  
**Funcionalidade central:** responder questões, calcular pontuação e consultar o placar.  
**Tecnologias:** HTML, CSS, JavaScript, Parse SDK, Back4App, GitHub Actions e Azure Static Web Apps.

## 4. Templates e ambiente
O frontend será implementado com HTML/CSS/JS puro, opção prevista no enunciado. O desenvolvimento pode ocorrer no VS Code ou Replit. O Parse SDK no navegador fará a comunicação com o Back4App. O GitHub será usado para controle de versão e execução de verificações automáticas.

## 5. Arquitetura e versionamento
```text
                 ┌─────────────────────────────┐
                 │          Jogador             │
                 └──────────────┬──────────────┘
                                │ navegador
                                ▼
                 ┌─────────────────────────────┐
                 │ Frontend CloudQuiz           │
                 │ HTML + CSS + JavaScript      │
                 │ VS Code/Replit               │
                 └──────────────┬──────────────┘
                                │ Parse SDK / HTTPS
                                ▼
                 ┌─────────────────────────────┐
                 │ Back4App / Parse Server      │
                 │ Usuários + classe Score      │
                 └─────────────────────────────┘

 Código-fonte → GitHub → GitHub Actions → Azure Static Web Apps
```

**Branches planejadas:**
- `main`: versão estável e pronta para demonstração.
- `dev`: integração de funcionalidades em desenvolvimento.
- `feature/quiz`: implementação das perguntas e regras.
- `feature/placar`: persistência e exibição de pontuações.
- `feature/back4app`: autenticação e integração com o serviço de dados.

Fluxo proposto: criar branch de funcionalidade, implementar e testar, enviar ao GitHub, abrir Pull Request para `dev` e integrar após revisão. A versão demonstrável é publicada a partir de `main`.

## 6. Escopo e requisitos

### Requisitos funcionais
- **RF01:** O sistema deve permitir iniciar uma rodada de cinco perguntas e selecionar uma alternativa por pergunta.
- **RF02:** O sistema deve informar se a resposta está correta, atualizar a pontuação e exibir o resultado final.
- **RF03:** O sistema deve registrar pontuações e exibir um placar ordenado da maior para a menor pontuação; com Back4App configurado, deve permitir cadastro e login de jogadores.

### Requisitos não funcionais
- **RNF01:** A interface deve ser responsiva e utilizável em navegadores modernos para desktop e celular.
- **RNF02:** O feedback de resposta deve aparecer imediatamente após a seleção; as operações remotas devem apresentar mensagens claras em caso de falha.

## 7. Protótipos das telas
**Tela inicial:** logotipo CloudQuiz, breve descrição, campo de nome, botão “Iniciar desafio” e indicador de conexão.

**Tela de jogo:** contador de perguntas, barra de progresso, categoria, enunciado, quatro alternativas e feedback após a escolha.

**Tela de placar:** lista ordenada com posição, nome do jogador, data e pontuação, além do botão para atualizar.

## 8. Modelo de dados Back4App
A autenticação utiliza a classe padrão `_User` do Parse:
- `username` (String): nome de usuário.
- `password`: gerenciado pelo Parse; não deve ser lido ou armazenado pela aplicação.
- `displayName` (String): nome apresentado na interface.

Classe `Score`:
- `playerName` (String): nome exibido no placar.
- `points` (Number): pontuação obtida.
- `correctAnswers` (Number): quantidade de respostas corretas.
- `totalQuestions` (Number): total de questões da rodada.
- `playedAt` (Date): data e hora da partida.
- `player` (Pointer para `_User`, opcional): usuário associado à partida.

## 9. Cronograma de execução
| Etapa | Atividade | Resultado |
|---|---|---|
| 1 | Definir tema, escopo e papéis | Plano de trabalho |
| 2 | Criar interface e regras do jogo | Mini-game funcional localmente |
| 3 | Configurar Back4App e modelo Score | Persistência e autenticação |
| 4 | Versionar e automatizar verificações | Repositório e workflow |
| 5 | Publicar frontend no Azure | URL de produção |
| 6 | Testar e preparar demonstração | Evidências e apresentação |

## 10. Testes e critérios de aceite
- Iniciar uma rodada e confirmar que são apresentadas cinco perguntas.
- Selecionar uma resposta e confirmar que não é possível responder duas vezes à mesma pergunta.
- Confirmar que cada acerto adiciona 100 pontos e que o resultado final corresponde aos acertos.
- Atualizar o placar e verificar a ordenação.
- Com Back4App configurado, testar cadastro, login e persistência após recarregar a página.
- Abrir a URL do Azure em janela privada ou outro dispositivo e verificar o carregamento.

## 11. Limitações e decisões
O jogo foi intencionalmente mantido em HTML/CSS/JS para reduzir a complexidade de build. Sem credenciais e configuração do Back4App, o jogo funciona em modo local e o placar não é global. A publicação no Azure depende da conexão do repositório e da conclusão do workflow de deploy. Essas etapas precisam ser verificadas antes de declarar a entrega concluída.
