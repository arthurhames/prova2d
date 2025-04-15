
const canvas = document.getElementById('JogoCanvas')
const ctx = canvas.getContext('2d')

document.addEventListener('keypress', (e) => {
if(e.code=='Space'){
    jogo.personagem.saltar()
}
})
class Entidade {
#x
#y
constructor(x, y, largura, altura, cor){
    this.#x = x;
    this.#y = y;
    this.largura = largura;
    this.altura = altura;
    this.cor = cor
}
desenhar () {
    ctx.fillStyle = this.cor
    ctx.fillRect(this.#x, this.#y, this.largura, this.altura)
}
get x () {
    return this.#x
}
set x (valor) {
    //adicionar uma condição para verificar quem pode mexer
    this.#x = valor
}
get y () {
    return this.#y
}
set y (valor) {
    //adicionar uma condição para verificar quem pode mexer
    this.#y = valor
}
}
class Personagem extends Entidade{
#velocidade_y
constructor(x, y, largura, altura, cor){
    super(x, y, largura, altura, cor)
    this.#velocidade_y = 0
    this.pulando = false
    this.imagem = new Image()
    this.imagem.src = '../jogo2D/static/personagem.png'
}
saltar(){
    this.#velocidade_y = 15
    this.pulando = true
}
atualizar(){
    if (this.pulando) {
        this.y -= this.#velocidade_y
        this.#velocidade_y -= Jogo.gravidade
        if (this.y >= canvas.height - 50) {
            this.#velocidade_y = 0
            this.y = canvas.height - 50
            this.pulando = false
        }
    }
}
verificaColisão(obstaculo){
    if (
        obstaculo.x < this.x + this.largura &&
        obstaculo.largura + obstaculo.x > this.x &&
        this.y < obstaculo.y + obstaculo.altura &&
        this.y + this.altura > obstaculo.y
    ) {
        obstaculo.velocidade_x = 0
        this.velocidade_y = 0
        ctx.fillStyle = 'black'
        ctx.font = '50px Arial'
        ctx.fillText('GAME OVER', 50, 100)
        Jogo.gameOver = true
        ctx.font = '20px Arial'
        if (Jogo.pontuacao_atual > Jogo.pontuacao_maxima) {
            localStorage.setItem('PM', Jogo.pontuacao_atual)
            ctx.fillText(`Novo Record: ${Jogo.pontuacao_atual}`, 50, 150)
            return
        }
        ctx.fillText(`Pontos da jogada: ${Jogo.pontuacao_atual}`, 50, 150)
    }
}
desenhar(){
    ctx.drawImage(
        this.imagem,
        this.x,
        this.y,
        this.largura,
        this.altura )
}
}
class Obstaculo extends Entidade{
#velocidade_x
constructor(x, y, largura, altura, cor, velocidade=3){
    super(x, y, largura, altura, cor)
    this.#velocidade_x = velocidade
    this.imagem = new Image()
    this.imagem.src = '../jogo2D/static/cacto.png'
    this.time_to_next = Math.floor(Math.random() * 200) + 300
    this.criou_novo = false
}
atualizar(){
    this.x -= this.#velocidade_x
if (this.x <= 0 - this.largura) { //se chegou no final
    jogo.obstaculos.splice()
}
if (this.time_to_next > this.x && this.criou_novo == false){
    jogo.criarNovoObstaculo()
    this.criou_novo = true
    
}
}
desenhar(){
    ctx.drawImage(
        this.imagem,
        this.x,
        this.y,
        this.largura,
        this.altura )
}
}
class Jogo{
static gravidade = 0.5
static gameOver = false
static pontuacao_atual = 0
static pontuacao_maxima = localStorage.getItem('PM') ? localStorage.getItem('PM') : 0
constructor(){
    this.loop = this.loop.bind(this)
    this.personagem = new Personagem(100, canvas.height - 50, 50, 50, 'blue')
    this.obstaculos = [new Obstaculo(canvas.width - 50, canvas.height - 100, 50, 100)]
}
loop () { 
    if (!Jogo.gameOver){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.mostrarPontuacao()
        this.obstaculos.forEach(obstaculo => {
            obstaculo.desenhar()
            obstaculo.atualizar(jogo)
            this.personagem.verificaColisão(obstaculo)
        });
        this.personagem.desenhar()
        this.personagem.atualizar()
        Jogo.pontuacao_atual += 1
        requestAnimationFrame(this.loop)
    }
}
mostrarPontuacao () {
    ctx.font = '20px Arial'
    ctx.fillText(`${Jogo.pontuacao_atual}`, 30, 30)
}
criarNovoObstaculo(){
    let nova_altura = Math.floor(Math.random() * (150 - 90)) + 90 //calcula uma nova altura
    let nova_vel= Math.floor(Math.random()*5)+1
    let novo_y = canvas.height - nova_altura //muda a posicao do personagem
    this.obstaculos.push(new Obstaculo(canvas.width, novo_y, 50, nova_altura, '', nova_vel ))
}
}
const jogo = new Jogo()
jogo.loop()