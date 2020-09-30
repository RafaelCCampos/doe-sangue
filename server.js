// configurando o servidor
const express = require("express")
const server = express()
 
//configurando o servidor para apresentar arquivos estáticos
server.use(express.static("public"))

//habilitar body do formulário
server.use(express.urlencoded({ extended: true}))

//configurar a conexão com o banco de dados
//comentando pq farei através de poolconnection

/*
const mysql = require("mysql")

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootPassword',
    database: 'blood_donation',
}) 

con.connect((err)=> {
     if (err) {
         console.log('Erro connecting database...', err)
         return
     }

     console.log('Connection established!')
})

con.query('select * from donor', function(err,rows,fields){
    if(!err) 
        console.log('os dados são: ', rows)
    else
        console.log('Houve erro ao rodar a query.')
})

*/

const pool = require("mysql").createPool({
    connectionLimit: 20,
    host: 'localhost',
    user: 'root',
    password: 'rootPassword',
    database: 'blood_donation',
    debug: false,
})

const db = pool;
db.getConnection(function (err, connection){
    if(err){
        console.log('Error in connection database' + err)
        return
    }
  console.log('connected as id ' + connection.threadId)
})

//configurando a template engine
const nunjucks = require("nunjucks")

nunjucks.configure("./", {
    express: server,
    //,noCache: true // nao foi necessário o noCache para atualiar o template
})

//configurar a apresentação da página
server.get("/", function(req, res){
    query = 'SELECT * FROM donor'
    db.query(query, (err, data) => {
        if (err) return res.send("Erro de banco de dados.") 

        const donors = data

        return res.render("index.html", {donors})

    })
})

server.post("/", function(req, res){
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood
    
    if (name == ''|| email == ''|| blood == ''){
        //return window.alert('Todos os campos são obrigatórios!')
        return res.send('Todos os campos são obrigatórios!')
    }

    //coloco os valores dentro do bando de dados
    //const query = `INSERT INTO doners(name, email, blood) VALUES($1,$2,$3)`
    const values = [name,email,blood]

    const query = `INSERT INTO donor(name, email, blood) 
                    VALUES('` + values[0]+ "','" + values[1]+ "','" + values[2]+ "')"
    //const query = "INSERT INTO doners(name, email, blood) VALUES('Silvana de Fátima','silvana@gmail.com','A+')"
    db.query(query,values,function(err){
    //db.query(query, function(err){

        //fluxo de erro
        if (err) {
            console.log('erro no banco de dados.')
            return res.send('Erro no banco de dados. ' + err)}
        
        //fluxo ideal
        return res.redirect("/")

    })
})

//ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function()
{   console.log("iniciei o servidor")
})

