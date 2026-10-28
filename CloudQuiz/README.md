# CloudQuiz — Desafio do Conhecimento

Mini-game acadêmico desenvolvido com HTML, CSS e JavaScript, com opção de integração ao Back4App (Parse), autenticação, persistência de pontuações e placar.

## Executar localmente
1. Baixe/extraia a pasta do projeto.
2. Abra a pasta no VS Code.
3. Abra `index.html` no navegador. Para uma experiência melhor, use a extensão Live Server do VS Code.
4. O jogo funciona sem conta e salva pontuações no `localStorage` do navegador.

## Ativar Back4App
1. Crie uma aplicação no Back4App usando Parse Server.
2. Em **App Settings > Security & Keys**, copie o **Application ID** e a **JavaScript Key**.
3. Cole esses dois valores em `config.js`. Não use a Master Key no frontend.
4. Na seção de Database/Browser do Back4App, confira as permissões (CLP) das classes necessárias para o cenário de demonstração.
5. A classe `Score` é criada pelo Parse na primeira gravação, caso a configuração permita. Campos usados: `playerName` (String), `points` (Number), `correctAnswers` (Number), `totalQuestions` (Number), `playedAt` (Date), `player` (Pointer para _User, opcional).
6. Teste criar conta, entrar, jogar e atualizar o placar. Se a configuração de segurança bloquear operações, ajuste as permissões com cuidado e documente o que foi habilitado.

**Importante:** chaves colocadas no frontend são públicas por natureza. Use apenas a JavaScript Key destinada ao cliente, restrinja permissões e nunca publique a Master Key.

## Publicar no GitHub
```powershell
git init
git add .
git commit -m "feat: cria jogo CloudQuiz"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/cloudquiz.git
git push -u origin main
```
Troque `SEU-USUARIO` pela sua conta e crie antes o repositório vazio no GitHub. Se o remoto já existir, não repita `git remote add origin`.

## Publicar no Azure Static Web Apps
1. Envie os arquivos ao GitHub.
2. No portal Azure, crie um recurso **Static Web App**.
3. Conecte a conta GitHub e escolha o repositório e a branch `main`.
4. Como é um site estático, configure a localização do código como `/`, a pasta de build como vazia ou `/`, conforme o formulário apresentado, e nenhuma API.
5. Conclua a criação e aguarde o workflow criado pelo Azure terminar.
6. Abra a URL pública fornecida pelo Azure e teste o jogo.

A interface local e o armazenamento local funcionam sem nuvem. Só afirme que o Back4App e o Azure estão integrados/publicados depois de testar de verdade.

## Testes
O workflow em `.github/workflows/tests.yml` verifica se os arquivos principais existem e se o JavaScript pode ser analisado pelo Node.js. Não substitui testes manuais da autenticação, da gravação no Back4App nem do deploy Azure.
