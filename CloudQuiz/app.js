(() => {
  "use strict";
  const QUESTIONS = [
    {category:"PROGRAMAÇÃO",q:"Qual linguagem é executada diretamente pelo navegador para adicionar interatividade a páginas web?",a:["Java","JavaScript","C","SQL"],correct:1,explanation:"JavaScript é amplamente executado nos navegadores para criar interatividade."},
    {category:"NUVEM",q:"O que significa SaaS?",a:["Software as a Service","Storage as a System","Security as a Server","Software and Source"],correct:0,explanation:"SaaS é Software como Serviço: o usuário acessa o software pela internet."},
    {category:"GIT",q:"Qual comando registra um conjunto de alterações no histórico local do Git?",a:["git push","git status","git commit","git clone"],correct:2,explanation:"git commit cria um registro das alterações preparadas na área de staging."},
    {category:"BANCO DE DADOS",q:"Qual linguagem é usada principalmente para consultar bancos de dados relacionais?",a:["HTML","CSS","SQL","HTTP"],correct:2,explanation:"SQL permite consultar e manipular dados em bancos relacionais."},
    {category:"WEB",q:"Qual tecnologia define a estrutura do conteúdo de uma página web?",a:["HTML","CSS","Git","JSON"],correct:0,explanation:"HTML organiza os elementos e a estrutura do conteúdo."},
    {category:"NUVEM",q:"O que caracteriza um serviço PaaS?",a:["Venda de computadores físicos","Plataforma gerenciada para desenvolver e executar aplicações","Somente armazenamento local","Uma linguagem de programação"],correct:1,explanation:"PaaS fornece uma plataforma gerenciada para desenvolver, executar e publicar aplicações."},
    {category:"SEGURANÇA",q:"Qual é a prática mais segura para uma chave administrativa secreta?",a:["Publicar no GitHub","Colocar no HTML público","Compartilhar no README","Mantê-la fora do frontend e do repositório"],correct:3,explanation:"Segredos administrativos nunca devem ser enviados ao navegador nem publicados no repositório."},
    {category:"JAVASCRIPT",q:"Qual palavra declara uma variável cujo valor pode ser reatribuído em JavaScript moderno?",a:["const","let","static","define"],correct:1,explanation:"let declara uma variável de escopo de bloco que pode receber outro valor."},
    {category:"API",q:"Para que serve uma API?",a:["Conectar sistemas por meio de uma interface definida","Desenhar imagens somente","Substituir todo banco de dados","Aumentar a resolução do monitor"],correct:0,explanation:"Uma API define como sistemas ou componentes trocam informações e solicitam operações."},
    {category:"GIT",q:"Qual comando envia commits locais para um repositório remoto?",a:["git add","git init","git push","git log"],correct:2,explanation:"git push publica commits locais em um repositório remoto configurado."}
  ];
  const $ = id => document.getElementById(id);
  const state = {questions:[],index:0,score:0,answered:false,player:"Visitante",user:null,cloud:false};
  const STORAGE_KEY = "cloudquiz_scores_v1";
  const configured = () => {
    const c = window.CLOUDQUIZ_CONFIG || {};
    return !!(c.appId && c.javascriptKey && !c.appId.includes("COLE_") && !c.javascriptKey.includes("COLE_") && window.Parse);
  };
  if (configured()) {
    try {
      Parse.initialize(CLOUDQUIZ_CONFIG.appId, CLOUDQUIZ_CONFIG.javascriptKey);
      Parse.serverURL = CLOUDQUIZ_CONFIG.serverURL || "https://parseapi.back4app.com/";
      state.cloud = true;
      $("connection-status").innerHTML = "<i></i> Back4App conectado";
      $("storage-note").textContent = "Persistência na nuvem habilitada";
    } catch (e) { console.warn("Back4App não inicializado:", e); }
  }
  const shuffle = arr => arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
  function localScores(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");}catch{return [];}}
  function saveLocal(record){const rows=localScores();rows.push(record);rows.sort((a,b)=>b.score-a.score);localStorage.setItem(STORAGE_KEY,JSON.stringify(rows.slice(0,50)));}
  async function saveScore(record){
    saveLocal(record);
    if(state.cloud){
      try{
        const Score=Parse.Object.extend("Score");
        const row=new Score();
        row.set("playerName",record.name);row.set("points",record.score);row.set("correctAnswers",record.correct);row.set("totalQuestions",record.total);row.set("playedAt",new Date(record.date));
        if(state.user)row.set("player",state.user);
        await row.save();
      }catch(e){console.warn("Pontuação salva localmente; falha na nuvem:",e);toast("Pontuação salva neste navegador. Confira a configuração do Back4App.");}
    }
    renderBoard();
  }
  async function getScores(){
    if(state.cloud){
      try{
        const Score=Parse.Object.extend("Score");const query=new Parse.Query(Score);
        query.descending("points");query.limit(10);const rows=await query.find();
        if(rows.length || localScores().length===0)return rows.map(o=>({name:o.get("playerName")||"Jogador",score:o.get("points")||0,date:(o.get("playedAt")||o.createdAt).toISOString()}));
      }catch(e){console.warn("Falha ao buscar placar na nuvem:",e);}
    }
    return localScores().sort((a,b)=>b.score-a.score).slice(0,10);
  }
  async function renderBoard(){
    const list=$("leaderboard-list");list.innerHTML='<div class="empty-board">Carregando placar...</div>';
    const rows=await getScores();
    if(!rows.length){list.innerHTML='<div class="empty-board">Ainda não há pontuações. Seja o primeiro!</div>';return;}
    list.innerHTML=rows.map((r,i)=>`<div class="board-row"><div class="rank ${i<3?"top":""}">${String(i+1).padStart(2,"0")}</div><div><div class="board-name">${escapeHTML(r.name||"Jogador")}</div><div class="board-date">${new Date(r.date).toLocaleDateString("pt-BR")}</div></div><div class="board-score">${Number(r.score)||0} pts</div></div>`).join("");
  }
  function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function start(){
    state.player=$("player-name").value.trim().slice(0,24)||"Visitante";
    state.questions=shuffle(QUESTIONS).slice(0,5);state.index=0;state.score=0;state.answered=false;
    $("start-panel").classList.add("hidden");$("result-panel").classList.add("hidden");$("question-panel").classList.remove("hidden");
    showQuestion();
  }
  function showQuestion(){
    const item=state.questions[state.index];state.answered=false;
    $("question-counter").textContent=`Pergunta ${state.index+1} de ${state.questions.length}`;
    $("progress-bar").style.width=`${(state.index/state.questions.length)*100}%`;
    $("category").textContent=item.category;$("points-label").textContent="100 pontos";
    $("question-text").textContent=item.q;$("feedback").className="feedback hidden";$("next-question").classList.add("hidden");
    const answers=$("answers");answers.innerHTML="";
    item.a.forEach((answer,i)=>{const b=document.createElement("button");b.className="answer";b.innerHTML=`<span class="answer-key">${String.fromCharCode(65+i)}</span><span>${escapeHTML(answer)}</span>`;b.addEventListener("click",()=>choose(i));answers.appendChild(b);});
  }
  function choose(selected){
    if(state.answered)return;state.answered=true;
    const item=state.questions[state.index];const buttons=[...$("answers").querySelectorAll("button")];
    buttons.forEach((b,i)=>{b.disabled=true;if(i===item.correct)b.classList.add("correct");if(i===selected&&i!==item.correct)b.classList.add("wrong");});
    const ok=selected===item.correct;if(ok)state.score+=100;
    const feedback=$("feedback");feedback.className=`feedback ${ok?"good":"bad"}`;feedback.textContent=(ok?"Resposta correta! +100 pontos. ":"Não foi dessa vez. ")+item.explanation;
    $("next-question").classList.remove("hidden");$("next-question").textContent=state.index===state.questions.length-1?"Ver resultado ✓":"Próxima pergunta →";
    $("progress-bar").style.width=`${((state.index+1)/state.questions.length)*100}%`;
  }
  async function finish(){
    $("question-panel").classList.add("hidden");$("result-panel").classList.remove("hidden");$("question-counter").textContent="Rodada finalizada";
    $("final-score").textContent=state.score;$("result-title").textContent=state.score===500?"Perfeito!":state.score>=300?"Mandou bem!":"Continue praticando!";
    $("result-message").textContent=`${state.player}, você acertou ${state.score/100} de 5 perguntas. ${state.cloud?"Resultado enviado ao Back4App quando possível.":"Seu resultado será salvo neste navegador."}`;
    await saveScore({name:state.player,score:state.score,correct:state.score/100,total:5,date:new Date().toISOString()});
  }
  $("start-game").addEventListener("click",start);
  $("next-question").addEventListener("click",()=>{if(state.index<state.questions.length-1){state.index++;showQuestion();}else finish();});
  $("play-again").addEventListener("click",()=>{$("start-panel").classList.remove("hidden");$("result-panel").classList.add("hidden");$("question-counter").textContent="Pronto para começar";$("progress-bar").style.width="0";});
  $("view-board").addEventListener("click",()=>$("leaderboard").scrollIntoView({behavior:"smooth"}));
  $("refresh-board").addEventListener("click",renderBoard);
  $("auth-open").addEventListener("click",()=>{$("auth-modal").classList.remove("hidden");$("auth-message").textContent=state.cloud?"Entre ou crie sua conta no Back4App.":"Para ativar contas na nuvem, configure as chaves em config.js.";});
  $("auth-close").addEventListener("click",()=>$("auth-modal").classList.add("hidden"));
  $("auth-modal").addEventListener("click",e=>{if(e.target===$("auth-modal"))$("auth-modal").classList.add("hidden");});
  async function auth(signup){
    if(!state.cloud){$("auth-message").textContent="Back4App ainda não configurado. Você pode jogar sem conta.";return;}
    const username=$("auth-username").value.trim(),password=$("auth-password").value;
    if(!username||password.length<6){$("auth-message").textContent="Informe usuário e senha com pelo menos 6 caracteres.";return;}
    try{
      const user=signup?await Parse.User.signUp(username,password,{displayName:username}):await Parse.User.logIn(username,password);
      state.user=user;state.player=user.get("displayName")||user.get("username");$("user-label").textContent=state.player;$("auth-open").classList.add("hidden");$("logout").classList.remove("hidden");$("player-name").value=state.player;$("auth-modal").classList.add("hidden");toast(signup?"Conta criada com sucesso!":"Login realizado com sucesso.");renderBoard();
    }catch(e){$("auth-message").textContent=e.message||"Não foi possível autenticar. Confira os dados e as permissões no Back4App.";}
  }
  $("login").addEventListener("click",()=>auth(false));$("signup").addEventListener("click",()=>auth(true));
  $("logout").addEventListener("click",async()=>{if(state.cloud){try{await Parse.User.logOut();}catch{}}state.user=null;state.player="Visitante";$("user-label").textContent="Visitante";$("auth-open").classList.remove("hidden");$("logout").classList.add("hidden");toast("Você saiu da conta.");});
  let toastTimer;
  function toast(msg){const el=$("toast");el.textContent=msg;el.classList.remove("hidden");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.add("hidden"),3200);}
  renderBoard();
  window.CloudQuiz = {questions:QUESTIONS, localScores, saveLocal, shuffle};
})();
